import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ConfettiParticles() {
    const pointsRef = useRef();
    const particles = new Float32Array(1000 * 3).map(() => THREE.MathUtils.randFloatSpread(10));

    useEffect(() => {
        const interval = setInterval(() => {
            pointsRef.current.rotation.y += 0.01;
            pointsRef.current.rotation.x += 0.01;
        }, 16);
        return () => clearInterval(interval);
    }, []);

    return (
        <Points ref={pointsRef} positions={particles} stride={3} frustumCulled={false}>
            <PointMaterial transparent color="lightblue" size={0.1} sizeAttenuation depthWrite={false} />
        </Points>
    );
}

function ConfettiCelebration({ show }) {
    if (!show) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 100 }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ConfettiParticles />
            </Canvas>
        </div>
    );
}

export default ConfettiCelebration;
