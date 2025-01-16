export class SmoothScroll {
    constructor() {
        this.DOM = {
            scrollable: document.querySelector('[data-scroll-container]'),
            sections: document.querySelectorAll('section')
        };

        this.data = {
            current: 0,
            target: 0,
            ease: 0.1,
            height: 0,
            windowHeight: 0
        };

        this.init();
    }

    init() {
        this.setSize();
        this.addStyles();
        this.setupRAF();
        this.addEvents();
    }

    setSize() {
        // Set scrollable height
        this.data.height = this.DOM.scrollable.getBoundingClientRect().height;
        this.data.windowHeight = window.innerHeight;

        // Set body height to enable scrolling
        document.body.style.height = `${this.data.height}px`;
    }

    addStyles() {
        // Add necessary styles for smooth scrolling
        Object.assign(this.DOM.scrollable.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            contain: 'content'
        });
    }

    setupRAF() {
        // Setup render loop
        const render = () => {
            // Calculate smooth scrolling
            this.data.current = lerp(
                this.data.current,
                this.data.target,
                this.data.ease
            );
            this.data.current = parseFloat(this.data.current.toFixed(2));

            // Transform content
            this.transformContent();

            // Update parallax elements
            this.updateParallax();

            // Call next frame
            requestAnimationFrame(render);
        };

        render();
    }

    transformContent() {
        gsap.set(this.DOM.scrollable, {
            y: -this.data.current
        });
    }

    updateParallax() {
        this.DOM.sections.forEach(section => {
            const bounds = section.getBoundingClientRect();
            const centerY = bounds.top + bounds.height / 2;
            const viewportCenter = this.data.windowHeight / 2;
            const distance = centerY - viewportCenter;
            const parallaxElements = section.querySelectorAll('[data-parallax]');

            parallaxElements.forEach(el => {
                const speed = el.dataset.parallax || 0.1;
                gsap.set(el, {
                    y: distance * speed
                });
            });
        });
    }

    addEvents() {
        // Update scroll position
        window.addEventListener('scroll', () => {
            this.data.target = window.scrollY;
        });

        // Update dimensions on resize
        window.addEventListener('resize', () => {
            this.setSize();
        });
    }
}

// Utility function for linear interpolation
function lerp(start, end, factor) {
    return (1 - factor) * start + factor * end;
}