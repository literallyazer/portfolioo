import * as THREE from 'three';
import { gsap } from 'gsap';

export class SkillsVisualization {
    constructor() {
        this.container = document.querySelector('#skills-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        this.skills = [
            { name: 'Azure', level: 90, category: 'Cloud' },
            { name: 'Node.js', level: 85, category: 'Backend' },
            { name: 'Cybersecurity', level: 80, category: 'Security' },
            { name: 'SQL', level: 75, category: 'Database' },
            { name: 'AI/ML', level: 70, category: 'AI' }
            // Add more skills here
        ];

        this.particles = [];
        this.connections = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.init();
    }

    init() {
        this.setupScene();
        this.createParticles();
        this.createConnections();
        this.setupInteraction();
        this.animate();
    }

    setupScene() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 15;

        // Add post-processing
        this.setupPostProcessing();
    }

    setupPostProcessing() {
        // Add bloom effect
        const renderScene = new THREE.RenderPass(this.scene, this.camera);
        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, 0.4, 0.85
        );
        bloomPass.threshold = 0;
        bloomPass.strength = 0.6;
        bloomPass.radius = 0;

        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(renderScene);
        this.composer.addPass(bloomPass);
    }

    createParticles() {
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vPosition;
                varying vec2 vUv;
                
                void main() {
                    vPosition = position;
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                varying vec3 vPosition;
                varying vec2 vUv;
                
                void main() {
                    float strength = distance(gl_PointCoord, vec2(0.5));
                    strength = 1.0 - strength;
                    strength = pow(strength, 3.0);
                
                    vec3 color = vec3(0.8, 0.8, 1.0);
                    gl_FragColor = vec4(color, strength);
                }
            `,
            uniforms: {
                uTime: { value: 0 }
            },
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        this.skills.forEach((skill, i) => {
            const particle = new THREE.Mesh(geometry, material.clone());
            
            // Position particles in a spiral
            const angle = i * 0.5;
            const radius = 5;
            particle.position.x = Math.cos(angle) * radius;
            particle.position.y = Math.sin(angle) * radius;
            particle.position.z = 0;

            particle.userData = { skill };
            this.scene.add(particle);
            this.particles.push(particle);
        });
    }

    createConnections() {
        const material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2
        });

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    this.particles[i].position,
                    this.particles[j].position
                ]);
                
                const line = new THREE.Line(geometry, material);
                this.scene.add(line);
                this.connections.push({
                    line,
                    particles: [this.particles[i], this.particles[j]]
                });
            }
        }
    }

    setupInteraction() {
        this.container.addEventListener('mousemove', (event) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.particles);

            if (intersects.length > 0) {
                this.highlightSkill(intersects[0].object);
            } else {
                this.resetHighlight();
            }
        });
    }

    highlightSkill(particle) {
        gsap.to(particle.scale, {
            x: 2,
            y: 2,
            z: 2,
            duration: 0.3
        });

        // Show skill info
        const skill = particle.userData.skill;
        this.showSkillInfo(skill);
    }

    resetHighlight() {
        this.particles.forEach(particle => {
            gsap.to(particle.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.3
            });
        });

        this.hideSkillInfo();
    }

    showSkillInfo(skill) {
        // Implementation for showing skill information
    }

    hideSkillInfo() {
        // Implementation for hiding skill information
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Update particles
        this.particles.forEach((particle, i) => {
            const time = Date.now() * 0.001;
            particle.position.z = Math.sin(time + i) * 0.5;
        });

        // Update connections
        this.connections.forEach(connection => {
            connection.line.geometry.setFromPoints([
                connection.particles[0].position,
                connection.particles[1].position
            ]);
            connection.line.geometry.verticesNeedUpdate = true;
        });

        // Render scene with post-processing
        this.composer.render();
    }

    resize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.composer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}