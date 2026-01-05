"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LoadingCube({ onClick }) {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // === Scene, Camera, Renderer ===
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // === Cube Geometry & Face Colors ===
        const geometry = new THREE.BoxGeometry();
        const faceColors = [
            new THREE.MeshBasicMaterial({ color: "#b35005" }), // Front (orange)
            new THREE.MeshBasicMaterial({ color: "#085208" }), // Back (green)
            new THREE.MeshBasicMaterial({ color: "#cfba44" }), // Top (yellow)
            new THREE.MeshBasicMaterial({ color: "#4b1369" }), // Bottom (purple)
            new THREE.MeshBasicMaterial({ color: "#225f82" }), // Right (blue)
            new THREE.MeshBasicMaterial({ color: "#6b0707" })  // Left (red)
        ];
        const cube = new THREE.Mesh(geometry, faceColors);
        scene.add(cube);

        // === Helper: Create DPR-aware Text Texture ===
        const createTextTexture = (text, color) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const size = 512; // logical canvas size
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = size * dpr;
            canvas.height = size * dpr;
            canvas.style.width = `${size}px`;
            canvas.style.height = `${size}px`;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, size, size);
            ctx.fillStyle = color;

            const fontSize = size * 0.5;
            ctx.font = `bold ${fontSize}px "Jacquard 12", sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text, size / 2, size / 2);

            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            texture.needsUpdate = true;

            return texture;
        };

        // === Helper: Add Text to Cube Face ===
        const addTextToFace = (texture, position, rotation) => {
            const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
            const planeGeo = new THREE.PlaneGeometry(1.5, 1.5);
            const mesh = new THREE.Mesh(planeGeo, mat);
            mesh.position.copy(position);
            mesh.rotation.copy(rotation);
            cube.add(mesh);
        };

        // === Add Textures to Each Face ===
        addTextToFace(createTextTexture("G", "#FFFFFF"), new THREE.Vector3(0, 0, 0.51), new THREE.Euler(0, 0, 0));           // Front
        addTextToFace(createTextTexture("G", "#FFFFFF"), new THREE.Vector3(0, 0, -0.51), new THREE.Euler(0, Math.PI, 0));     // Back
        addTextToFace(createTextTexture("G", "#FFFFFF"), new THREE.Vector3(0, 0.51, 0), new THREE.Euler(-Math.PI / 2, 0, 0)); // Top
        addTextToFace(createTextTexture("G", "#FFFFFF"), new THREE.Vector3(0, -0.51, 0), new THREE.Euler(Math.PI / 2, 0, 0)); // Bottom
        addTextToFace(createTextTexture("G", "#FFFFFF"), new THREE.Vector3(0.51, 0, 0), new THREE.Euler(0, Math.PI / 2, 0));  // Right
        addTextToFace(createTextTexture("G", "#FFFFFF"), new THREE.Vector3(-0.51, 0, 0), new THREE.Euler(0, -Math.PI / 2, 0)); // Left

        // === Camera Position ===
        camera.position.z = 5;

        // === Animation Loop (Alternate X/Y Axis) ===
        let rotationSpeed = 0.015;
        let currentRotation = 0;
        let rotateY = true;

        const animate = () => {
            requestAnimationFrame(animate);

            if (rotateY) {
                currentRotation += rotationSpeed;
                cube.rotation.y = currentRotation;
            } else {
                currentRotation += rotationSpeed;
                cube.rotation.x = currentRotation;
            }

            if (currentRotation >= 2 * Math.PI) {
                currentRotation = 0;
                rotateY = !rotateY; // Switch axis
            }

            renderer.render(scene, camera);
        };
        animate();

        // === Handle Window Resize ===
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        };
        window.addEventListener("resize", handleResize);

        // === Cleanup on Unmount ===
        return () => {
            window.removeEventListener("resize", handleResize);
            if (renderer) renderer.dispose();
            if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} onClick={onClick} style={{ width: "100vw", height: "100vh" }} />;
}
