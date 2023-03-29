<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const container: Ref<HTMLElement | null> = ref(null)

onMounted(() => {
  let mixer: THREE.AnimationMixer

  const clock = new THREE.Clock()

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding
  if (container.value) {
    container.value.appendChild(renderer.domElement)
  }

  const pmremGenerator = new THREE.PMREMGenerator(renderer)

  const scene = new THREE.Scene()
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture

  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100)
  camera.position.set(5, 2, 8)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0.5, 0)
  controls.update()

  const loader = new GLTFLoader()
  loader.load(
    '/flying_circus_dae_game_art_assignment/scene.gltf',
    function (gltf) {
      const model = gltf.scene
      scene.add(model)

      mixer = new THREE.AnimationMixer(model)
      mixer.clipAction(gltf.animations[0]).play()

      animate()
    },
    undefined,
    function (e) {
      console.error(e)
    }
  )

  window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function animate() {
    requestAnimationFrame(animate)

    const delta = clock.getDelta()

    mixer.update(delta)

    controls.update()

    renderer.render(scene, camera)
  }
})
</script>

<template>
  <div ref="container"></div>
</template>

<style scoped></style>
