import * as THREE from "three";

export const CAMERA_PRESETS = {
    Initial: {
        position: new THREE.Vector3(3.5, 4, -3),
        target: new THREE.Vector3(0, 2, 0)
    },
    CV: {
        position: new THREE.Vector3(2, 4, 0),
        target: new THREE.Vector3(1, 2, 1)
    },
    Project: {
        position: new THREE.Vector3(-0.5, 2.5, -1.5),
        target: new THREE.Vector3(-1, 2.5, -1.5)
    },
    Passion: {
        position: new THREE.Vector3(-2, 4, 1),
        target: new THREE.Vector3(-2, 3.75, 1.5)
    },
    Degree: {
        position: new THREE.Vector3(-0.5, 3.5, 1),
        target: new THREE.Vector3(-1, 3.5, 1)
    }
};
