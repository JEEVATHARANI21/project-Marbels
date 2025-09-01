// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    if (!contactForm) return;
    
    // Form validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Please enter a valid name (letters and spaces only)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            required: false,
            pattern: /^[\+]?[1-9][\d]{0,15}$/,
            message: 'Please enter a valid phone number'
        },
        subject: {
            required: true,
            message: 'Please select a subject'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 1000,
            message: 'Message must be between 10 and 1000 characters'
        }
    };
    
    // Create error display elements
    function createErrorElement(fieldName) {
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.id = `${fieldName}-error`;
        errorElement.style.color = '#ff4444';
        errorElement.style.fontSize = '0.9rem';
        errorElement.style.marginTop = '0.5rem';
        errorElement.style.display = 'none';
        return errorElement;
    }
    
    // Initialize error elements for each field
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field && !document.getElementById(`${fieldName}-error`)) {
            const errorElement = createErrorElement(fieldName);
            field.parentNode.appendChild(errorElement);
        }
    });
    
    // Validate individual field
    function validateField(fieldName, value) {
        const rules = validationRules[fieldName];
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (!rules) return true;
        
        // Check if required
        if (rules.required && !value.trim()) {
            showFieldError(errorElement, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
            return false;
        }
        
        // Skip other validations if field is not required and empty
        if (!rules.required && !value.trim()) {
            hideFieldError(errorElement);
            return true;
        }
        
        // Check minimum length
        if (rules.minLength && value.length < rules.minLength) {
            showFieldError(errorElement, `Minimum ${rules.minLength} characters required`);
            return false;
        }
        
        // Check maximum length
        if (rules.maxLength && value.length > rules.maxLength) {
            showFieldError(errorElement, `Maximum ${rules.maxLength} characters allowed`);
            return false;
        }
        
        // Check pattern
        if (rules.pattern && !rules.pattern.test(value)) {
            showFieldError(errorElement, rules.message);
            return false;
        }
        
        // If we get here, field is valid
        hideFieldError(errorElement);
        return true;
    }
    
    // Show field error
    function showFieldError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            errorElement.parentNode.querySelector('input, select, textarea').style.borderColor = '#ff4444';
        }
    }
    
    // Hide field error
    function hideFieldError(errorElement) {
        if (errorElement) {
            errorElement.style.display = 'none';
            errorElement.parentNode.querySelector('input, select, textarea').style.borderColor = '';
        }
    }
    
    // Real-time validation
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            // Validate on blur
            field.addEventListener('blur', function() {
                validateField(fieldName, this.value);
            });
            
            // Clear errors on input
            field.addEventListener('input', function() {
                const errorElement = document.getElementById(`${fieldName}-error`);
                if (errorElement && errorElement.style.display === 'block') {
                    // Re-validate after a short delay
                    setTimeout(() => {
                        validateField(fieldName, this.value);
                    }, 300);
                }
            });
        }
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formValues = {};
        
        for (let [key, value] of formData.entries()) {
            formValues[key] = value;
        }
        
        // Validate all fields
        let isFormValid = true;
        Object.keys(validationRules).forEach(fieldName => {
            const fieldValue = formValues[fieldName] || '';
            if (!validateField(fieldName, fieldValue)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            // Scroll to first error
            const firstError = document.querySelector('.field-error[style*="block"]');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Hide form and show success message
            contactForm.style.display = 'none';
            successMessage.classList.add('show');
            
            // Add success animation
            successMessage.style.animation = 'slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Reset form after delay
            setTimeout(() => {
                resetForm();
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }, 5000);
            
        }, 2000);
    });
    
    // Reset form function
    function resetForm() {
        contactForm.reset();
        contactForm.style.display = 'flex';
        successMessage.classList.remove('show');
        
        // Clear all error messages
        document.querySelectorAll('.field-error').forEach(error => {
            error.style.display = 'none';
        });
        
        // Reset field borders
        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.style.borderColor = '';
        });
    }
    
    // Add character counter for message field
    const messageField = document.getElementById('message');
    if (messageField) {
        const maxLength = validationRules.message.maxLength;
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.textAlign = 'right';
        counter.style.fontSize = '0.9rem';
        counter.style.color = '#888';
        counter.style.marginTop = '0.5rem';
        
        function updateCounter() {
            const remaining = maxLength - messageField.value.length;
            counter.textContent = `${remaining} characters remaining`;
            
            if (remaining < 50) {
                counter.style.color = '#ff4444';
            } else {
                counter.style.color = '#888';
            }
        }
        
        messageField.addEventListener('input', updateCounter);
        messageField.parentNode.appendChild(counter);
        updateCounter();
    }
    
    // Add input formatting
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', function() {
            // Remove non-digit characters except + and spaces
            let value = this.value.replace(/[^\d\+\s\-\(\)]/g, '');
            this.value = value;
        });
    }
    
    // Enhanced animations for form elements
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        group.style.animation = `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
        group.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add focus effects
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
            this.style.transform = 'scale(1.02)';
        });
        
        field.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
            this.style.transform = 'scale(1)';
        });
    });
});

// Additional CSS for animations (injected via JavaScript)
const additionalStyles = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .form-group {
        transition: all 0.3s ease;
    }
    
    .form-group.focused {
        transform: scale(1.01);
    }
    
    .field-error {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .character-counter {
        transition: color 0.3s ease;
    }
    
    .carousel-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 215, 0, 0.3);
        border-top: 3px solid #FFD700;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    .carousel-progress {
        position: absolute;
        bottom: 20px;
        left: 20px;
        right: 20px;
        height: 4px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #FFD700, #FFA500);
        transition: width 0.5s ease;
        border-radius: 2px;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);