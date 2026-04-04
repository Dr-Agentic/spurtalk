// Handle both interest forms
const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://localhost:7101' 
    : '';

async function submitToWaitlist(email) {
    const response = await fetch(`${API_BASE}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    return response.json();
}

function setupForm(formId, messageId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        const messageDiv = document.getElementById(messageId);
        
        if (!email) {
            messageDiv.textContent = 'Please enter a valid email address.';
            messageDiv.style.color = '#f59e0b'; // Warm sand for warning
            return;
        }
        
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            messageDiv.textContent = 'Please enter a valid email address.';
            messageDiv.style.color = '#f59e0b';
            return;
        }
        
        // Disable button during submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Joining...';
        
        try {
            const result = await submitToWaitlist(email);
            messageDiv.textContent = result.message;
            messageDiv.style.color = '#10b981'; // Success sage green
            emailInput.value = '';
        } catch (error) {
            messageDiv.textContent = 'Something went wrong. Please try again.';
            messageDiv.style.color = '#f59e0b';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
        
        // Clear message after 8 seconds
        setTimeout(() => {
            messageDiv.textContent = '';
        }, 8000);
    });
}

// Setup both forms
setupForm('interest-form', 'form-message');
setupForm('interest-form-2', 'form-message');

// Update year in footer
document.getElementById('year').textContent = new Date().getFullYear();