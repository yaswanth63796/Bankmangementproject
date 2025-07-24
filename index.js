document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const successMessage = document.getElementById('successMessage');
    const applicationIdSpan = document.getElementById('applicationId');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (validateForm()) {
            // Simulate form submission (since we're not using a backend)
            simulateFormSubmission();
        }
    });
    
    function validateForm() {
        let isValid = true;
        
        // Remove all existing error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        // Remove all error classes
        const errorInputs = document.querySelectorAll('.error-input');
        errorInputs.forEach(input => input.classList.remove('error-input'));
        
        // Validate Full Name (letters and spaces only)
        const fullName = document.querySelector('input[name="full_name"]');
        if (!/^[A-Za-z\s]+$/.test(fullName.value)) {
            showError(fullName, 'Name should contain only letters and spaces');
            isValid = false;
        }
        
        // Validate Email
        const email = document.querySelector('input[name="email"]');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate Phone (10 digits)
        const phone = document.querySelector('input[name="phone"]');
        if (!/^\d{10}$/.test(phone.value.replace(/[\s-]/g, ''))) {
            showError(phone, 'Please enter a valid 10-digit phone number');
            isValid = false;
        }
        
        // Validate SSN (XXX-XX-XXXX format)
        const ssn = document.querySelector('input[name="ssn"]');
        if (!/^\d{3}-\d{2}-\d{4}$/.test(ssn.value)) {
            showError(ssn, 'Please enter SSN in XXX-XX-XXXX format');
            isValid = false;
        }
        
        // Validate ZIP Code (5 digits)
        const zipCode = document.querySelector('input[name="zip_code"]');
        if (!/^\d{5}$/.test(zipCode.value)) {
            showError(zipCode, 'Please enter a valid 5-digit ZIP code');
            isValid = false;
        }
        
        // Validate Initial Deposit (must be at least $25)
        const initialDeposit = document.querySelector('input[name="initial_deposit"]');
        if (parseFloat(initialDeposit.value) < 25) {
            showError(initialDeposit, 'Initial deposit must be at least $25');
            isValid = false;
        }
        
        // Validate Date of Birth (must be at least 18 years old)
        const dob = document.querySelector('input[name="dob"]');
        const dobDate = new Date(dob.value);
        const today = new Date();
        const age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }
        
        if (age < 18) {
            showError(dob, 'You must be at least 18 years old to open an account');
            isValid = false;
        }
        
        // Validate ID Expiry Date (must not be expired)
        const idExpiry = document.querySelector('input[name="id_expiry"]');
        const expiryDate = new Date(idExpiry.value);
        
        if (expiryDate < today) {
            showError(idExpiry, 'ID must not be expired');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(input, message) {
        // Add error class to input
        input.classList.add('error-input');
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerText = message;
        
        // Insert error message after input's parent (input-group)
        input.parentElement.insertAdjacentElement('afterend', errorDiv);
    }
    
    function simulateFormSubmission() {
        // Show loading state
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Processing...';
        submitBtn.disabled = true;
        
        // Simulate server delay
        setTimeout(function() {
            // Generate a random application ID
            const today = new Date();
            const dateStr = today.getFullYear().toString() + 
                           (today.getMonth() + 1).toString().padStart(2, '0') + 
                           today.getDate().toString().padStart(2, '0');
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            const applicationId = `APP-${dateStr}-${randomNum}`;
            
            // Hide form and show success message
            form.classList.add('hidden');
            applicationIdSpan.innerText = applicationId;
            successMessage.classList.remove('hidden');
            
            // Reset button state
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    }
    
    // Format SSN as XXX-XX-XXXX while typing
    const ssnInput = document.querySelector('input[name="ssn"]');
    ssnInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 9) value = value.slice(0, 9);
        
        if (value.length > 5) {
            value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5);
        } else if (value.length > 3) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        }
        
        e.target.value = value;
    });
});