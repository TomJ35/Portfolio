import { gsap } from "gsap";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ----- Scene, Camera, Renderer -----
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
const target = new THREE.Vector3(0, 2, 0);
camera.position.set(3.5, 4, -3);
camera.lookAt(target);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ----- Axes helper -----
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

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

loader.load('./models/sceneV4.glb', (gltf) => {
    // Affichage pour debug des textures
    gltf.scene.traverse(o => {
        if (o.isMesh) console.log(o.material.map);
    });

    const objectsConfig = {
        PC: { title: "PC", content: "C'est un pc" },
        Sphere: { title: "Sphere", content: "C'est une sphère très ronde." },
        Cube: { title: "Cube", content: "Un cube bien stable." },
        Cylinder: { title: "Cylinder", content: "Un cylindre élégant." },
        Torus: { title: "Torus", content: "Un anneau parfait." }
    };

    gltf.scene.traverse((obj) => {
        if (obj.isMesh && objectsConfig[obj.name]) {
            clickable.push(obj);
            obj.userData = {
                title: objectsConfig[obj.name].title,
                content: objectsConfig[obj.name].content
            };
        }
    });

    scene.add(gltf.scene);
});

// ----- Click Event -----
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickable, true); // true pour tous les enfants

    if (intersects.length > 0) {
        const obj = intersects[0].object;
        const data = obj.userData;

        // Popup
        title.textContent = data.title;
        content.textContent = data.content;
        panel.style.display = 'block';

        // Caméra animée vers l’objet sans casser les limites
        gsap.to(camera.position, {
            x: obj.position.x + 2,
            y: obj.position.y + 2,
            z: obj.position.z + 2,
            duration: 1,
            onUpdate: () => {
                controls.update();
            }
        });
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
