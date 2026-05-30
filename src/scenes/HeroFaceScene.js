import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { disposeObject, setObjectOpacity } from './sceneUtils'

const MODEL_PATH = '/models/gltf/facecap.glb'
const GLASSES_MODEL_PATH = '/models/obj/oculos.obj'
const FACE_YAW_OFFSET = THREE.MathUtils.degToRad(0)

// Painel de ajuste manual do rosto da hero.
// Mexa nestes valores primeiro para posicionar o modelo sem precisar cacar numeros no codigo.
const HERO_FACE_TUNING = {
  // Camera compartilhada: estes valores sao aplicados apenas quando esta cena recebe a camera no resize.
  // Como a camera e global, ajustes aqui tambem influenciam o enquadramento das outras cenas.
  camera: {
    fov: 30,
    near: 0.01,
    far: 30,
    position: {
      x: 0,
      y: 0,
      z: 1.5
    },
    lookAt: {
      x: 0,
      y: 0,
      z: 0
    }
  },

  // Tamanho final do asset depois da normalizacao pela maior dimensao do modelo.
  // Aumente para aproximar o rosto; reduza para dar mais respiro no enquadramento.
  modelTargetSize: 2,

  // Posicao do grupo inteiro no mundo 3D.
  // x: esquerda/direita, y: baixo/cima, z: para tras/para frente em relacao a camera.
  position: {
    x: 0,
    y: 0.3,
    z: 0
  },

  // Rotacao base extra, em graus, depois do alinhamento automatico pelos olhos.
  rotationOffset: {
    x: 0,
    y: 0,
    z: 0
  },

  // Pulso leve ligado ao peso/visibilidade da secao. Use 0 para manter escala fixa.
  weightScaleBoost: 0.06,

  // Quanto o mouse inclina o rosto. Use 0 nos eixos que quiser travar.
  pointerRotation: {
    x: 0.2,
    y: 0.34
  }
}

// Controlador temporario para encaixe manual do oculos.
// Estes valores sao locais ao rosto ja centralizado; o grupo ainda segue o tuning da face.
const GLASSES_FIT_CONTROLLER = {
  scale: 1.1,
  position: {
    x: 0,
    y: .145,
    z: .07
  },
  rotation: {
    x: 0,
    y: 0,
    z: 0
  }
}

export default class HeroFaceScene {
  constructor({ renderer }) {
    this.renderer = renderer
    this.root = new THREE.Group()
    this.baseRotation = new THREE.Euler()
    this.faceSize = new THREE.Vector3(1, 1, 1)
    this.modelCenter = new THREE.Vector3()
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
    this.loadGlasses()
    this.resize(this.lastResizeContext || { width: window.innerWidth })
    this.setOpacity(this.currentWeight)
  }

  loadGlasses() {
    new OBJLoader().load(
      GLASSES_MODEL_PATH,
      (object) => this.handleGlassesLoaded(object),
      undefined,
      (error) => console.error('[HeroFaceScene] Falha ao carregar oculos OBJ.', error)
    )
  }

  handleGlassesLoaded(object) {
    if (this.disposed) {
      disposeObject(object)
      return
    }

    const glasses = new THREE.Group()
    glasses.name = 'hero-glasses'
    glasses.add(object)

    const material = new THREE.MeshBasicMaterial({
      color: 0xb8b8b8,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
      wireframe: true
    })
    material.userData.baseOpacity = material.opacity

    object.traverse((child) => {
      if (!child.isMesh) {
        return
      }

      child.material = material.clone()
      child.material.userData.baseOpacity = material.userData.baseOpacity
      child.castShadow = false
      child.receiveShadow = false
    })

    const rotation = GLASSES_FIT_CONTROLLER.rotation
    glasses.rotation.set(
      THREE.MathUtils.degToRad(rotation.x),
      THREE.MathUtils.degToRad(rotation.y),
      THREE.MathUtils.degToRad(rotation.z)
    )
    glasses.scale.setScalar(GLASSES_FIT_CONTROLLER.scale)
    glasses.position.copy(GLASSES_FIT_CONTROLLER.position).sub(this.modelCenter)

    this.root.add(glasses)
    this.glasses = glasses
    this.setOpacity(this.currentWeight)
  }

  // Materiais: a cena decide como o modelo deve aparecer.
  applyTransparentWireframe(face) {
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xe50914,
      transparent: true,
      opacity: 0.05,
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

    this.modelCenter.copy(center)
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

  // Layout da hero. A camera e suavizada pelo SceneBackdrop.
  resize(context = {}) {
    this.lastResizeContext = context

    const largestSide = Math.max(this.faceSize.x, this.faceSize.y, this.faceSize.z, 1)
    const targetSize = HERO_FACE_TUNING.modelTargetSize

    this.baseScale = targetSize / largestSide
    this.root.position.set(
      HERO_FACE_TUNING.position.x,
      HERO_FACE_TUNING.position.y,
      HERO_FACE_TUNING.position.z
    )
  }

  getCameraConfig() {
    return HERO_FACE_TUNING.camera
  }

  // Animacao propria da cena hero.
  animate({ delta, pointer, weight }) {
    this.mixer?.update(delta)

    const targetRotationX = (pointer?.y || 0) * HERO_FACE_TUNING.pointerRotation.x
    const targetRotationY = (pointer?.x || 0) * HERO_FACE_TUNING.pointerRotation.y
    const rotationOffsetX = THREE.MathUtils.degToRad(HERO_FACE_TUNING.rotationOffset.x)
    const rotationOffsetY = THREE.MathUtils.degToRad(HERO_FACE_TUNING.rotationOffset.y)
    const rotationOffsetZ = THREE.MathUtils.degToRad(HERO_FACE_TUNING.rotationOffset.z)

    this.root.rotation.x += (
      this.baseRotation.x + rotationOffsetX + targetRotationX - this.root.rotation.x
    ) * 0.055
    this.root.rotation.y += (
      this.baseRotation.y + rotationOffsetY + targetRotationY - this.root.rotation.y
    ) * 0.055
    this.root.rotation.z += (this.baseRotation.z + rotationOffsetZ - this.root.rotation.z) * 0.055
    this.root.scale.setScalar(
      this.baseScale * (
        1 - HERO_FACE_TUNING.weightScaleBoost + weight * HERO_FACE_TUNING.weightScaleBoost
      )
    )
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
