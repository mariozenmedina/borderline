import * as THREE from 'three'
import { disposeObject, measureObjectSize, setObjectOpacity } from './sceneUtils'

// Painel de ajuste manual da cena about.
// Mexa nestes valores primeiro para posicionar e calibrar a rede 3D sem cacar numeros no codigo.
// Cada objeto vale a partir do seu breakpointWidth.
// A cena escolhe o maior breakpointWidth menor ou igual a largura atual da tela.
const ABOUT_NETWORK_TUNING = [
  {
    breakpointWidth: 0,

    // Camera compartilhada: estes valores sao aplicados apenas quando esta cena recebe a camera no resize.
    // Como a camera e global, ajustes aqui tambem influenciam o enquadramento das outras cenas.
    camera: {
      fov: 65,
      near: 0.01,
      far: 20,
      position: {
        x: -1.2,
        y: 0.8,
        z: 44
      },
      lookAt: {
        x: 0,
        y: 0.15,
        z: -0.2
      }
    },

    // Tamanho final do objeto depois da normalizacao pela maior dimensao da cena.
    modelTargetSize: 1.6,

    // Posicao do grupo inteiro no mundo 3D.
    // x: esquerda/direita, y: baixo/cima, z: para tras/para frente em relacao a camera.
    position: {
      x: -0.1,
      y: 0.02,
      z: -0.22
    },

    // Rotacao inicial da rede antes da animacao continua.
    initialRotation: {
      x: 0.2,
      y: -0.4,
      z: 0.1
    },

    // Giro continuo por segundo. Use 0 no eixo que quiser parar.
    spinSpeed: {
      x: 0.08,
      y: 0.18
    },

    // Quanto o mouse inclina a cena no eixo Z.
    pointerRotation: {
      z: 0.16,
      smoothing: 0.035
    },

    // Pulso leve ligado ao peso/visibilidade da secao. Use 0 para manter escala fixa.
    weightScaleBoost: 0.1
  },
  {
    breakpointWidth: 721,
    camera: {
      fov: 65,
      near: 0.01,
      far: 20,
      position: {
        x: -1.2,
        y: 0.8,
        z: 44
      },
      lookAt: {
        x: 0,
        y: 0.15,
        z: -0.2
      }
    },
    modelTargetSize: 1.1,
    position: {
      x: -0.1,
      y: 0.02,
      z: -0.22
    },
    initialRotation: {
      x: 0.2,
      y: -0.4,
      z: 0.1
    },
    spinSpeed: {
      x: 0.08,
      y: 0.18
    },
    pointerRotation: {
      z: 0.16,
      smoothing: 0.035
    },
    weightScaleBoost: 0.1
  },
  {
    breakpointWidth: 992,
    camera: {
      fov: 65,
      near: 0.01,
      far: 20,
      position: {
        x: -1.2,
        y: 0.8,
        z: 44
      },
      lookAt: {
        x: 0,
        y: 0.15,
        z: -0.2
      }
    },
    modelTargetSize: 1.1,
    position: {
      x: 0.48,
      y: 0.02,
      z: -0.22
    },
    initialRotation: {
      x: 0.2,
      y: -0.4,
      z: 0.1
    },
    spinSpeed: {
      x: 0.08,
      y: 0.18
    },
    pointerRotation: {
      z: 0.16,
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

  // Layout e camera da cena about.
  // O SceneBackdrop continua dono da camera, mas passa a referencia para cada cena no resize.
  resize({ width, height, camera }) {
    this.lastResizeContext = { width, height, camera }
    this.currentTuning = getAboutNetworkTuning(width)

    if (this.currentBreakpointWidth !== this.currentTuning.breakpointWidth) {
      this.currentBreakpointWidth = this.currentTuning.breakpointWidth
      this.root.rotation.set(
        this.currentTuning.initialRotation.x,
        this.currentTuning.initialRotation.y,
        this.currentTuning.initialRotation.z
      )
    }

    if (camera) {
      camera.fov = this.currentTuning.camera.fov
      camera.near = this.currentTuning.camera.near
      camera.far = this.currentTuning.camera.far
      camera.position.set(
        this.currentTuning.camera.position.x,
        this.currentTuning.camera.position.y,
        this.currentTuning.camera.position.z
      )
      camera.lookAt(
        this.currentTuning.camera.lookAt.x,
        this.currentTuning.camera.lookAt.y,
        this.currentTuning.camera.lookAt.z
      )
      camera.updateProjectionMatrix()
      camera.updateMatrixWorld()
    }

    const largestSide = Math.max(this.objectSize.x, this.objectSize.y, this.objectSize.z, 1)

    this.baseScale = this.currentTuning.modelTargetSize / largestSide
    this.root.position.set(
      this.currentTuning.position.x,
      this.currentTuning.position.y,
      this.currentTuning.position.z
    )
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
