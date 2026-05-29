import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { disposeObject, setObjectOpacity } from './sceneUtils'

const MODEL_PATH = '/models/gltf/facecap.glb'
const FACE_YAW_OFFSET = THREE.MathUtils.degToRad(-30)

export default class HeroFaceScene {
  constructor({ renderer }) {
    this.renderer = renderer
    this.root = new THREE.Group()
    this.baseRotation = new THREE.Euler()
    this.faceSize = new THREE.Vector3(1, 1, 1)
    this.baseScale = 1
    this.currentWeight = 1
    this.disposed = false
  }

  mount(worldScene) {
    worldScene.add(this.root)
    this.loadModel()
  }

  // Carregamento do GLB da primeira secao.
  loadModel() {
    this.ktx2Loader = new KTX2Loader()
      .setTranscoderPath('/')
      .detectSupport(this.renderer)

    new GLTFLoader()
      .setKTX2Loader(this.ktx2Loader)
      .setMeshoptDecoder(MeshoptDecoder)
      .load(
        MODEL_PATH,
        (gltf) => this.handleModelLoaded(gltf),
        undefined,
        (error) => console.error('[HeroFaceScene] Falha ao carregar modelo.', error)
      )
  }

  handleModelLoaded(gltf) {
    if (this.disposed) {
      disposeObject(gltf.scene)
      return
    }

    const face = gltf.scene.children[0] || gltf.scene

    this.applyTransparentWireframe(face)
    this.root.add(face)
    this.mixer = new THREE.AnimationMixer(face)

    if (gltf.animations[0]) {
      this.mixer.clipAction(gltf.animations[0]).play()
    }

    this.alignFaceByEyes(face)
    this.centerFace()
    this.resize(this.lastResizeContext || { width: window.innerWidth })
    this.setOpacity(this.currentWeight)
  }

  // Materiais: a cena decide como o modelo deve aparecer.
  applyTransparentWireframe(face) {
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xb8b8b8,
      transparent: true,
      opacity: 0.34,
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
  }

  // Normalizacao: centraliza o asset para a camera compartilhada.
  centerFace() {
    const box = new THREE.Box3().setFromObject(this.root)
    const center = new THREE.Vector3()
    const size = new THREE.Vector3()

    box.getCenter(center)
    box.getSize(size)

    this.root.children.forEach((child) => {
      child.position.sub(center)
    })

    new THREE.Box3().setFromObject(this.root).getSize(this.faceSize)
  }

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
  }

  // Layout simples por enquanto: foco em renderizar e manter o modulo isolado.
  resize({ width }) {
    this.lastResizeContext = { width }

    const largestSide = Math.max(this.faceSize.x, this.faceSize.y, this.faceSize.z, 1)
    const targetSize = width < 721 ? 2.3 : 2.15

    this.baseScale = targetSize / largestSide
    this.root.position.set(width < 721 ? 0 : -0.16, 0.06, -0.18)
  }

  // Animacao propria da cena hero.
  animate({ delta, pointer, weight }) {
    this.mixer?.update(delta)

    const targetRotationX = (pointer?.y || 0) * 0.2
    const targetRotationY = (pointer?.x || 0) * 0.34

    this.root.rotation.x += (this.baseRotation.x + targetRotationX - this.root.rotation.x) * 0.055
    this.root.rotation.y += (this.baseRotation.y + targetRotationY - this.root.rotation.y) * 0.055
    this.root.rotation.z += (this.baseRotation.z - this.root.rotation.z) * 0.055
    this.root.scale.setScalar(this.baseScale * (0.94 + weight * 0.06))
  }

  setOpacity(weight) {
    this.currentWeight = weight
    setObjectOpacity(this.root, weight)
    this.root.visible = weight > 0.01
  }

  dispose() {
    this.disposed = true
    this.root.parent?.remove(this.root)
    disposeObject(this.root)
    this.ktx2Loader?.dispose()
  }
}
