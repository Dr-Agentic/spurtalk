/**
 * Simple sound effects for progress celebration
 * In a real app, you might use a library like Howler.js for more sophisticated audio
 */

export class SoundEffects {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private async initAudio() {
    if (!this.audioContext) return;
    if (this.isInitialized) return;

    try {
      await this.audioContext.resume();
      this.isInitialized = true;
    } catch (e) {
      console.warn('Audio context initialization failed:', e);
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  public async playSuccess() {
    await this.initAudio();
    if (!this.audioContext) return;

    // Play a cheerful ascending arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((frequency, index) => {
      setTimeout(() => {
        this.playTone(frequency, 0.2);
      }, index * 150);
    });
  }

  public async playProgress() {
    await this.initAudio();
    if (!this.audioContext) return;

    // Play a subtle rising tone
    this.playTone(440, 0.3, 'triangle');
  }

  public async playLevelUp() {
    await this.initAudio();
    if (!this.audioContext) return;

    // Play a triumphant chord
    const chord = [392.00, 493.88, 587.33]; // G4, B4, D5

    chord.forEach((frequency, index) => {
      setTimeout(() => {
        this.playTone(frequency, 0.5, 'sawtooth');
      }, index * 50);
    });
  }
}

// Export a singleton instance
export const soundEffects = new SoundEffects();