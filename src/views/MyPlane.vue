<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'

const container: Ref<HTMLElement | null> = ref(null)

onMounted(() => {
  let mixer: THREE.AnimationMixer
  let animationsStatus = false
  let animations: THREE.AnimationClip[] = []
  let focusing = false

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

  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
  )
  composer.addPass(outlinePass)

  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  renderer.domElement.addEventListener('pointermove', onPointerMove)
  renderer.domElement.addEventListener('dblclick', onPointerClick)

  function onPointerClick(event: MouseEvent) {
    event.preventDefault()
    const intersects = raycaster.intersectObject(scene, true)
    if (intersects.length > 0) {
      focusing = true
      const action = mixer.clipAction(animations[0])
      animationsStatus ? action.setEffectiveTimeScale(0) : action.play().setEffectiveTimeScale(1)
      animationsStatus = !animationsStatus
    }
  }

  function onPointerMove(event: MouseEvent) {
    event.preventDefault()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(scene, true)
    if (intersects.length > 0) {
      const selectedObject = intersects[0].object
      outlinePass.selectedObjects = [selectedObject]
    } else {
      outlinePass.selectedObjects = []
    }
  }

  const loader = new GLTFLoader()
  loader.load(
    '/flying_circus_dae_game_art_assignment/scene.gltf',
    function (gltf) {
      const model = gltf.scene
      animations = gltf.animations
      scene.add(model)

      mixer = new THREE.AnimationMixer(model)

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

    const v = new THREE.Vector3(5, 2, 8)
    if (focusing) {
      camera.position.lerp(v, 0.05)

      if (camera.position.distanceTo(v) < 0.1) {
        focusing = false
      }
    }

    controls.update()

    composer.render()
  }
})
</script>

<template>
  <div ref="container"></div>
</template>

<style scoped></style>
