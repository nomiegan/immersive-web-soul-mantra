import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.162.0/examples/jsm/loaders/GLTFLoader.js'; // to load 3d models


let scene, camera, renderer, material, controls, mandalas;
let sceneContainer = document.querySelector("#scene-container")

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(330066);

    // camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera = new THREE.PerspectiveCamera(75, sceneContainer.clientWidth / sceneContainer.clientHeight);
    camera.position.z = 15;

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
    sceneContainer.appendChild(renderer.domElement);
    // document.getElementById("scene-container").appendChild(renderer.domElement);
    // document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 32, 64);
    scene.add(directionalLight);

    //~~~~~~~~~~~~~~~~~~Initiate add-ons~~~~~~~~~~~~~~~~~~~~~~`
    controls = new OrbitControls(camera, renderer.domElement);
    const loader = new GLTFLoader(); //to loa 3d models

   

    loader.load('assets/mandalas.gltf', function (gltf) {
        mandalas = gltf.scene;
        scene.add(mandalas);  
        mandalas.scale.set(2, 2, 2);  
        mandalas.position.x = 0;
        mandalas.position.y = 150;
        // mandalas.position.z =  
    }, undefined, function (error) {
        console.error('error', error);
    });

    material = new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: `
            varying vec2 vUv;

            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;

            void main() {
                float r = 0.8 + 0.55 * sin(vUv.x * 10.0);
                float g = 0.4 + 0.25 * cos(vUv.y * 10.0);
                float b = 0.8 + 0.25 * sin(vUv.x * vUv.y * 80.0);

                gl_FragColor = vec4(r, g, b, 1.0);
            }
        `,
    });

    addSphere(scene, material, -3, -3, 4, 32, 32);
    addSphere(scene, material, 3, 3, 4, 32, 32);
    addSphere(scene, material, -10, 5, 2, 42, 32);
    addSphere(scene, material, 10, 0, 1.7, 42, 32);
    addSphere(scene, material, -20, 0, 1.5, 42, 32);
    addSphere(scene, material, 5, -4, 1.6, 32, 32);

}

function addSphere(scene, material, x, y, radius, widthSegments, heightSegments) {
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, 0);
    scene.add(mesh);
    return mesh;
}

function animate() {
    requestAnimationFrame(animate);

   
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
            child.rotation.x += 0.01;
            child.rotation.y += 0.01;
        }
    });


    if (mandalas) {
        // mandalas.rotation.x += 0.01;
        // mandalas.rotation.y += 0.01;
        mandalas.rotation.y = Math.sin(Date.now() / 3000) * .5;

    }

    controls.update(); 
    renderer.render(scene, camera);
}

// window.addEventListener("resize", () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// });

function onWindowResize() {
    camera.aspect = sceneContainer.clientWidth / sceneContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
}

document.addEventListener('DOMContentLoaded', function () {
    const audio = document.getElementById('healing-sound');
    const button = document.getElementById('sound-button');
    button.addEventListener('click', function () {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });
});

init();
animate();