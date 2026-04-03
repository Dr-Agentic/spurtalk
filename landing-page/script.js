document.getElementById('interest-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    const messageDiv = document.getElementById('form-message');
    
    if (!email) {
        messageDiv.textContent = 'Please enter a valid email address.';
        messageDiv.style.color = '#ef4444';
        return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        messageDiv.textContent = 'Please enter a valid email address.';
        messageDiv.style.color = '#ef4444';
        return;
    }
    
    // Here you would typically send the email to a backend service
    // For now, we'll simulate a successful submission
    messageDiv.textContent = 'Thank you! We\'ll notify you soon.';
    messageDiv.style.color = '#10b981';
    emailInput.value = '';
    
    // Clear message after 5 seconds
    setTimeout(() => {
        messageDiv.textContent = '';
    }, 5000);
});

// Update year in footer
document.getElementById('year').textContent = new Date().getFullYear();