export class Navigation {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileToggle = document.querySelector('.nav-toggle');
        this.lastScroll = 0;
        this.isHidden = false;
        this.threshold = 50;

        this.init();
    }

    init() {
        this.addEventListeners();
        this.initMagneticEffects();
        this.setupLinkAnimations();
    }

    addEventListeners() {
        // Mobile menu toggle
        this.mobileToggle?.addEventListener('click', () => {
            this.nav.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Smooth scroll to sections
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    this.scrollToSection(target);
                    this.nav.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            });
        });
    }

    initMagneticEffects() {
        this.navLinks.forEach(link => {
            link.addEventListener('mousemove', (e) => {
                const bounds = link.getBoundingClientRect();
                const x = e.clientX - bounds.left - bounds.width / 2;
                const y = e.clientY - bounds.top - bounds.height / 2;

                gsap.to(link, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.6,
                    ease: 'power3.out'
                });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });
    }

    setupLinkAnimations() {
        this.navLinks.forEach(link => {
            const text = link.textContent;
            link.innerHTML = '';
            
            // Create wrapper for hover effect
            const wrapper = document.createElement('div');
            wrapper.className = 'link-wrapper';
            
            // Create normal and hover text
            const normal = document.createElement('span');
            normal.className = 'link-text';
            normal.textContent = text;
            
            const hover = document.createElement('span');
            hover.className = 'link-hover';
            hover.textContent = text;
            
            wrapper.appendChild(normal);
            wrapper.appendChild(hover);
            link.appendChild(wrapper);
        });
    }

    updateScroll(scrolled) {
        // Add scrolled class when page is scrolled
        if (scrolled > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }

        // Hide/show navigation based on scroll direction
        if (scrolled > this.lastScroll && !this.isHidden && scrolled > this.threshold) {
            this.hideNavigation();
        } else if (scrolled < this.lastScroll && this.isHidden) {
            this.showNavigation();
        }

        this.lastScroll = scrolled;
    }

    hideNavigation() {
        gsap.to(this.nav, {
            y: -100,
            duration: 0.4,
            ease: 'power3.out'
        });
        this.isHidden = true;
    }

    showNavigation() {
        gsap.to(this.nav, {
            y: 0,
            duration: 0.4,
            ease: 'power3.out'
        });
        this.isHidden = false;
    }

    scrollToSection(target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        gsap.to(window, {
            duration: 1,
            scrollTo: {
                y: offsetPosition,
                autoKill: false
            },
            ease: 'power3.out'
        });
    }
}