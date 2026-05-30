import * as THREE from 'three'
import { disposeObject, measureObjectSize, setObjectOpacity } from './sceneUtils'

// Painel de ajuste manual da cena about.
// Mexa nestes valores primeiro para posicionar e calibrar a rede 3D sem cacar numeros no codigo.
// Cada objeto vale a partir do seu breakpointWidth.
// A cena escolhe o maior breakpointWidth menor ou igual a largura atual da tela.
const ABOUT_NETWORK_TUNING = [
  {
    breakpointWidth: 0,

    camera: {
      fov: 10,
      near: 0.01,
      far: 30,
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      lookAt: {
        x: .2,
        y: .41,
        z: -1.5
      }
    },
    modelTargetSize: .35,
    position: {
      x: .25,
      y: .5,
      z: -1.5
    },
    initialRotation: {
      x: 0.2,
      y: -0.4,
      z: 0.1
    },
    spinSpeed: {
      x: 0.22,
      y: 0.14
    },
    pointerRotation: {
      z: 0.56,
      smoothing: 0.035
    },
    weightScaleBoost: 0.1
  },
  {
    breakpointWidth: 720,
    camera: {
      fov: 10,
      near: 0.01,
      far: 30,
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      lookAt: {
        x: .2,
        y: .4,
        z: -1.5
      }
    },
    modelTargetSize: .35,
    position: {
      x: .25,
      y: .5,
      z: -1.5
    },
    initialRotation: {
      x: 0.2,
      y: -0.4,
      z: 0.1
    },
    spinSpeed: {
      x: 0.22,
      y: 0.14
    },
    pointerRotation: {
      z: 0.56,
      smoothing: 0.035
    },
    weightScaleBoost: 0.1
  },
{
    breakpointWidth: 1200,
    camera: {
      fov: 10,
      near: 0.01,
      far: 30,
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      lookAt: {
        x: .2,
        y: .5,
        z: -1.5
      }
    },
    modelTargetSize: .35,
    position: {
      x: .3,
      y: .5,
      z: -1.5
    },
    initialRotation: {
      x: 0.2,
      y: -0.4,
      z: 0.1
    },
    spinSpeed: {
      x: 0.22,
      y: 0.14
    },
    pointerRotation: {
      z: 0.56,
      smoothing: 0.035
    },
    weightScaleBoost: 0.1
  }
]

function getAboutNetworkTuning(width) {
  return ABOUT_NETWORK_TUNING
    .filter((tuning) => tuning.breakpointWidth <= width)
    .sort((a, b) => b.breakpointWidth - a.breakpointWidth)[0] || ABOUT_NETWORK_TUNING[0]
}

export default class AboutNetworkScene {
  constructor() {
    this.root = new THREE.Group()
    this.baseScale = 1
    this.currentTuning = getAboutNetworkTuning(0)
    this.currentBreakpointWidth = null

    this.createObjects()
    this.objectSize = measureObjectSize(this.root)
    this.setOpacity(0)
  }

  mount(worldScene) {
    worldScene.add(this.root)
  }

  // Materiais base usados pelos elementos da cena.
  createMaterial(color, opacity, wireframe = true) {
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

  // Elementos 3D da secao about.
  createObjects() {
    const shellMaterial = this.createMaterial(0xd8d8d8, 0.2)
    const redMaterial = this.createMaterial(0xe50914, 0.42)
    const nodeMaterial = this.createMaterial(0xf5f5f5, 0.5, false)
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
    this.root.add(core)

    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.74, 0.045, 180, 12, 2, 5),
      redMaterial.clone()
    )
    knot.material.userData.baseOpacity = redMaterial.userData.baseOpacity
    knot.rotation.set(0.8, 0.12, 0.4)
    this.root.add(knot)

    const orbitGeometry = new THREE.TorusGeometry(1.05, 0.01, 8, 128)

    for (let index = 0; index < 3; index += 1) {
      const orbit = new THREE.Mesh(orbitGeometry, shellMaterial.clone())

      orbit.material.userData.baseOpacity = 0.14
      orbit.rotation.set(index * 0.72, index * 1.14, index * 0.38)
      this.root.add(orbit)
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
      this.root.add(node)
      linePoints.push(point)
    }

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints.concat(linePoints[0]))
    this.root.add(new THREE.Line(lineGeometry, signalMaterial))
    this.root.rotation.set(
      this.currentTuning.initialRotation.x,
      this.currentTuning.initialRotation.y,
      this.currentTuning.initialRotation.z
    )
  }

  // Layout da cena about. A camera e suavizada pelo SceneBackdrop.
  resize(context = {}) {
    const { width = 0 } = context

    this.lastResizeContext = context
    this.currentTuning = getAboutNetworkTuning(width)

    if (this.currentBreakpointWidth !== this.currentTuning.breakpointWidth) {
      this.currentBreakpointWidth = this.currentTuning.breakpointWidth
      this.root.rotation.set(
        this.currentTuning.initialRotation.x,
        this.currentTuning.initialRotation.y,
        this.currentTuning.initialRotation.z
      )
    }

    const largestSide = Math.max(this.objectSize.x, this.objectSize.y, this.objectSize.z, 1)

    this.baseScale = this.currentTuning.modelTargetSize / largestSide
    this.root.position.set(
      this.currentTuning.position.x,
      this.currentTuning.position.y,
      this.currentTuning.position.z
    )
  }

  getCameraConfig({ width } = {}) {
    return getAboutNetworkTuning(width || 0).camera
  }

  // Animacao propria da cena about.
  animate({ delta, pointer, weight }) {
    this.root.rotation.x += delta * this.currentTuning.spinSpeed.x
    this.root.rotation.y += delta * this.currentTuning.spinSpeed.y
    this.root.rotation.z += (
      (pointer?.x || 0) * this.currentTuning.pointerRotation.z - this.root.rotation.z
    ) * this.currentTuning.pointerRotation.smoothing
    this.root.scale.setScalar(
      this.baseScale * (
        1 - this.currentTuning.weightScaleBoost + weight * this.currentTuning.weightScaleBoost
      )
    )
  }

  setOpacity(weight) {
    setObjectOpacity(this.root, weight)
    this.root.visible = weight > 0.01
  }

  dispose() {
    this.root.parent?.remove(this.root)
    disposeObject(this.root)
  }
}
