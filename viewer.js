import * as THREE from "./threeJs/three.module.js";
import { GLTFLoader } from "./threeJs/addon/GLTFLoader.js";
import { OrbitControls } from "./threeJs/addon/OrbitControls.js";

let scene, camera, renderer, model, controls;
let isZoomingIn = false;
let isZoomingOut = false;
let isScrollwheelZoomEnabled = true;

function init() {
	const loadingElement = document.getElementById("loading");

	// Create scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x87ceeb); // Sky blue background

	// Create camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0, 5, 10);

	// Create renderer
	renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("viewer"), antialias: true });
	renderer.setSize(800, 600);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	// Lighting setup
	setupLighting();

	//Grass plane
	addGrassPlane();

	// Load 3D model
	const loader = new GLTFLoader();
	loader.load(
		"model/apollo_exterior-150k-4096.gltf",
		(gltf) => {
			model = gltf.scene;
			scene.add(model);

			model.traverse((child) => {
				if (child.isMesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});

			// Center and scale the model
			const box = new THREE.Box3().setFromObject(model);
			const size = box.getSize(new THREE.Vector3());
			const center = box.getCenter(new THREE.Vector3());

			const scale = 20 / Math.max(size.x, size.y, size.z);
			model.scale.set(scale, scale, scale);

			model.position.sub(center.multiplyScalar(scale));
			model.position.y = 0;

			// Position camera to view the entire model
			const distance = Math.max(size.x, size.y, size.z) * 1.25 * scale;
			camera.position.set(distance, distance / 2, distance);
			camera.lookAt(new THREE.Vector3(0, 0, 0));

			// Set up OrbitControls
			controls = new OrbitControls(camera, renderer.domElement);
			controls.target.set(0, 0, 0);
			controls.update();

			// Enable scrollwheel zoom initially
			controls.enableZoom = true;

			// Hide loading message and show the canvas
			loadingElement.style.display = "none";
			document.querySelector("canvas").style.display = "block";

			// Start animation loop
			animate();
		},
		undefined,
		(error) => {
			console.error("An error occurred while loading the model:", error);
		}
	);

	// Set up zoom in and zoom out buttons
	document.getElementById("zoom-in").addEventListener("mousedown", startZoomIn);
	document.getElementById("zoom-in").addEventListener("mouseup", stopZoom);
	document.getElementById("zoom-in").addEventListener("mouseleave", stopZoom);

	document.getElementById("zoom-out").addEventListener("mousedown", startZoomOut);
	document.getElementById("zoom-out").addEventListener("mouseup", stopZoom);
	document.getElementById("zoom-out").addEventListener("mouseleave", stopZoom);

	// Additional controls
	document.getElementById("reset-view").addEventListener("click", resetView);
	document.getElementById("toggle-scrollwheel").addEventListener("click", toggleScrollwheelZoom);
}

function setupLighting() {
	// Ambient light
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
	scene.add(ambientLight);

	// Main directional light (sun)
	const sunLight = new THREE.DirectionalLight(0xffffff, 1);
	sunLight.position.set(25, 50, 25);
	sunLight.castShadow = true;
	scene.add(sunLight);

	// Set up shadow properties for sunLight
	sunLight.shadow.mapSize.width = 4096;
	sunLight.shadow.mapSize.height = 4096;
	sunLight.shadow.camera.near = 1;
	sunLight.shadow.camera.far = 200;
	sunLight.shadow.camera.left = -50;
	sunLight.shadow.camera.right = 50;
	sunLight.shadow.camera.top = 50;
	sunLight.shadow.camera.bottom = -50;

	// Warm fill light
	const warmFillLight = new THREE.DirectionalLight(0xffaa00, 0.5);
	warmFillLight.position.set(-20, 30, 20);
	scene.add(warmFillLight);

	// Cool rim light
	const coolRimLight = new THREE.DirectionalLight(0x4b79e4, 0.3);
	coolRimLight.position.set(20, 30, -20);
	scene.add(coolRimLight);
}

function addGrassPlane() {
	// Load grass texture (got the texture from https://github.com/jeromeetienne/threex.grassground/blob/master/images/grasslight-big.jpg)
	const textureLoader = new THREE.TextureLoader();
	const grassTexture = textureLoader.load("textures/grass.jpg", () => {
		grassTexture.wrapS = THREE.RepeatWrapping;
		grassTexture.wrapT = THREE.RepeatWrapping;
		grassTexture.repeat.set(10, 10);
	});

	// Add a plane with grass texture
	const planeGeometry = new THREE.PlaneGeometry(50, 50);
	const planeMaterial = new THREE.MeshStandardMaterial({
		map: grassTexture,
		roughness: 0.8,
		metalness: 0.2,
	});
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.rotation.x = -Math.PI / 2;
	plane.position.y = -12.5;
	plane.receiveShadow = true;
	scene.add(plane);
}
function animate() {
	requestAnimationFrame(animate);

	// Handle zoom in/out
	if (isZoomingIn) {
		camera.position.multiplyScalar(0.99);
	}
	if (isZoomingOut) {
		camera.position.multiplyScalar(1.01);
	}

	controls.update();
	renderer.render(scene, camera);
}

// Zoom functions
function startZoomIn() {
	isZoomingIn = true;
}

function startZoomOut() {
	isZoomingOut = true;
}

function stopZoom() {
	isZoomingIn = false;
	isZoomingOut = false;
}

// Additional functions
function resetView() {
	if (model) {
		const box = new THREE.Box3().setFromObject(model);
		const size = box.getSize(new THREE.Vector3());
		const distance = Math.max(size.x, size.y, size.z) * 1.25;
		camera.position.set(distance, distance / 2, distance);
		camera.lookAt(new THREE.Vector3(0, 0, 0));
		controls.target.set(0, 0, 0);
		controls.update();
	}
}

function toggleScrollwheelZoom() {
	isScrollwheelZoomEnabled = !isScrollwheelZoomEnabled;
	controls.enableZoom = isScrollwheelZoomEnabled;
	const button = document.getElementById("toggle-scrollwheel");
	button.textContent = `Scrollwheel zoom: ${isScrollwheelZoomEnabled ? "On" : "Off"}`;
}

// Initialize the viewer
init();
