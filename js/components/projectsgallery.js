import * as THREE from 'three';
import { gsap } from 'gsap';

export class ProjectsGallery {
    constructor() {
        this.container = document.querySelector('.projects-container');
        this.items = [];
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        this.currentItem = 0;
        this.isAnimating = false;

        this.mouse = {
            x: 0,
            y: 0,
            prevX: 0,
            prevY: 0,
            target: { x: 0, y: 0 }
        };

        this.init();
    }

    init() {
        this.setupScene();
        this.createProjects();
        this.setupInteraction();
        this.animate();
    }

    setupScene() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 5;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(2, 2, 2);
        this.scene.add(directionalLight);
    }

    createProjects() {
        const projects = [
            {
                title: 'Meead',
                description: 'Event finder using Ticketmaster API',
                image: 'path/to/meead.jpg',
                link: 'https://github.com/...'
            },
            {
                title: 'Fraud Detection',
                description: 'Action-based fraud detection system',
                image: 'path/to/fraud.jpg',
                link: 'https://github.com/...'
            },
            // Add more projects here
        ];

        projects.forEach((project, index) => {
            const geometry = new THREE.PlaneGeometry(2, 1.5);
            
            // Create custom shader material
            const material = new THREE.ShaderMaterial({
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform sampler2D uTexture;
                    uniform float uHover;
                    uniform float uTime;
                    varying vec2 vUv;

                    void main() {
                        vec2 uv = vUv;
                        
                        // Add wave effect on hover
                        uv.y += sin(uv.x * 10.0 + uTime) * 0.02 * uHover;
                        
                        vec4 texture = texture2D(uTexture, uv);
                        gl_FragColor = texture;
                    }
                `,
                uniforms: {
                    uTexture: { value: null },
                    uHover: { value: 0 },
                    uTime: { value: 0 }
                }
            });

            // Load texture
            new THREE.TextureLoader().load(project.image, (texture) => {
                material.uniforms.uTexture.value = texture;
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = index * 2.5;
            this.scene.add(mesh);

            this.items.push({
                mesh,
                material,
                title: project.title,
                description: project.description,
                link: project.link
            });
        });
    }

    setupInteraction() {
        // Mouse move interaction
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            gsap.to(this.mouse.target, {
                x: this.mouse.x * 0.1,
                y: this.mouse.y * 0.1,
                duration: 2,
                ease: 'power3.out'
            });
        });

        // Click interaction
        window.addEventListener('click', () => {
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera({ x: this.mouse.x, y: this.mouse.y }, this.camera);

            const intersects = raycaster.intersectObjects(this.items.map(item => item.mesh));
            
            if (intersects.length > 0) {
                const clickedItem = this.items.find(item => item.mesh === intersects[0].object);
                this.showProjectDetails(clickedItem);
            }
        });
    }

    showProjectDetails(project) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        gsap.to(project.mesh.position, {
            z: 1,
            duration: 1,
            ease: 'power3.out',
            onComplete: () => {
                this.isAnimating = false;
                window.open(project.link, '_blank');
            }
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Update uniforms
        this.items.forEach(item => {
            item.material.uniforms.uTime.value += 0.01;
        });

        // Update camera position based on mouse
        this.camera.position.x += (this.mouse.target.x - this.camera.position.x) * 0.1;
        this.camera.position.y += (this.mouse.target.y - this.camera.position.y) * 0.1;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}