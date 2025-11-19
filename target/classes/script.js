// Country-State-City data
const locationData = {
    us: {
        name: "United States",
        states: {
            ca: { name: "California", cities: ["Los Angeles", "San Francisco", "San Diego"] },
            ny: { name: "New York", cities: ["New York City", "Buffalo", "Albany"] },
            tx: { name: "Texas", cities: ["Houston", "Dallas", "Austin"] }
        }
    },
    ca: {
        name: "Canada",
        states: {
            on: { name: "Ontario", cities: ["Toronto", "Ottawa", "Hamilton"] },
            bc: { name: "British Columbia", cities: ["Vancouver", "Victoria", "Surrey"] },
            qc: { name: "Quebec", cities: ["Montreal", "Quebec City", "Laval"] }
        }
    },
    uk: {
        name: "United Kingdom",
        states: {
            en: { name: "England", cities: ["London", "Manchester", "Birmingham"] },
            sc: { name: "Scotland", cities: ["Edinburgh", "Glasgow", "Aberdeen"] },
            wa: { name: "Wales", cities: ["Cardiff", "Swansea", "Newport"] }
        }
    },
    in: {
        name: "India",
        states: {
            mh: { name: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur"] },
            dl: { name: "Delhi", cities: ["New Delhi", "Delhi", "Gurgaon"] },
            ka: { name: "Karnataka", cities: ["Bangalore", "Mysore", "Hubli"] }
        }
    }
};

// Disposable email domains
const disposableDomains = [
    'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
    'throwaway.email', 'temp-mail.org', 'getnada.com', 'maildrop.cc', 'gyknife.com', 'forexzig.com'
];

// Country codes for phone validation
const countryCodes = {
    us: '+1', ca: '+1', uk: '+44', in: '+91'
};

class RegistrationForm {
    constructor() {
        this.form = document.getElementById('registrationForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.alertContainer = document.getElementById('alert-container');
        
        this.initializeEventListeners();
        this.updateSubmitButton();
    }

    initializeEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                this.validateField(input);
                this.updateSubmitButton();
            });
        });

        // Country-State-City cascade
        document.getElementById('country').addEventListener('change', (e) => this.updateStates(e.target.value));
        document.getElementById('state').addEventListener('change', (e) => this.updateCities(e.target.value));
        
        // Password strength
        document.getElementById('password').addEventListener('input', (e) => this.updatePasswordStrength(e.target.value));
        
        // Confirm password validation
        document.getElementById('confirmPassword').addEventListener('input', () => this.validatePasswordMatch());
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Clear previous validation state
        field.classList.remove('valid', 'invalid');
        
        switch(fieldName) {
            case 'firstName':
            case 'lastName':
                if (!value && field.required) {
                    isValid = false;
                    errorMessage = `${fieldName === 'firstName' ? 'First' : 'Last'} name is required`;
                }
                break;
                
            case 'email':
                if (!value && field.required) {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else if (value && !this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                } else if (value && this.isDisposableEmail(value)) {
                    isValid = false;
                    errorMessage = 'Email must not contain disposable domains (e.g., "@tempmail.com")';
                }
                break;
                
            case 'phone':
                if (!value && field.required) {
                    isValid = false;
                    errorMessage = 'Phone number is required';
                } else if (value && !this.isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
                
            case 'age':
                if (value && (value < 1 || value > 120)) {
                    isValid = false;
                    errorMessage = 'Age must be between 1 and 120';
                }
                break;
                
            case 'password':
                if (value && value.length < 6) {
                    isValid = false;
                    errorMessage = 'Password must be at least 6 characters long';
                }
                break;
                
            case 'confirmPassword':
                const password = document.getElementById('password').value;
                if (value && value !== password) {
                    isValid = false;
                    errorMessage = 'Passwords do not match';
                }
                break;
        }

        // Handle radio buttons (gender)
        if (fieldName === 'gender') {
            const genderInputs = document.querySelectorAll('input[name="gender"]');
            const isGenderSelected = Array.from(genderInputs).some(input => input.checked);
            if (!isGenderSelected) {
                isValid = false;
                errorMessage = 'Please select a gender';
            }
        }

        // Handle checkbox (terms)
        if (fieldName === 'terms') {
            if (!field.checked && field.required) {
                isValid = false;
                errorMessage = 'You must agree to the terms and conditions';
            }
        }

        // Update field appearance and error message
        if (isValid && value) {
            field.classList.add('valid');
        } else if (!isValid) {
            field.classList.add('invalid');
        }

        const errorElement = document.getElementById(`${fieldName}-error`);
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isDisposableEmail(email) {
        const domain = email.split('@')[1]?.toLowerCase();
        return disposableDomains.includes(domain);
    }

    isValidPhone(phone) {
        const country = document.getElementById('country').value;
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        
        if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
            return false;
        }

        if (country && countryCodes[country]) {
            const countryCode = countryCodes[country];
            return phone.startsWith(countryCode) || phone.startsWith(countryCode.substring(1));
        }

        return true;
    }

    updatePasswordStrength(password) {
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        let strength = 0;
        let strengthLabel = '';

        if (password.length >= 6) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;

        strengthFill.className = 'strength-fill';
        
        if (strength === 0 || password.length === 0) {
            strengthLabel = 'Password Strength';
        } else if (strength <= 2) {
            strengthFill.classList.add('strength-weak');
            strengthLabel = 'Weak';
        } else if (strength === 3) {
            strengthFill.classList.add('strength-medium');
            strengthLabel = 'Medium';
        } else {
            strengthFill.classList.add('strength-strong');
            strengthLabel = 'Strong';
        }

        strengthText.textContent = strengthLabel;
    }

    validatePasswordMatch() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.validateField(document.getElementById('confirmPassword'));
        } else if (confirmPassword && password === confirmPassword) {
            document.getElementById('confirmPassword').classList.remove('invalid');
            document.getElementById('confirmPassword').classList.add('valid');
            document.getElementById('confirmPassword-error').textContent = '';
        }
    }

    updateStates(countryCode) {
        const stateSelect = document.getElementById('state');
        const citySelect = document.getElementById('city');
        
        stateSelect.innerHTML = '<option value="">Select State</option>';
        citySelect.innerHTML = '<option value="">Select City</option>';
        citySelect.disabled = true;
        
        if (countryCode && locationData[countryCode]) {
            stateSelect.disabled = false;
            const states = locationData[countryCode].states;
            
            Object.keys(states).forEach(stateCode => {
                const option = document.createElement('option');
                option.value = stateCode;
                option.textContent = states[stateCode].name;
                stateSelect.appendChild(option);
            });
        } else {
            stateSelect.disabled = true;
        }
        
        this.updateSubmitButton();
    }

    updateCities(stateCode) {
        const citySelect = document.getElementById('city');
        const countryCode = document.getElementById('country').value;
        
        citySelect.innerHTML = '<option value="">Select City</option>';
        
        if (countryCode && stateCode && locationData[countryCode]?.states[stateCode]) {
            citySelect.disabled = false;
            const cities = locationData[countryCode].states[stateCode].cities;
            
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city.toLowerCase().replace(/\s+/g, '-');
                option.textContent = city;
                citySelect.appendChild(option);
            });
        } else {
            citySelect.disabled = true;
        }
        
        this.updateSubmitButton();
    }

    updateSubmitButton() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let allValid = true;

        requiredFields.forEach(field => {
            if (field.type === 'radio') {
                const radioGroup = this.form.querySelectorAll(`input[name="${field.name}"]`);
                const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!isChecked) allValid = false;
            } else if (field.type === 'checkbox') {
                if (!field.checked) allValid = false;
            } else {
                if (!field.value.trim()) allValid = false;
            }
        });

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (password && confirmPassword && password !== confirmPassword) {
            allValid = false;
        }

        this.submitBtn.disabled = !allValid;
    }

    showAlert(message, type) {
        this.alertContainer.innerHTML = `
            <div class="alert alert-${type}">
                ${message}
            </div>
        `;
        
        if (type === 'success') {
            setTimeout(() => {
                this.alertContainer.innerHTML = '';
            }, 5000);
        }
    }

    showFormErrors() {
        const formErrors = document.getElementById('form-errors');
        const errors = [];
        
        // Check for specific field errors
        const requiredFields = [
            {id: 'firstName', name: 'First Name'},
            {id: 'lastName', name: 'Last Name'},
            {id: 'email', name: 'Email'},
            {id: 'phone', name: 'Phone Number'}
        ];
        
        requiredFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!element.value.trim()) {
                errors.push(`${field.name} is required`);
            }
        });
        
        // Check gender
        const genderInputs = document.querySelectorAll('input[name="gender"]');
        const isGenderSelected = Array.from(genderInputs).some(input => input.checked);
        if (!isGenderSelected) {
            errors.push('Please select a gender');
        }
        
        // Check terms
        if (!document.getElementById('terms').checked) {
            errors.push('You must agree to the terms and conditions');
        }
        
        if (errors.length > 0) {
            formErrors.innerHTML = '<strong>Please correct the following errors:</strong><br>' + errors.join('<br>');
            formErrors.classList.add('show');
        }
    }
    
    hideFormErrors() {
        const formErrors = document.getElementById('form-errors');
        formErrors.classList.remove('show');
    }
    
    resetForm() {
        this.form.reset();
        
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
        });
        
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        this.hideFormErrors();
        
        document.getElementById('state').disabled = true;
        document.getElementById('city').disabled = true;
        document.getElementById('state').innerHTML = '<option value="">Select State</option>';
        document.getElementById('city').innerHTML = '<option value="">Select City</option>';
        
        document.getElementById('strengthFill').className = 'strength-fill';
        document.getElementById('strengthText').textContent = 'Password Strength';
        
        this.updateSubmitButton();
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const inputs = this.form.querySelectorAll('input, select, textarea');
        let allValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });

        const genderInputs = this.form.querySelectorAll('input[name="gender"]');
        const isGenderSelected = Array.from(genderInputs).some(input => input.checked);
        if (!isGenderSelected) {
            allValid = false;
            document.getElementById('gender-error').textContent = 'Please select a gender';
        }

        if (allValid) {
            this.showAlert('Registration Successful! Your profile has been submitted successfully.', 'success');
            this.hideFormErrors();
            setTimeout(() => {
                this.resetForm();
            }, 2000);
        } else {
            this.showAlert('Please correct the errors below and try again.', 'error');
            this.showFormErrors();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RegistrationForm();
});