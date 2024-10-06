import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function ThreeDLaptop() {
    const mountRef = useRef(null);

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Set alpha: true for transparency
        renderer.setClearColor(0x000000, 0); // Make background transparent
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        // Laptop base (Body) with realistic metal material
        const baseGeometry = new THREE.BoxGeometry(3, 0.2, 2);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            metalness: 0.8,  // Adding metalness for reflective surface
            roughness: 0.2,  // Smooth finish
        });
        const laptopBase = new THREE.Mesh(baseGeometry, baseMaterial);
        laptopBase.position.y = -0.5;
        scene.add(laptopBase);

        // Laptop screen (Monitor) with some reflection
        const screenGeometry = new THREE.BoxGeometry(3, 1.8, 0.1);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            metalness: 0.6,
            roughness: 0.3,
        });
        const laptopScreen = new THREE.Mesh(screenGeometry, screenMaterial);
        laptopScreen.position.set(0, 0.6, -1);
        scene.add(laptopScreen);

        // Optional: Add a texture to the laptop screen to simulate code
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('/path/to/your/screen-texture.png', (texture) => {
            const codeScreenMaterial = new THREE.MeshBasicMaterial({ map: texture });
            const codeScreen = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.6), codeScreenMaterial);
            codeScreen.position.set(0, 0.6, -1.05); // Slightly in front of the laptop screen
            scene.add(codeScreen);
        });

        // Set Camera Position
        camera.position.z = 5;

        // Animation loop
        const animate = function () {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            mountRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef}></div>;
}

export default ThreeDLaptop;
