"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CameraRelativeCubeAnimations({ onClick }) {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // === Scene & Camera ===
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);

        // === Renderer ===
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        mountRef.current.appendChild(renderer.domElement);

        // === Cube & Colors ===
        const geometry = new THREE.BoxGeometry();
        const faceColors = [
            new THREE.MeshBasicMaterial({ color: "#b35005" }), // front
            new THREE.MeshBasicMaterial({ color: "#085208" }), // back
            new THREE.MeshBasicMaterial({ color: "#cfba44" }), // top
            new THREE.MeshBasicMaterial({ color: "#4b1369" }), // bottom
            new THREE.MeshBasicMaterial({ color: "#225f82" }), // right
            new THREE.MeshBasicMaterial({ color: "#6b0707" })  // left
        ];
        const cube = new THREE.Mesh(geometry, faceColors);
        scene.add(cube);

        // === Textures for G (DPR-aware & crisp) ===
        const createTextTexture = (text) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const dpr = Math.min(window.devicePixelRatio || 1, 2); // device pixel ratio
            const size = 1024; // logical canvas size

            // Set actual pixel size for high-DPI
            canvas.width = size * dpr;
            canvas.height = size * dpr;
            canvas.style.width = `${size}px`;
            canvas.style.height = `${size}px`;

            // Scale context so drawing matches logical size
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            // Clear & draw text
            ctx.clearRect(0, 0, size, size);
            ctx.fillStyle = "#ffffff";
            const fontSize = size * 0.5;
            ctx.font = `bold ${fontSize}px "Jacquard 12", sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text, size / 2, size / 2);

            // Create texture
            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            texture.needsUpdate = true;

            return texture;
        };

        const addTextToFace = (texture, position, rotation) => {
            const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
            const geo = new THREE.PlaneGeometry(1.5, 1.5);
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.copy(position);
            mesh.rotation.copy(rotation);
            cube.add(mesh);
        };

        const gTex = createTextTexture("G");

        addTextToFace(gTex, new THREE.Vector3(0, 0, 0.51), new THREE.Euler(0, 0, 0));              // front
        addTextToFace(gTex, new THREE.Vector3(0, 0, -0.51), new THREE.Euler(0, Math.PI, 0));       // back
        addTextToFace(gTex, new THREE.Vector3(0, 0.51, 0), new THREE.Euler(-Math.PI / 2, 0, 0));   // top
        addTextToFace(gTex, new THREE.Vector3(0, -0.51, 0), new THREE.Euler(Math.PI / 2, 0, 0));   // bottom
        addTextToFace(gTex, new THREE.Vector3(0.51, 0, 0), new THREE.Euler(0, Math.PI / 2, 0));    // right
        addTextToFace(gTex, new THREE.Vector3(-0.51, 0, 0), new THREE.Euler(0, -Math.PI / 2, 0));  // left

        // === Face normals ===
        const faceNormals = {
            front: new THREE.Vector3(0, 0, 1),
            back: new THREE.Vector3(0, 0, -1),
            right: new THREE.Vector3(1, 0, 0),
            left: new THREE.Vector3(-1, 0, 0),
            top: new THREE.Vector3(0, 1, 0),
            bottom: new THREE.Vector3(0, -1, 0),
        };

        const cameraDir = new THREE.Vector3();
        const getVisibleFace = () => {
            camera.getWorldDirection(cameraDir);
            cameraDir.negate();
            let maxDot = -Infinity;
            let face = null;

            for (const [name, normal] of Object.entries(faceNormals)) {
                const worldNormal = normal.clone().applyQuaternion(cube.quaternion);
                const dot = worldNormal.dot(cameraDir);
                if (dot > maxDot) {
                    maxDot = dot;
                    face = name;
                }
            }

            return face;
        };

        // === Camera-relative axis ===
        const getCameraRelativeAxis = (faceNormal, mode) => {
            const worldUp = new THREE.Vector3(0, 1, 0);
            const axis = new THREE.Vector3();

            if (mode === "horizontal") {
                axis.crossVectors(worldUp, faceNormal);
            } else if (mode === "vertical") {
                const temp = new THREE.Vector3();
                temp.crossVectors(worldUp, faceNormal);
                axis.crossVectors(faceNormal, temp);
            } else if (mode === "random") {
                const temp = new THREE.Vector3(Math.random(), Math.random(), Math.random());
                axis.crossVectors(faceNormal, temp);
            } else if (mode === "diagonal") {
                axis.copy(currentAnimation.axis);
            }

            axis.normalize();
            return axis;
        };

        // === Animations ===
        const animations = [
            { name: "classic", mode: "horizontal", steps: 3, speed: 0.04, weight: 0.5 },
            { name: "random_axis", mode: "random", steps: 2, speed: 0.05, weight: 0.25 },
            { name: "diagonal_spin", mode: "diagonal", steps: 0, speed: 0.04, axis: new THREE.Vector3(-1, -1, 0.5).normalize(), weight: 0.25 }
        ];

        // === Weighted random pick ===
        const pickWeightedAnimation = (animations) => {
            const sum = animations.reduce((acc, a) => acc + a.weight, 0);
            const r = Math.random() * sum;
            let total = 0;
            for (const anim of animations) {
                total += anim.weight;
                if (r <= total) return anim;
            }
            return animations[0];
        };

        const currentAnimation = pickWeightedAnimation(animations);
        // const currentAnimation = animations[1];

        // === Animation state ===
        let mode = currentAnimation.mode;
        let stepCount = 0;
        let sequenceCount = 0;
        let rotating = false;
        let rotated = 0;
        let activeAxis = new THREE.Vector3();
        let awaitingZStep = false;

        const STEP_ANGLE = Math.PI / 2;

        const animate = () => {
            requestAnimationFrame(animate);

            // === Determine rotation axis ===
            if (!rotating) {
                if (awaitingZStep) {
                    // Rare Z-axis twist
                    const camDir = new THREE.Vector3();
                    camera.getWorldDirection(camDir);
                    camDir.negate();
                    activeAxis.copy(camDir.normalize());
                    rotated = 0;
                    rotating = true;
                } else if (mode === "diagonal") {
                    activeAxis.copy(currentAnimation.axis);
                    rotated = 0;
                    rotating = true;
                } else {
                    // Standard axis
                    const face = getVisibleFace();
                    const faceNormal = faceNormals[face].clone().applyQuaternion(cube.quaternion);
                    activeAxis = getCameraRelativeAxis(faceNormal, mode);
                    rotated = 0;
                    rotating = true;
                }
            }

            // === Apply rotation ===
            const delta = currentAnimation.mode === "diagonal" ? currentAnimation.speed : Math.min(currentAnimation.speed, STEP_ANGLE - rotated);
            cube.rotateOnWorldAxis(activeAxis, delta);
            rotated += delta;

            // === Step logic ===
            if (rotated >= STEP_ANGLE - 0.0001) {
                rotating = false;

                if (awaitingZStep) {
                    awaitingZStep = false;
                    stepCount = 0;
                    mode = mode === "horizontal" ? "vertical" : "horizontal";
                } else if (mode !== "diagonal") {
                    stepCount++;
                    if (stepCount >= currentAnimation.steps) {
                        sequenceCount++;

                        // Rare Z-step
                        if (Math.random() < 0.18) {
                            awaitingZStep = true;
                        }
                    }

                    if (!awaitingZStep && stepCount >= currentAnimation.steps) {
                        stepCount = 0;
                        mode = mode === "horizontal" ? "vertical" : "horizontal";
                    }
                }
            }

            renderer.render(scene, camera);
        };

        animate();

        // === Handle Window Resize ===
        const handleResize = () => {
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
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
