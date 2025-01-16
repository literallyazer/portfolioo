import { Navigation } from './components/Navigation.js';
import { SmoothScroll } from './components/SmoothScroll.js';
import { ProjectsGallery } from './components/ProjectsGallery.js';
import { SkillsVisualization } from './components/SkillsVisualization.js';
import { ContactForm } from './components/ContactForm.js';
import { CustomCursor } from './components/CustomCursor.js';
//import { ShaderSystem } from './shaders/ShaderSystem.js';

class App {
    constructor() {
        this.initialize();
    }

    initialize() {
        // Wait for DOM content to load
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeComponents();
            this.setupEventListeners();
            this.startLoadingSequence();
        });
    }

    initializeComponents() {
        // Initialize core components
        this.navigation = new Navigation();
        this.smoothScroll = new SmoothScroll();
        this.projectsGallery = new ProjectsGallery();
        this.skillsVisualization = new SkillsVisualization();
        this.contactForm = new ContactForm();
        this.customCursor = new CustomCursor();
        
        // Initialize WebGL components
        this.shaderSystem = new ShaderSystem();
    }

    setupEventListeners() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });

        // Handle resize events
        window.addEventListener('resize', this.handleResize.bind(this));

        // Handle scroll events
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    startLoadingSequence() {
        const loader = document.querySelector('.loader');
        const progress = document.querySelector('.loader-progress');

        // Simulate loading progress
        let loadProgress = 0;
        const interval = setInterval(() => {
            loadProgress += Math.random() * 30;
            if (loadProgress > 100) {
                loadProgress = 100;
                clearInterval(interval);
                this.finishLoading(loader);
            }
            progress.style.width = `${loadProgress}%`;
        }, 200);

        // Preload images and assets
        this.preloadAssets();
    }

    async preloadAssets() {
        const images = document.querySelectorAll('img');
        const imagePromises = Array.from(images).map(img => {
            return new Promise((resolve, reject) => {
                if (img.complete) resolve();
                img.addEventListener('load', resolve);
                img.addEventListener('error', reject);
            });
        });

        try {
            await Promise.all(imagePromises);
            console.log('All images loaded successfully');
        } catch (error) {
            console.error('Error loading images:', error);
        }
    }

    finishLoading(loader) {
        // Add loaded class to body
        document.body.classList.add('loaded');

        // Fade out loader
        gsap.to(loader, {
            opacity: 0,
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
                loader.style.display = 'none';
                this.startPageAnimations();
            }
        });
    }

    startPageAnimations() {
        // Animate hero section
        const heroTimeline = gsap.timeline();
        heroTimeline
            .from('.hero-title-line span', {
                y: '100%',
                opacity: 0,
                duration: 1,
                ease: 'power4.out',
                stagger: 0.2
            })
            .from('.hero-tagline', {
                y: 20,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            }, '-=0.5')
            .from('.hero-cta', {
                y: 20,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            }, '-=0.7');

        // Initialize scroll-based animations
        this.initScrollAnimations();
    }

    initScrollAnimations() {
        // Register ScrollTrigger animations
        gsap.registerPlugin(ScrollTrigger);

        // Animate sections on scroll
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'top 20%',
                    scrub: 1
                },
                y: 50,
                opacity: 0,
                duration: 1
            });
        });
    }

    handleResize() {
        // Update component dimensions
        this.shaderSystem.resize();
        this.projectsGallery.resize();
        this.skillsVisualization.resize();
    }

    handleScroll() {
        // Update scroll-based effects
        const scrolled = window.pageYOffset;
        this.navigation.updateScroll(scrolled);
        this.shaderSystem.updateScroll(scrolled);
    }

    pauseAnimations() {
        // Pause all GSAP animations
        gsap.globalTimeline.pause();
        this.shaderSystem.pause();
    }

    resumeAnimations() {
        // Resume all GSAP animations
        gsap.globalTimeline.resume();
        this.shaderSystem.resume();
    }
}

// Initialize application
new App();