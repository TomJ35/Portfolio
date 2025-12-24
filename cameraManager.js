import { gsap } from "gsap";
import * as THREE from "three";

let savedState = null;

// Focus caméra sur un preset
export function focusCamera(camera, controls, preset) {
    if (!savedState) {
        savedState = {
            position: camera.position.clone(),
            target: controls.target.clone()
        };
    }

    controls.enableRotate = false;
    controls.enableZoom = false;
    controls.enablePan = false;
    const prevDamping = controls.enableDamping;
    controls.enableDamping = false; // désactive l'inertie pendant l'animation

    // Déplacement simple de la position
    gsap.to(camera.position, {
        duration: 2,
        x: preset.position.x,
        y: preset.position.y,
        z: preset.position.z,
        ease: "power2.inOut",
        onUpdate: () => controls.update(),
        onComplete: () => controls.enableDamping = prevDamping
    });

    // Déplacement simple du target
    gsap.to(controls.target, {
        duration: 2,
        x: preset.target.x,
        y: preset.target.y,
        z: preset.target.z,
        ease: "power2.inOut",
        onUpdate: () => controls.update()
    });
}

// Restaure la caméra à sa position initiale
export function restoreCamera(camera, controls) {
    if (!savedState) return;

    controls.enableRotate = false;
    controls.enableZoom = false;
    controls.enablePan = false;
    const prevDamping = controls.enableDamping;
    controls.enableDamping = false;

    gsap.to(camera.position, {
        duration: 2,
        x: savedState.position.x,
        y: savedState.position.y,
        z: savedState.position.z,
        ease: "power2.inOut",
        onUpdate: () => controls.update(),
        onComplete: () => controls.enableDamping = prevDamping
    });

    gsap.to(controls.target, {
        duration: 2,
        x: savedState.target.x,
        y: savedState.target.y,
        z: savedState.target.z,
        ease: "power2.inOut",
        onUpdate: () => controls.update(),
        onComplete: () => {
            controls.enableRotate = true;
            controls.enableZoom = false;
            controls.enablePan = false;
            savedState = null;
        }
    });
}
