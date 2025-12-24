import { gsap } from "gsap";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import {
    showCVPopup,
    showProjectPopup,
    showPassionPopup,
    showDegreePopup
} from "./popups.js";

import { CAMERA_PRESETS } from "./cameraPresets.js";
import { focusCamera, restoreCamera } from "./cameraManager.js";

// ----- Scene, Camera, Renderer -----
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFD394);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
const target = new THREE.Vector3(0, 2, 0);
camera.position.set(3.5, 4, -3);
camera.lookAt(target);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// ----- Controls -----
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(target);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableRotate = true;
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Calcul initial des angles pour la rotation limitée
const initialAzimuth = Math.atan2(camera.position.x - target.x, camera.position.z - target.z);
controls.minAzimuthAngle = initialAzimuth - Math.PI / 3;  // -60°
controls.maxAzimuthAngle = initialAzimuth + Math.PI / 3;  // +60°

const distance = camera.position.distanceTo(target);
const initialPolar = Math.acos((camera.position.y - target.y) / distance);
controls.minPolarAngle = initialPolar - Math.PI / 8; // -22.5°
controls.maxPolarAngle = initialPolar + Math.PI / 8; // +22.5°

controls.update();

// ----- Lights -----
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// ----- Raycaster -----
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// ----- Info Popup -----
const panel = document.getElementById('infoPanel');
const title = document.getElementById('title');
const content = document.getElementById('content');
const close = document.getElementById('close');
close.onclick = () => panel.style.display = 'none';

// ----- GLTF Loader -----
const loader = new GLTFLoader();
const clickable = [];

loader.load('/models/sceneV5.glb', (gltf) => {

    clickable.length = 0; // reset sécurité

    gltf.scene.traverse(obj => {
        if (obj.isMesh) {
            console.log("Mesh trouvé :", obj.name);
            clickable.push(obj); // TEMPORAIRE : on rend TOUT cliquable
        }
    });

    console.log("CLICKABLE FINAL :", clickable);

    scene.add(gltf.scene);
});

// ----- Click Event -----

const CATEGORIES = ["CV", "Project", "Passion", "Degree"];

function getMeshCategory(meshName) {
    if (!meshName) return null;

    const prefix = meshName.split(/[_\s]/)[0];
    return CATEGORIES.includes(prefix) ? prefix : null;
}

const POPUP_HANDLERS = {
    CV: showCVPopup,
    Project: showProjectPopup,
    Passion: showPassionPopup,
    Degree: showDegreePopup,
};

let popupOpen = false;

// Ouverture d'une popup
function openPopup(category, mesh) {
    if (popupOpen) return;
    popupOpen = true;

    const preset = CAMERA_PRESETS[category];
    if (preset) focusCamera(camera, controls, preset);

    POPUP_HANDLERS[category]?.(mesh);
}

// Fermeture d'une popup
window.addEventListener("popup:closed", () => {
    popupOpen = false;
    restoreCamera(camera, controls);
});

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickable, true);

    if (intersects.length > 0) {
        const mesh = intersects[0].object;

        const category = getMeshCategory(mesh.name);

        if (!category) {
            console.log("Mesh ignoré :", mesh.name);
            return;
        }

        console.log("Catégorie détectée :", category);

        // Popup personnalisée
        openPopup(category, mesh);
    }
});


// ----- Animation Loop -----
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// ----- Mouse move -----
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// ----- Responsive -----
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
