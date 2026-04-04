import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// File-based storage for waitlist (falls back to DB when available)
const WAITLIST_FILE = path.join(__dirname, '../../../data/waitlist.json');

interface WaitlistEntry {
  id: string;
  email: string;
  createdAt: string;
}

function ensureDataDir() {
  const dataDir = path.dirname(WAITLIST_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function getEntries(): WaitlistEntry[] {
  ensureDataDir();
  if (!fs.existsSync(WAITLIST_FILE)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(WAITLIST_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveEntry(email: string): WaitlistEntry {
  const entries = getEntries();
  const entry: WaitlistEntry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    email: email.toLowerCase().trim(),
    createdAt: new Date().toISOString()
  };
  entries.push(entry);
  fs.writeFileSync(WAITLIST_FILE, JSON.stringify(entries, null, 2));
  return entry;
}

// POST /api/waitlist - Add email to waitlist
router.post('/', (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const entries = getEntries();
    
    if (entries.some(e => e.email === normalizedEmail)) {
      res.status(200).json({ success: true, message: "You're already on the list! 💚" });
      return;
    }
    
    saveEntry(normalizedEmail);
    res.status(201).json({ success: true, message: "You're on the list! We'll be in touch soon. 💚" });
  } catch (error) {
    console.error('Waitlist error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// GET /api/waitlist - List all waitlist entries (for admin)
router.get('/', (_req: Request, res: Response) => {
  try {
    const entries = getEntries();
    res.json({ entries });
  } catch (error) {
    console.error('Waitlist fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch waitlist' });
  }
});

export default router;
