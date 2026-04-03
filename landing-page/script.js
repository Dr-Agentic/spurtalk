// Handle both interest forms
function setupForm(formId, messageId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
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
        
        // Simulate successful submission
        messageDiv.textContent = 'You\'re on the list! We\'ll be in touch soon. 💚';
        messageDiv.style.color = '#10b981'; // Success sage green
        emailInput.value = '';
        
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