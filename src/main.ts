import "./style.css";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import GUI from "lil-gui";
import { Timer } from "three/examples/jsm/Addons.js";

// set up texture loader

// const textureLoader = new THREE.TextureLoader();

// setup gui

const gui = new GUI();
gui.close();

// set up canvas

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const [width, height] = [
  (canvas.width = window.innerWidth),
  (canvas.height = window.innerHeight),
];

// set up scene

const scene = new THREE.Scene();

// set up the models

// floor

const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
  })
);
floorMesh.rotation.x = -Math.PI / 2;
scene.add(floorMesh);

// house

const houseGroup = new THREE.Group();

const houseWalls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial()
);
houseWalls.position.y = houseWalls.geometry.parameters.height / 2;

const houseRoof = new THREE.Mesh(
  new THREE.ConeGeometry(3, 2, 4),
  new THREE.MeshStandardMaterial()
);
houseRoof.position.y =
  houseWalls.geometry.parameters.height +
  houseRoof.geometry.parameters.height / 2;
houseRoof.rotation.y = Math.PI / 4;

const houseDoor = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2),
  new THREE.MeshStandardMaterial({ color: 0x8b4513 })
);
houseDoor.position.set(0, 1, 2.01);

houseGroup.add(houseWalls, houseRoof, houseDoor);

scene.add(houseGroup);

// bushes

const bushMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
});

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);

bush1.scale.setScalar(0.5);
bush1.position.set(0.8, 0.2, 2.2);

bush2.scale.setScalar(0.25);
bush2.position.set(1.4, 0.1, 2.1);

bush3.scale.setScalar(0.4);
bush3.position.set(-0.8, 0.1, 2.2);

bush4.scale.setScalar(0.15);
bush4.position.set(-1, 0.05, 2.6);

scene.add(bush1, bush2, bush3, bush4);

// set up the graves

const graveGroup = new THREE.Group();

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);

const graveMaterial = new THREE.MeshStandardMaterial({
  color: 0x808080,
});

for (let i = 0; i < 30; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * 5 + 4;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const graveMesh = new THREE.Mesh(graveGeometry, graveMaterial);

  graveMesh.rotation.x = (Math.random() - 0.5) * 0.4;
  graveMesh.rotation.y = (Math.random() - 0.5) * 0.4;
  graveMesh.rotation.z = (Math.random() - 0.5) * 0.4;

  graveMesh.position.set(x, graveMesh.geometry.parameters.height / 2 + 0.01, z);

  graveGroup.add(graveMesh);
}

scene.add(graveGroup);
// set up lights

const iluminationFolder = gui.addFolder("Ilumination");

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

directionalLight.position.set(1, 1, -1);

scene.add(directionalLight, ambientLight);

iluminationFolder
  .add(directionalLight, "intensity", 0, 2, 0.01)
  .name("Directional Light Intensity");
iluminationFolder
  .add(ambientLight, "intensity", 0, 2, 0.01)
  .name("Ambient Light Intensity");

// set up light helpers

// set up axes helper

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

// set up camera
const camera = new THREE.PerspectiveCamera(75, width / height);
camera.position.set(-6, 6, 6);

scene.add(camera);

// set up controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;

// set up renderer

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// set up shadow

// Animation loop
const timer = new Timer();

const tick = () => {
  timer.update();
  // const elapsedTime = timer.getElapsed();

  window.requestAnimationFrame(tick);

  // camera.lookAt(mesh.position);

  // update controls to enable damping
  controls.update();

  // render
  renderer.render(scene, camera);
};

tick();

// Handle window resize

window.addEventListener("resize", () => {
  const [width, height] = [
    (canvas.width = window.innerWidth),
    (canvas.height = window.innerHeight),
  ];

  // Update camera aspect ratio and renderer size
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
