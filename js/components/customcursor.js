export class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.cursorDot = document.querySelector('.cursor-dot');
        this.cursorOutline = document.querySelector('.cursor-outline');
        
        this.bounds = {
            dot: this.cursorDot.getBoundingClientRect(),
            outline: this.cursorOutline.getBoundingClientRect()
        };

        this.pos = {
            dot: { x: 0, y: 0 },
            outline: { x: 0, y: 0 }
        };

        this.mouse = {
            x: 0,
            y: 0
        };

        this.speed = {
            dot: 1,
            outline: 0.15
        };

        this.init();
    }

    init() {
        // Hide default cursor
        document.body.style.cursor = 'none';

        // Setup event listeners
        this.setupEventListeners();
        
        // Start animation loop
        this.render();

        // Initialize magnetic elements
        this.initMagneticElements();
    }

    setupEventListeners() {
        // Mouse movement
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Mouse states
        document.addEventListener('mousedown', () => this.cursorClick());
        document.addEventListener('mouseup', () => this.cursorUnclick());
        
        // Handle cursor states for different elements
        document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
            el.addEventListener('mouseenter', () => this.cursorHover());
            el.addEventListener('mouseleave', () => this.cursorUnhover());
        });

        // Handle cursor visibility
        document.addEventListener('mouseleave', () => this.hideCursor());
        document.addEventListener('mouseenter', () => this.showCursor());
    }

    render() {
        // Smooth movement for dot
        this.pos.dot.x += (this.mouse.x - this.pos.dot.x) * this.speed.dot;
        this.pos.dot.y += (this.mouse.y - this.pos.dot.y) * this.speed.dot;

        // Smooth movement for outline
        this.pos.outline.x += (this.mouse.x - this.pos.outline.x) * this.speed.outline;
        this.pos.outline.y += (this.mouse.y - this.pos.outline.y) * this.speed.outline;

        // Apply transforms
        gsap.set(this.cursorDot, {
            x: this.pos.dot.x - this.bounds.dot.width / 2,
            y: this.pos.dot.y - this.bounds.dot.height / 2
        });

        gsap.set(this.cursorOutline, {
            x: this.pos.outline.x - this.bounds.outline.width / 2,
            y: this.pos.outline.y - this.bounds.outline.height / 2
        });

        requestAnimationFrame(() => this.render());
    }

    cursorHover() {
        gsap.to([this.cursorDot, this.cursorOutline], {
            scale: 1.5,
            duration: 0.3,
            ease: 'power2.out'
        });
    }

    cursorUnhover() {
        gsap.to([this.cursorDot, this.cursorOutline], {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    }

    cursorClick() {
        gsap.to([this.cursorDot, this.cursorOutline], {
            scale: 0.8,
            duration: 0.1,
            ease: 'power2.out'
        });
    }

    cursorUnclick() {
        gsap.to([this.cursorDot, this.cursorOutline], {
            scale: 1,
            duration: 0.3,
            ease: 'elastic.out(1, 0.3)'
        });
    }

    hideCursor() {
        gsap.to([this.cursor], {
            opacity: 0,
            duration: 0.3
        });
    }

    showCursor() {
        gsap.to([this.cursor], {
            opacity: 1,
            duration: 0.3
        });
    }

    initMagneticElements() {
        document.querySelectorAll('[data-magnetic]').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const bounds = el.getBoundingClientRect();
                const relX = e.clientX - bounds.left;
                const relY = e.clientY - bounds.top;
                
                const multiplier = el.getAttribute('data-magnetic-multiplier') || 1;

                gsap.to(el, {
                    x: (relX - bounds.width / 2) * multiplier,
                    y: (relY - bounds.height / 2) * multiplier,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            el.addEventListener('mouseleave', () => {
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }
}