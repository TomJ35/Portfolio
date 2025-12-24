import { gsap } from "gsap";
import * as THREE from "three";

// Déplace la caméra vers un preset avec trajectoire fluide
export function focusCamera(camera, controls, preset) {
    // Verrouillage total
    controls.enableRotate = false;
    controls.enableZoom = false;
    controls.enablePan = false;

    // Animation vers le preset
    gsap.to(camera.position, {
        x: preset.position.x,
        y: preset.position.y,
        z: preset.position.z,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => controls.update()
    });

    gsap.to(controls.target, {
        x: preset.target.x,
        y: preset.target.y,
        z: preset.target.z,
        duration: 1,
        ease: "power2.out"
    });


    // Blocage strict des angles pendant l’animation
    const azimuth = Math.atan2(
        preset.position.x - preset.target.x,
        preset.position.z - preset.target.z
    );
    const distance = preset.position.distanceTo(preset.target);
    const polar = Math.acos((preset.position.y - preset.target.y) / distance);
    controls.minAzimuthAngle = azimuth;
    controls.maxAzimuthAngle = azimuth;
    controls.minPolarAngle = polar;
    controls.maxPolarAngle = polar;
}


// Restaure la caméra à la position initiale
export function restoreCamera(camera, controls, presetInitial) {
    focusCamera(camera, controls, presetInitial);
    // Réactivation rotation après animation
    setTimeout(() => {
        controls.enableRotate = true;
        controls.enableZoom = false;
        controls.enablePan = false;
    }, 2000); // durée = même que focusCamera
}
