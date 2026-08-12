<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CarViewerSkeleton from "./CarViewerSkeleton.vue";

const containerEl = ref<HTMLDivElement | null>(null);
const modelLoading = ref(true);
const error = ref("");

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let controls: OrbitControls | null = null;
let resizeObserver: ResizeObserver | null = null;
let rafHandle = 0;
let loadedScene: THREE.Object3D | null = null;
let dracoLoader: DRACOLoader | null = null;
let ambientLight: THREE.AmbientLight | null = null;
let keyLight: THREE.DirectionalLight | null = null;
let fillLight: THREE.DirectionalLight | null = null;

const BASE_INTENSITIES = { ambient: 0.6, key: 1.2, fill: 0.4 };
const MIN_BRIGHTNESS = 0.4;
const MAX_BRIGHTNESS = 2.2;
const brightness = ref(1);

function disposeMaterial(material: THREE.Material): void {
  Object.values(material).forEach((value) => {
    if (value instanceof THREE.Texture) {
      value.dispose();
    }
  });
  material.dispose();
}

function zoomBy(factor: number): void {
  if (!camera || !controls) return;
  const offset = camera.position.clone().sub(controls.target);
  const spherical = new THREE.Spherical().setFromVector3(offset);
  spherical.radius = THREE.MathUtils.clamp(
    spherical.radius * factor,
    controls.minDistance,
    controls.maxDistance,
  );
  camera.position
    .copy(controls.target)
    .add(new THREE.Vector3().setFromSpherical(spherical));
  controls.update();
}

function rotateBy(deltaTheta: number): void {
  if (!camera || !controls) return;
  const offset = camera.position.clone().sub(controls.target);
  const spherical = new THREE.Spherical().setFromVector3(offset);
  spherical.theta += deltaTheta;
  camera.position
    .copy(controls.target)
    .add(new THREE.Vector3().setFromSpherical(spherical));
  controls.update();
}

function zoomIn(): void {
  zoomBy(0.8);
}

function zoomOut(): void {
  zoomBy(1.25);
}

function rotateLeft(): void {
  rotateBy(-Math.PI / 8);
}

function rotateRight(): void {
  rotateBy(Math.PI / 8);
}

function applyBrightness(): void {
  if (ambientLight) ambientLight.intensity = BASE_INTENSITIES.ambient * brightness.value;
  if (keyLight) keyLight.intensity = BASE_INTENSITIES.key * brightness.value;
  if (fillLight) fillLight.intensity = BASE_INTENSITIES.fill * brightness.value;
}

function dimLight(): void {
  brightness.value = THREE.MathUtils.clamp(brightness.value - 0.2, MIN_BRIGHTNESS, MAX_BRIGHTNESS);
  applyBrightness();
}

function brightenLight(): void {
  brightness.value = THREE.MathUtils.clamp(brightness.value + 0.2, MIN_BRIGHTNESS, MAX_BRIGHTNESS);
  applyBrightness();
}

function disposeScene(): void {
  loadedScene?.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(disposeMaterial);
      } else {
        disposeMaterial(mesh.material);
      }
    }
  });
  loadedScene = null;
}

onMounted(() => {
  const container = containerEl.value;
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100000);
  camera.position.set(4, 2, 6);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  ambientLight = new THREE.AmbientLight(0xffffff, BASE_INTENSITIES.ambient * brightness.value);
  keyLight = new THREE.DirectionalLight(0xffffff, BASE_INTENSITIES.key * brightness.value);
  keyLight.position.set(5, 8, 5);
  fillLight = new THREE.DirectionalLight(0xffffff, BASE_INTENSITIES.fill * brightness.value);
  fillLight.position.set(-5, 2, -5);
  scene.add(ambientLight, keyLight, fillLight);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.5;
  controls.enableZoom = true;
  controls.enablePan = false;

  dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");

  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load(
    "/kia_rio.glb",
    (gltf) => {
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const sphere = box.getBoundingSphere(new THREE.Sphere());

      gltf.scene.position.sub(center);
      scene?.add(gltf.scene);
      loadedScene = gltf.scene;

      const distance = Math.max(sphere.radius * 1.4, 2);
      if (camera) {
        camera.near = Math.max(distance / 100, 0.01);
        camera.far = distance + sphere.radius * 4;
        camera.position.set(distance, distance * 0.5, distance);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
      }
      if (controls) {
        controls.target.set(0, 0, 0);
        controls.minDistance = sphere.radius * 0.5;
        controls.maxDistance = sphere.radius * 6;
        controls.update();
      }

      modelLoading.value = false;
    },
    undefined,
    () => {
      error.value = "No se pudo cargar el modelo 3D.";
      modelLoading.value = false;
    },
  );

  function animate(): void {
    rafHandle = requestAnimationFrame(animate);
    controls?.update();
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }
  animate();

  resizeObserver = new ResizeObserver(() => {
    if (!renderer || !camera || !container) return;
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
  resizeObserver.observe(container);
});

onUnmounted(() => {
  cancelAnimationFrame(rafHandle);
  resizeObserver?.disconnect();
  controls?.dispose();
  dracoLoader?.dispose();
  disposeScene();
  ambientLight = null;
  keyLight = null;
  fillLight = null;
  if (renderer) {
    renderer.dispose();
    renderer.domElement.remove();
  }
});
</script>

<template>
  <div
    ref="containerEl"
    class="relative h-[26rem] w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
    data-testid="car-viewer"
  >
    <CarViewerSkeleton v-if="modelLoading && !error" class="absolute inset-0" />
    <p
      v-if="error"
      class="absolute inset-0 flex items-center justify-center text-sm text-slate-500"
    >
      {{ error }}
    </p>
    <div
      v-if="!modelLoading && !error"
      class="absolute bottom-4 right-4 flex gap-2"
      data-testid="car-viewer-controls"
    >
      <button
        type="button"
        aria-label="Girar a la izquierda"
        class="icon-btn"
        @click="rotateLeft"
      >
        ↺
      </button>
      <button
        type="button"
        aria-label="Girar a la derecha"
        class="icon-btn"
        @click="rotateRight"
      >
        ↻
      </button>
      <button
        type="button"
        aria-label="Alejar"
        class="icon-btn"
        @click="zoomOut"
      >
        −
      </button>
      <button
        type="button"
        aria-label="Acercar"
        class="icon-btn"
        @click="zoomIn"
      >
        +
      </button>
      <button
        type="button"
        aria-label="Oscurecer"
        class="icon-btn"
        @click="dimLight"
      >
        🔅
      </button>
      <button
        type="button"
        aria-label="Aclarar"
        class="icon-btn"
        @click="brightenLight"
      >
        🔆
      </button>
    </div>
  </div>
</template>
