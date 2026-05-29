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
const SCENE_FADE_SPEED = 0.075
const LAYOUT_PLANE_DISTANCE = 3.2

// Ajuste manual dos 3Ds: use top ou bottom, left ou right, e width ou height.
// Unidades aceitas: px, vw e vh. O outro eixo de tamanho fica proporcional.
const CSS_3D_LAYOUTS = {
  face: [
    {
      breakpoint: 'mobile',
      maxWidth: 720,
      height: '100vh',
      top: '0vh',
      left: '0vw'
    },
    {
      breakpoint: 'desktop',
      minWidth: 721,
      height: '100vh',
      top: '0vh',
      left: '0vw'
    }
  ],
  about: [
    {
      breakpoint: 'mobile',
      maxWidth: 720,
      width: '60vw',
      top: '-5vh',
      left: '5vw'
    },
    {
      breakpoint: 'desktop',
      minWidth: 721,
      width: '34vw',
      top: '2vh',
      left: '33vw'
    }
  ]
}

export default {
  name: 'SceneBackdrop',
  props: {
    activeScene: {
      type: String,
      default: 'hero'
    }
  },
  mounted() {
    this.isUnmounted = false
    this.clock = new THREE.Clock()
    this.pointer = new THREE.Vector2()
    this.targetRotation = new THREE.Vector2()
    this.baseRotation = new THREE.Euler()
    this.sceneWeights = {
      hero: this.activeScene === 'hero' ? 1 : 0,
      about: this.activeScene === 'about' ? 1 : 0
    }
    this.initScene()
    this.loadFace()
    this.resize()
    window.addEventListener('resize', this.resize)
    window.addEventListener('pointermove', this.handlePointerMove, { passive: true })
    this.animate()
  },
  beforeUnmount() {
    this.isUnmounted = true
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('pointermove', this.handlePointerMove)
    cancelAnimationFrame(this.frameId)
    this.disposeObject(this.faceRoot)
    this.disposeObject(this.aboutRoot)
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

      this.aboutRoot = this.createAboutObject()
      this.scene.add(this.aboutRoot)
      this.aboutSize = this.measureObjectSize(this.aboutRoot)
      this.setObjectOpacity(this.aboutRoot, 0)
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
            if (this.isUnmounted) {
              this.disposeObject(gltf.scene)
              return
            }

            const face = gltf.scene.children[0] || gltf.scene

            this.applyTransparentWireframe(face)
            this.faceRoot.add(face)
            this.mixer = new THREE.AnimationMixer(face)

            if (gltf.animations[0]) {
              this.mixer.clipAction(gltf.animations[0]).play()
            }

            this.alignFaceByEyes(face)
            this.measureFace()
            this.resize()
          }
        )
    },
    measureFace() {
      const box = new THREE.Box3().setFromObject(this.faceRoot)
      const center = new THREE.Vector3()
      const size = new THREE.Vector3()

      box.getCenter(center)
      box.getSize(size)
      this.faceRoot.children.forEach((child) => {
        child.position.sub(center)
      })

      this.faceSize = size
    },
    measureObjectSize(object) {
      const box = new THREE.Box3().setFromObject(object)
      const size = new THREE.Vector3()

      box.getSize(size)
      return size
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
      wireMaterial.userData.baseOpacity = wireMaterial.opacity

      face.traverse((child) => {
        if (!child.isMesh) {
          return
        }

        if (child.parent?.name === 'eyeLeft' || child.parent?.name === 'eyeRight') {
          child.visible = false
          return
        }

        child.material = wireMaterial.clone()
        child.material.userData.baseOpacity = wireMaterial.userData.baseOpacity
        child.castShadow = false
        child.receiveShadow = false
      })
    },
    createAboutObject() {
      const root = new THREE.Group()
      const createMaterial = (color, opacity, wireframe = true) => {
        const material = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity,
          depthWrite: false,
          depthTest: false,
          wireframe
        })

        material.userData.baseOpacity = opacity
        return material
      }

      const shellMaterial = createMaterial(0xd8d8d8, 0.2)
      const redMaterial = createMaterial(0xe50914, 0.42)
      const nodeMaterial = createMaterial(0xf5f5f5, 0.5, false)
      const signalMaterial = new THREE.LineBasicMaterial({
        color: 0xe50914,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        depthTest: false
      })
      signalMaterial.userData.baseOpacity = signalMaterial.opacity

      const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.72, 2),
        shellMaterial.clone()
      )
      core.material.userData.baseOpacity = shellMaterial.userData.baseOpacity
      root.add(core)

      const knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.74, 0.045, 180, 12, 2, 5),
        redMaterial.clone()
      )
      knot.material.userData.baseOpacity = redMaterial.userData.baseOpacity
      knot.rotation.set(0.8, 0.12, 0.4)
      root.add(knot)

      const orbitGeometry = new THREE.TorusGeometry(1.05, 0.01, 8, 128)

      for (let index = 0; index < 3; index += 1) {
        const orbit = new THREE.Mesh(orbitGeometry, shellMaterial.clone())
        orbit.material.userData.baseOpacity = 0.14
        orbit.rotation.set(index * 0.72, index * 1.14, index * 0.38)
        root.add(orbit)
      }

      const nodeGeometry = new THREE.SphereGeometry(0.035, 12, 12)
      const linePoints = []

      for (let index = 0; index < 10; index += 1) {
        const angle = (index / 10) * Math.PI * 2
        const radius = index % 2 === 0 ? 1.15 : 0.86
        const point = new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle * 1.5) * 0.28,
          Math.sin(angle) * radius
        )
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone())

        node.material.userData.baseOpacity = nodeMaterial.userData.baseOpacity
        node.position.copy(point)
        root.add(node)
        linePoints.push(point)
      }

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints.concat(linePoints[0]))
      root.add(new THREE.Line(lineGeometry, signalMaterial))

      root.position.set(1.04, 0.08, -0.18)
      root.rotation.set(0.2, -0.4, 0.1)
      return root
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
      this.camera.updateMatrixWorld()
      this.renderer.setSize(width, height, false)
      this.applyCssLayouts(width, height)
    },
    applyCssLayouts(width, height) {
      this.applyObjectCssLayout({
        name: 'face',
        object: this.faceRoot,
        size: this.faceSize,
        width,
        height
      })
      this.applyObjectCssLayout({
        name: 'about',
        object: this.aboutRoot,
        size: this.aboutSize,
        width,
        height
      })
    },
    applyObjectCssLayout({ name, object, size, width, height }) {
      if (!object || !size?.x || !size?.y) {
        return
      }

      const layout = this.getResponsiveLayout(name, width)
      const viewSize = this.getViewSizeAtDistance(LAYOUT_PLANE_DISTANCE, width, height)
      const requestedWidth = layout.width
      const requestedHeight = layout.height
      const desiredWidth = requestedWidth
        ? this.cssLengthToPixels(requestedWidth, width, height)
        : this.cssLengthToPixels(requestedHeight || '50vw', width, height) * (size.x / size.y)
      const desiredHeight = requestedHeight
        ? this.cssLengthToPixels(requestedHeight, width, height)
        : this.cssLengthToPixels(requestedWidth || '50vw', width, height) * (size.y / size.x)
      const scale = layout.width
        ? (desiredWidth / width * viewSize.width) / size.x
        : (desiredHeight / height * viewSize.height) / size.y
      const centerX = this.resolveCssCenter({
        start: layout.left,
        end: layout.right,
        size: desiredWidth,
        viewportSize: width,
        viewportWidth: width,
        viewportHeight: height
      })
      const centerY = this.resolveCssCenter({
        start: layout.top,
        end: layout.bottom,
        size: desiredHeight,
        viewportSize: height,
        viewportWidth: width,
        viewportHeight: height
      })

      object.position.copy(this.screenPointToWorld(centerX, centerY, width, height))
      object.scale.setScalar(scale)

      if (name === 'face') {
        this.faceBaseScale = scale
      } else if (name === 'about') {
        this.aboutBaseScale = scale
        this.aboutOpacityScale = layout.opacity ?? 1
      }
    },
    getResponsiveLayout(name, width) {
      return CSS_3D_LAYOUTS[name].find((layout) => {
        const matchesMin = layout.minWidth === undefined || width >= layout.minWidth
        const matchesMax = layout.maxWidth === undefined || width <= layout.maxWidth

        return matchesMin && matchesMax
      }) || CSS_3D_LAYOUTS[name][0]
    },
    cssLengthToPixels(value, viewportWidth, viewportHeight) {
      if (typeof value === 'number') {
        return value
      }

      const amount = parseFloat(value)

      if (value.endsWith('vw')) {
        return viewportWidth * amount / 100
      }

      if (value.endsWith('vh')) {
        return viewportHeight * amount / 100
      }

      return amount
    },
    resolveCssCenter({ start, end, size, viewportSize, viewportWidth, viewportHeight }) {
      if (start !== undefined) {
        return this.cssLengthToPixels(start, viewportWidth, viewportHeight) + size / 2
      }

      if (end !== undefined) {
        return viewportSize - this.cssLengthToPixels(end, viewportWidth, viewportHeight) - size / 2
      }

      return viewportSize / 2
    },
    getViewSizeAtDistance(distance, width, height) {
      const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2) * distance

      return {
        width: viewHeight * (width / height),
        height: viewHeight
      }
    },
    screenPointToWorld(x, y, width, height) {
      const viewSize = this.getViewSizeAtDistance(LAYOUT_PLANE_DISTANCE, width, height)
      const forward = new THREE.Vector3()
      const right = new THREE.Vector3()
      const up = new THREE.Vector3()

      this.camera.getWorldDirection(forward)
      right.setFromMatrixColumn(this.camera.matrixWorld, 0)
      up.setFromMatrixColumn(this.camera.matrixWorld, 1)

      return new THREE.Vector3()
        .copy(this.camera.position)
        .add(forward.multiplyScalar(LAYOUT_PLANE_DISTANCE))
        .add(right.multiplyScalar((x / width - 0.5) * viewSize.width))
        .add(up.multiplyScalar((0.5 - y / height) * viewSize.height))
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
      this.updateSceneTransition()

      this.faceRoot.rotation.x += (this.baseRotation.x + this.targetRotation.x - this.faceRoot.rotation.x) * 0.055
      this.faceRoot.rotation.y += (this.baseRotation.y + this.targetRotation.y - this.faceRoot.rotation.y) * 0.055
      this.faceRoot.rotation.z += (this.baseRotation.z - this.faceRoot.rotation.z) * 0.055
      this.faceRoot.scale.setScalar((this.faceBaseScale || 1) * (0.94 + this.sceneWeights.hero * 0.06))

      this.aboutRoot.rotation.x += delta * 0.08
      this.aboutRoot.rotation.y += delta * 0.18
      this.aboutRoot.rotation.z += (this.targetRotation.y * 0.16 - this.aboutRoot.rotation.z) * 0.035
      this.aboutRoot.scale.setScalar((this.aboutBaseScale || 1) * (0.9 + this.sceneWeights.about * 0.1))

      this.renderer.render(this.scene, this.camera)
      this.frameId = requestAnimationFrame(this.animate)
    },
    updateSceneTransition() {
      const heroTarget = this.activeScene === 'hero' ? 1 : 0
      const aboutTarget = this.activeScene === 'about' ? 1 : 0

      this.sceneWeights.hero += (heroTarget - this.sceneWeights.hero) * SCENE_FADE_SPEED
      this.sceneWeights.about += (aboutTarget - this.sceneWeights.about) * SCENE_FADE_SPEED

      this.setObjectOpacity(this.faceRoot, this.sceneWeights.hero)
      this.setObjectOpacity(this.aboutRoot, this.sceneWeights.about * (this.aboutOpacityScale || 1))
      this.faceRoot.visible = this.sceneWeights.hero > 0.01
      this.aboutRoot.visible = this.sceneWeights.about > 0.01
    },
    setObjectOpacity(object, weight) {
      object?.traverse((child) => {
        const materials = Array.isArray(child.material) ? child.material : [child.material]

        materials.forEach((material) => {
          if (!material) {
            return
          }

          const baseOpacity = material.userData.baseOpacity ?? material.opacity ?? 1
          material.transparent = true
          material.opacity = baseOpacity * weight
        })
      })
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
