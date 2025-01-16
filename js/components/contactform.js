export class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.inputs = this.form.querySelectorAll('input, textarea');
        this.submitButton = this.form.querySelector('button[type="submit"]');
        
        this.state = {
            isSubmitting: false,
            formData: {},
            errors: {}
        };

        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupInputAnimations();
        this.setupSubmission();
    }

    setupFormValidation() {
        const validators = {
            name: (value) => {
                if (!value) return 'Name is required';
                if (value.length < 2) return 'Name must be at least 2 characters';
                return null;
            },
            email: (value) => {
                if (!value) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email';
                return null;
            },
            message: (value) => {
                if (!value) return 'Message is required';
                if (value.length < 10) return 'Message must be at least 10 characters';
                return null;
            }
        };

        this.inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('input', (e) => {
                const { name, value } = e.target;
                const error = validators[name]?.(value);
                this.updateValidationUI(input, error);
            });

            // Blur validation
            input.addEventListener('blur', (e) => {
                const { name, value } = e.target;
                const error = validators[name]?.(value);
                this.updateValidationUI(input, error);
            });
        });
    }

    setupInputAnimations() {
        this.inputs.forEach(input => {
            const wrapper = input.parentElement;
            const label = wrapper.querySelector('label');

            // Initial state check
            if (input.value) {
                wrapper.classList.add('has-value');
            }

            // Focus animations
            input.addEventListener('focus', () => {
                wrapper.classList.add('focused');
                
                gsap.to(label, {
                    y: -20,
                    scale: 0.8,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            // Blur animations
            input.addEventListener('blur', () => {
                wrapper.classList.remove('focused');
                
                if (!input.value) {
                    gsap.to(label, {
                        y: 0,
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }

    setupSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.state.isSubmitting) return;
            
            // Validate all fields
            const isValid = this.validateForm();
            if (!isValid) return;

            this.startSubmission();

            try {
                await this.submitForm();
                this.showSuccess();
            } catch (error) {
                this.showError(error);
            } finally {
                this.endSubmission();
            }
        });
    }

    validateForm() {
        let isValid = true;
        this.state.errors = {};

        this.inputs.forEach(input => {
            const { name, value } = input;
            const error = this.validateField(name, value);
            
            if (error) {
                isValid = false;
                this.state.errors[name] = error;
                this.updateValidationUI(input, error);
            }
        });

        return isValid;
    }

    async submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        // Animate button during submission
        this.animateSubmitButton();

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Here you would typically make an API call
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });

        // if (!response.ok) throw new Error('Failed to send message');
        
        return data;
    }

    animateSubmitButton() {
        const timeline = gsap.timeline();
        
        timeline
            .to(this.submitButton, {
                width: 56,
                duration: 0.3,
                ease: 'power2.inOut'
            })
            .to(this.submitButton, {
                scale: 0.95,
                duration: 0.1,
                ease: 'power2.in',
                yoyo: true,
                repeat: -1
            });
    }

    showSuccess() {
        // Create success message
        const success = document.createElement('div');
        success.className = 'success-message';
        success.innerHTML = `
            <svg viewBox="0 0 24 24" class="success-icon">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            <p>Message sent successfully!</p>
        `;

        // Animate form out
        gsap.to(this.form, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                this.form.parentElement.appendChild(success);
                
                // Animate success message in
                gsap.from(success, {
                    opacity: 0,
                    y: -20,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    }

    showError(error) {
        // Create error message
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.textContent = error.message;

        // Shake animation
        gsap.to(this.form, {
            x: [-10, 10, -10, 10, 0],
            duration: 0.5,
            ease: 'power2.inOut'
        });

        // Show error message
        this.form.appendChild(errorEl);
        gsap.from(errorEl, {
            opacity: 0,
            y: -10,
            duration: 0.3
        });
    }

    startSubmission() {
        this.state.isSubmitting = true;
        this.submitButton.disabled = true;
        this.inputs.forEach(input => input.disabled = true);
    }

    endSubmission() {
        this.state.isSubmitting = false;
        this.submitButton.disabled = false;
        this.inputs.forEach(input => input.disabled = false);
    }

    updateValidationUI(input, error) {
        const wrapper = input.parentElement;
        const errorEl = wrapper.querySelector('.error-message');

        if (error) {
            wrapper.classList.add('error');
            
            if (!errorEl) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = error;
                wrapper.appendChild(errorDiv);

                gsap.from(errorDiv, {
                    opacity: 0,
                    y: -10,
                    duration: 0.3
                });
            }
        } else {
            wrapper.classList.remove('error');
            if (errorEl) {
                gsap.to(errorEl, {
                    opacity: 0,
                    y: -10,
                    duration: 0.3,
                    onComplete: () => errorEl.remove()
                });
            }
        }
    }
}