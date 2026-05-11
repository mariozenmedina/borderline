<template>
  <div ref="stage" class="scene-backdrop" aria-hidden="true"></div>
</template>

<script>
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

const MODEL_PATH = '/models/gltf/facecap.glb'
const FACE_YAW_OFFSET = THREE.MathUtils.degToRad(-30)

export default {
  name: 'SceneBackdrop',
  mounted() {
    this.clock = new THREE.Clock()
    this.pointer = new THREE.Vector2()
    this.targetRotation = new THREE.Vector2()
    this.baseRotation = new THREE.Euler()
    this.initScene()
    this.loadFace()
    this.resize()
    window.addEventListener('resize', this.resize)
    window.addEventListener('pointermove', this.handlePointerMove, { passive: true })
    this.animate()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('pointermove', this.handlePointerMove)
    cancelAnimationFrame(this.frameId)
    this.disposeObject(this.faceRoot)
    this.environmentTexture?.dispose()
    this.pmremGenerator?.dispose()
    this.ktx2Loader?.dispose()
    this.renderer?.dispose()
  },
  methods: {
    initScene() {
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(45, 1, 1, 20)
      this.camera.position.set(-1.8, 0.8, 3)
      this.camera.lookAt(0, 0.15, -0.2)

      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      })
      this.renderer.setClearColor(0x000000, 0)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      this.renderer.outputColorSpace = THREE.SRGBColorSpace
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping
      this.$refs.stage.appendChild(this.renderer.domElement)

      this.pmremGenerator = new THREE.PMREMGenerator(this.renderer)
      this.environmentTexture = this.pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture
      this.scene.environment = this.environmentTexture

      this.faceRoot = new THREE.Group()
      this.scene.add(this.faceRoot)
    },
    loadFace() {
      this.ktx2Loader = new KTX2Loader()
        .setTranscoderPath('/')
        .detectSupport(this.renderer)

      new GLTFLoader()
        .setKTX2Loader(this.ktx2Loader)
        .setMeshoptDecoder(MeshoptDecoder)
        .load(
          MODEL_PATH,
          (gltf) => {
            const face = gltf.scene.children[0] || gltf.scene

            this.applyTransparentWireframe(face)
            this.faceRoot.add(face)
            this.mixer = new THREE.AnimationMixer(face)

            if (gltf.animations[0]) {
              this.mixer.clipAction(gltf.animations[0]).play()
            }

            this.alignFaceByEyes(face)
          }
        )
    },
    applyTransparentWireframe(face) {
      const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xb8b8b8,
        transparent: true,
        opacity: 0.16,
        alphaTest: 0,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
        wireframe: true
      })

      face.traverse((child) => {
        if (!child.isMesh) {
          return
        }

        if (child.parent?.name === 'eyeLeft' || child.parent?.name === 'eyeRight') {
          child.visible = false
          return
        }

        child.material = wireMaterial.clone()
        child.castShadow = false
        child.receiveShadow = false
      })
    },
    alignFaceByEyes(face) {
      face.updateWorldMatrix(true, true)

      const leftEye = face.getObjectByName('grp_eyeLeft') || face.getObjectByName('eyeLeft')
      const rightEye = face.getObjectByName('grp_eyeRight') || face.getObjectByName('eyeRight')

      if (!leftEye || !rightEye) {
        return
      }

      const left = new THREE.Vector3()
      const right = new THREE.Vector3()

      leftEye.getWorldPosition(left)
      rightEye.getWorldPosition(right)

      const eyeTilt = Math.atan2(right.y - left.y, right.x - left.x)
      const eyeYaw = Math.atan2(right.z - left.z, right.x - left.x)

      this.baseRotation.z = -eyeTilt
      this.baseRotation.y = eyeYaw + FACE_YAW_OFFSET
    },
    resize() {
      const width = window.innerWidth
      const height = window.innerHeight

      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(width, height, false)
    },
    handlePointerMove(event) {
      this.pointer.x = (event.clientX / window.innerWidth - 0.5) * 2
      this.pointer.y = (event.clientY / window.innerHeight - 0.5) * 2
      this.targetRotation.y = this.pointer.x * 0.34
      this.targetRotation.x = this.pointer.y * 0.2
    },
    animate() {
      const delta = this.clock.getDelta()

      this.mixer?.update(delta)
      this.faceRoot.rotation.x += (this.baseRotation.x + this.targetRotation.x - this.faceRoot.rotation.x) * 0.055
      this.faceRoot.rotation.y += (this.baseRotation.y + this.targetRotation.y - this.faceRoot.rotation.y) * 0.055
      this.faceRoot.rotation.z += (this.baseRotation.z - this.faceRoot.rotation.z) * 0.055

      this.renderer.render(this.scene, this.camera)
      this.frameId = requestAnimationFrame(this.animate)
    },
    disposeObject(object) {
      object?.traverse((child) => {
        child.geometry?.dispose()

        if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose())
        } else {
          child.material?.dispose()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.scene-backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
