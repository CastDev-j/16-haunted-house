import "./style.css";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import GUI from "lil-gui";
import { Sky, Timer } from "three/examples/jsm/Addons.js";

// set up texture loader

const textureLoader = new THREE.TextureLoader();

// Textures

// floor

const alphaTexture = textureLoader.load("/textures/floor/alpha.webp");

// door
const doorTexture = textureLoader.load("/textures/door/color.webp");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.webp");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.webp"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.webp");
const doorNormalTexture = textureLoader.load("/textures/door/normal.webp");
const doorMetalnessTexture = textureLoader.load(
  "/textures/door/metalness.webp"
);
const doorRoughnessTexture = textureLoader.load(
  "/textures/door/roughness.webp"
);

doorTexture.colorSpace = THREE.SRGBColorSpace;

// terrain

const terrainColorTexture = textureLoader.load(
  "/textures/terrain/coast_sand_rocks_02_diff_1k.webp"
);

const terrainARMTexture = textureLoader.load(
  "/textures/terrain/coast_sand_rocks_02_arm_1k.webp"
);

const terrainNormalTexture = textureLoader.load(
  "/textures/terrain/coast_sand_rocks_02_nor_gl_1k.webp"
);

const terrainDisplacementTexture = textureLoader.load(
  "/textures/terrain/coast_sand_rocks_02_disp_1k.webp"
);

terrainColorTexture.colorSpace = THREE.SRGBColorSpace;

terrainColorTexture.repeat.set(8, 8);
terrainARMTexture.repeat.set(8, 8);
terrainDisplacementTexture.repeat.set(8, 8);
terrainNormalTexture.repeat.set(8, 8);

terrainColorTexture.wrapS = THREE.RepeatWrapping;
terrainColorTexture.wrapT = THREE.RepeatWrapping;
terrainARMTexture.wrapS = THREE.RepeatWrapping;
terrainARMTexture.wrapT = THREE.RepeatWrapping;
terrainDisplacementTexture.wrapS = THREE.RepeatWrapping;
terrainDisplacementTexture.wrapT = THREE.RepeatWrapping;
terrainNormalTexture.wrapS = THREE.RepeatWrapping;
terrainNormalTexture.wrapT = THREE.RepeatWrapping;

// walls

const wallColorTexture = textureLoader.load(
  "/textures/wall/castle_brick_broken_06_diff_1k.webp"
);
const wallNormalTexture = textureLoader.load(
  "/textures/wall/castle_brick_broken_06_nor_gl_1k.webp"
);
const wallARMTexture = textureLoader.load(
  "/textures/wall/castle_brick_broken_06_arm_1k.webp"
);

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

// roof

const roofColorTexture = textureLoader.load(
  "/textures/roof/roof_slates_02_diff_1k.webp"
);
const roofNormalTexture = textureLoader.load(
  "/textures/roof/roof_slates_02_nor_gl_1k.webp"
);
const roofARMTexture = textureLoader.load(
  "/textures/roof/roof_slates_02_arm_1k.webp"
);

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;

// leaves

const leavesColorTexture = textureLoader.load(
  "/textures/leaves/leaves_forest_ground_diff_1k.webp"
);
const leavesNormalTexture = textureLoader.load(
  "/textures/leaves/leaves_forest_ground_nor_gl_1k.webp"
);
const leavesARMTexture = textureLoader.load(
  "/textures/leaves/leaves_forest_ground_arm_1k.webp"
);

leavesColorTexture.colorSpace = THREE.SRGBColorSpace;

// graves

const graveColorTexture = textureLoader.load(
  "/textures/grave/plastered_stone_wall_diff_1k.webp"
);
const graveNormalTexture = textureLoader.load(
  "/textures/grave/plastered_stone_wall_nor_gl_1k.webp"
);
const graveARMTexture = textureLoader.load(
  "/textures/grave/plastered_stone_wall_arm_1k.webp"
);

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

// setup gui

const gui = new GUI();
gui.close();
gui.hide();

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

const floorFolder = gui.addFolder("Floor");

const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 128, 128),
  new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: alphaTexture,
    map: terrainColorTexture,
    aoMap: terrainARMTexture,
    metalnessMap: terrainARMTexture,
    roughnessMap: terrainARMTexture,
    normalMap: terrainNormalTexture,
    displacementMap: terrainDisplacementTexture,
    displacementScale: 0.2,
  })
);
floorMesh.rotation.x = -Math.PI / 2;
scene.add(floorMesh);

floorFolder.add(floorMesh.material, "roughness", 0, 1, 0.01).name("Roughness");
floorFolder
  .add(floorMesh.material, "displacementScale", 0, 1, 0.1)
  .name("Displacement Scale");
floorFolder
  .add(floorMesh.material, "transparent")
  .name("Transparent")
  .onChange((value: number) => {
    floorMesh.material.alphaMap = value ? alphaTexture : null;
  });

// house

const houseGroup = new THREE.Group();

const houseWalls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    transparent: true,
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  })
);
houseWalls.position.y = houseWalls.geometry.parameters.height / 2;

const houseRoof = new THREE.Mesh(
  new THREE.ConeGeometry(3, 2, 4),
  new THREE.MeshStandardMaterial({
    transparent: true,
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
);
houseRoof.position.y =
  houseWalls.geometry.parameters.height +
  houseRoof.geometry.parameters.height / 2;
houseRoof.rotation.y = Math.PI / 4;

const houseDoor = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 32, 32),
  new THREE.MeshStandardMaterial({
    transparent: true,
    map: doorTexture,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
houseDoor.position.set(0, 1, 2.01);

const doorLight = new THREE.PointLight(0xff7d46, 1, 7);
doorLight.position.set(0, 2.2, 2.5);

houseGroup.add(houseWalls, houseRoof, houseDoor, doorLight);

scene.add(houseGroup);

// bushes

const bushMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  map: leavesColorTexture,
  aoMap: leavesARMTexture,
  roughnessMap: leavesARMTexture,
  metalnessMap: leavesARMTexture,
  normalMap: leavesNormalTexture,
});

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);

bush1.scale.setScalar(0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75;

bush2.scale.setScalar(0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;

bush3.scale.setScalar(0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;

bush4.scale.setScalar(0.15);
bush4.position.set(-1, 0.05, 2.6);
bush4.rotation.x = -0.75;

scene.add(bush1, bush2, bush3, bush4);

// set up the graves

const graveGroup = new THREE.Group();

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);

const graveMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
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

const lightConfig = {
  color: "#86cdff",
  directionalIntensity: 1,
  ambientIntensity: 0.2,
};

const lightFolder = gui.addFolder("Lights");

const directionalLight = new THREE.DirectionalLight(0x86cdff, 0.2);
const ambientLight = new THREE.AmbientLight(0x86cdff, 0.2);

directionalLight.position.set(3, 2, -8);

scene.add(directionalLight, ambientLight);

lightFolder
  .add(directionalLight, "intensity", 0, 2, 0.01)
  .name("Directional Light Intensity");
lightFolder
  .add(ambientLight, "intensity", 0, 2, 0.01)
  .name("Ambient Light Intensity");

lightFolder
  .addColor(lightConfig, "color")
  .name("Light Color")
  .onChange((value: string) => {
    directionalLight.color.set(value);
    ambientLight.color.set(value);
  });

// ghosts

const ghost1 = new THREE.PointLight(0x8800ff, 6);
const ghost2 = new THREE.PointLight(0xff0088, 6);
const ghost3 = new THREE.PointLight(0xff0000, 6);

scene.add(ghost1, ghost2, ghost3);
// set up light helpers

// set up axes helper

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

// set up camera
const camera = new THREE.PerspectiveCamera(75, width / height);
camera.position.set(4, 2, 8);

scene.add(camera);

// set up controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2 - 0.1;
controls.minDistance = 5;
controls.maxDistance = 30;

// set up renderer

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// set up shadows

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

houseWalls.castShadow = true;
houseRoof.castShadow = true;
houseDoor.castShadow = true;

bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;

directionalLight.castShadow = true;

ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

houseWalls.receiveShadow = true;
houseRoof.receiveShadow = true;
houseDoor.receiveShadow = true;

floorMesh.receiveShadow = true;

graveGroup.children.forEach((grave) => {
  grave.castShadow = true;
  grave.receiveShadow = true;
});

// mapping

directionalLight.shadow.mapSize.set(256, 256);
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

// sky

const sky = new Sky();
sky.scale.setScalar(100);

sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 2;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

scene.add(sky);

// fog

scene.fog = new THREE.FogExp2("#02343f", 0.05);

// Animation loop
const timer = new Timer();

const tick = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();

  window.requestAnimationFrame(tick);

  // camera.lookAt(mesh.position);

  //ghost animations (slower)
  ghost1.position.x = Math.cos(elapsedTime * 0.25) * 6;
  ghost1.position.z = Math.sin(elapsedTime * 0.25) * 6;
  ghost1.position.y =
    Math.abs(Math.sin(elapsedTime * 1.5) * Math.sin(elapsedTime * 1.17)) + 1;

  ghost2.position.x = -Math.cos(elapsedTime * 0.15) * 7;
  ghost2.position.z = -Math.sin(elapsedTime * 0.15) * 7;
  ghost2.position.y =
    Math.abs(Math.sin(elapsedTime * 1) * Math.sin(elapsedTime * 1.17)) + 0;

  ghost3.position.x = Math.cos(elapsedTime * 0.2) * 5;
  ghost3.position.z = Math.sin(elapsedTime * 0.2) * 5;
  ghost3.position.y =
    Math.abs(Math.sin(elapsedTime * 0.5) * Math.sin(elapsedTime * 1.17)) + 2;

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
