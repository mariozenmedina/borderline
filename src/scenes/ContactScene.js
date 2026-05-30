import * as THREE from 'three'
import { disposeObject, measureObjectSize, setObjectOpacity } from './sceneUtils'

const CONTACT_SCENE_TUNING = [
  {
    breakpointWidth: 0,
    camera: {
      fov: 28,
      near: 0.01,
      far: 30,
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      lookAt: {
        x: 0.2,
        y: 0.48,
        z: -1.44
      }
    },
    modelTargetSize: 0.9,
    position: {
      x: 0.24,
      y: 0.48,
      z: -1.55
    },
    initialRotation: {
      x: 0.18,
      y: -0.38,
      z: -0.08
    },
    pointerRotation: {
      x: 0.1,
      y: 0.18,
      z: 0.05,
      smoothing: 0.045
    },
    floatSpeed: 1,
    weightScaleBoost: 0.1
  },
  {
    breakpointWidth: 720,
    camera: {
      fov: 28,
      near: 0.01,
      far: 30,
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      lookAt: {
        x: 0.12,
        y: 0.4,
        z: -1.44
      }
    },
    modelTargetSize: 0.94,
    position: {
      x: 0.14,
      y: 0.44,
      z: -1.55
    },
    initialRotation: {
      x: 0.16,
      y: -0.28,
      z: -0.04
    },
    pointerRotation: {
      x: 0.1,
      y: 0.18,
      z: 0.05,
      smoothing: 0.045
    },
    floatSpeed: 1,
    weightScaleBoost: 0.1
  },
  {
    breakpointWidth: 1200,
    camera: {
      fov: 28,
      near: 0.01,
      far: 30,
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      lookAt: {
        x: 0,
        y: 0.54,
        z: -1.44
      }
    },
    modelTargetSize: 1.52,
    position: {
      x: 0,
      y: 0.3,
      z: -1.55
    },
    initialRotation: {
      x: 0.16,
      y: -0.08,
      z: -0.03
    },
    pointerRotation: {
      x: 0.1,
      y: 0.18,
      z: 0.05,
      smoothing: 0.045
    },
    floatSpeed: 1,
    weightScaleBoost: 0.1
  }
]

function getContactSceneTuning(width) {
  return CONTACT_SCENE_TUNING
    .filter((tuning) => tuning.breakpointWidth <= width)
    .sort((a, b) => b.breakpointWidth - a.breakpointWidth)[0] || CONTACT_SCENE_TUNING[0]
}

export default class ContactScene {
  constructor() {
    this.root = new THREE.Group()
    this.nodes = []
    this.pulses = []
    this.elapsed = 0
    this.baseScale = 1
    this.currentTuning = getContactSceneTuning(0)
    this.currentBreakpointWidth = null
    this.baseRotation = new THREE.Euler(
      this.currentTuning.initialRotation.x,
      this.currentTuning.initialRotation.y,
      this.currentTuning.initialRotation.z
    )

    this.createObjects()
    this.objectSize = measureObjectSize(this.root)
    this.setOpacity(0)
  }

  mount(worldScene) {
    worldScene.add(this.root)
  }

  createMaterial(color, opacity, wireframe = false) {
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

  createLineMaterial(color, opacity) {
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      depthTest: false
    })

    material.userData.baseOpacity = opacity
    return material
  }

  cloneMaterial(material, opacity = material.userData.baseOpacity) {
    const clone = material.clone()

    clone.opacity = opacity
    clone.userData.baseOpacity = opacity
    return clone
  }

  createBox(width, height, depth, material, position = {}) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      material
    )

    mesh.position.set(position.x || 0, position.y || 0, position.z || 0)
    return mesh
  }

  createCircle(radius, material, position = {}) {
    const mesh = new THREE.Mesh(
      new THREE.CircleGeometry(radius, 32),
      material
    )

    mesh.position.set(position.x || 0, position.y || 0, position.z || 0)
    return mesh
  }

  createLine(points, material) {
    return new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      material
    )
  }

  createObjects() {
    this.materials = {
      card: this.createMaterial(0xf5f5f5, 0.08),
      cardEdge: this.createLineMaterial(0xf5f5f5, 0.18),
      white: this.createMaterial(0xf5f5f5, 0.18),
      whiteSoft: this.createMaterial(0xf5f5f5, 0.1),
      accent: this.createMaterial(0xe50914, 0.42),
      accentSoft: this.createMaterial(0xe50914, 0.13),
      accentLine: this.createLineMaterial(0xe50914, 0.36),
      networkLine: this.createLineMaterial(0xf5f5f5, 0.16),
      blueHint: this.createMaterial(0xc1d5f9, 0.2)
    }

    this.network = new THREE.Group()
    this.root.add(this.network)

    this.createTrustRings()
    this.createProfileCard()
    this.createPartnerNodes()
    this.root.rotation.copy(this.baseRotation)
  }

  createProfileCard() {
    this.profileCard = new THREE.Group()
    this.network.add(this.profileCard)

    const cardGeometry = new THREE.BoxGeometry(1.06, 0.66, 0.035)
    const card = new THREE.Mesh(cardGeometry, this.cloneMaterial(this.materials.card))
    this.profileCard.add(card)

    const cardEdge = new THREE.LineSegments(
      new THREE.EdgesGeometry(cardGeometry),
      this.cloneMaterial(this.materials.cardEdge)
    )
    cardEdge.scale.setScalar(1.012)
    this.profileCard.add(cardEdge)

    this.profileCard.add(this.createCircle(
      0.085,
      this.cloneMaterial(this.materials.blueHint, 0.23),
      {
        x: -0.34,
        y: 0.14,
        z: 0.03
      }
    ))

    for (let row = 0; row < 3; row += 1) {
      this.profileCard.add(this.createBox(
        0.24 - row * 0.04,
        0.014,
        0.018,
        this.cloneMaterial(row === 0 ? this.materials.white : this.materials.whiteSoft, row === 0 ? 0.2 : 0.12),
        {
          x: -0.08 + row * 0.012,
          y: 0.18 - row * 0.07,
          z: 0.04
        }
      ))
    }

    this.profileCard.add(this.createBox(
      0.64,
      0.012,
      0.018,
      this.cloneMaterial(this.materials.accent, 0.28),
      {
        x: -0.02,
        y: -0.1,
        z: 0.04
      }
    ))

    this.createInBadge()
  }

  createInBadge() {
    this.inBadge = new THREE.Group()
    this.inBadge.position.set(0.36, 0.16, 0.045)
    this.profileCard.add(this.inBadge)

    const badgeGeometry = new THREE.BoxGeometry(0.22, 0.22, 0.026)
    const badge = new THREE.Mesh(
      badgeGeometry,
      this.cloneMaterial(this.materials.accent, 0.36)
    )
    this.inBadge.add(badge)

    const badgeEdge = new THREE.LineSegments(
      new THREE.EdgesGeometry(badgeGeometry),
      this.cloneMaterial(this.materials.cardEdge, 0.2)
    )
    badgeEdge.scale.setScalar(1.012)
    this.inBadge.add(badgeEdge)

    this.inBadge.add(this.createCircle(
      0.018,
      this.cloneMaterial(this.materials.white, 0.26),
      {
        x: -0.062,
        y: 0.054,
        z: 0.022
      }
    ))
    this.inBadge.add(this.createBox(
      0.032,
      0.09,
      0.012,
      this.cloneMaterial(this.materials.white, 0.25),
      {
        x: -0.062,
        y: -0.028,
        z: 0.024
      }
    ))
    this.inBadge.add(this.createBox(
      0.032,
      0.122,
      0.012,
      this.cloneMaterial(this.materials.white, 0.25),
      {
        x: 0.006,
        y: -0.012,
        z: 0.024
      }
    ))
    this.inBadge.add(this.createBox(
      0.074,
      0.032,
      0.012,
      this.cloneMaterial(this.materials.white, 0.22),
      {
        x: 0.043,
        y: 0.033,
        z: 0.024
      }
    ))
    this.inBadge.add(this.createBox(
      0.032,
      0.09,
      0.012,
      this.cloneMaterial(this.materials.white, 0.22),
      {
        x: 0.08,
        y: -0.028,
        z: 0.024
      }
    ))
  }

  createPartnerNodes() {
    const nodePositions = [
      new THREE.Vector3(-0.84, 0.2, -0.02),
      new THREE.Vector3(-0.7, -0.34, 0.04),
      new THREE.Vector3(0.74, -0.28, 0.06),
      new THREE.Vector3(0.86, 0.28, -0.02)
    ]
    const center = new THREE.Vector3(0, 0, 0.02)

    nodePositions.forEach((position, index) => {
      const node = new THREE.Group()

      node.position.copy(position)
      node.userData.phase = index * 0.72

      const shellGeometry = new THREE.BoxGeometry(0.22, 0.13, 0.026)
      const shell = new THREE.Mesh(
        shellGeometry,
        this.cloneMaterial(index % 2 === 0 ? this.materials.accentSoft : this.materials.card)
      )
      node.add(shell)

      const shellEdge = new THREE.LineSegments(
        new THREE.EdgesGeometry(shellGeometry),
        this.cloneMaterial(index % 2 === 0 ? this.materials.accentLine : this.materials.cardEdge, 0.18)
      )
      shellEdge.scale.setScalar(1.012)
      node.add(shellEdge)

      node.add(this.createBox(
        0.1,
        0.012,
        0.014,
        this.cloneMaterial(this.materials.white, 0.12),
        {
          x: 0.02,
          y: 0.018,
          z: 0.024
        }
      ))
      node.add(this.createBox(
        0.062,
        0.012,
        0.014,
        this.cloneMaterial(this.materials.white, 0.1),
        {
          x: -0.002,
          y: -0.03,
          z: 0.024
        }
      ))

      this.network.add(this.createLine(
        [
          center,
          new THREE.Vector3(position.x, position.y, position.z)
        ],
        this.cloneMaterial(index % 2 === 0 ? this.materials.accentLine : this.materials.networkLine)
      ))

      this.network.add(node)
      this.nodes.push(node)
      this.pulses.push(shell)
    })
  }

  createTrustRings() {
    this.rings = new THREE.Group()
    this.rings.position.set(0, 0.02, -0.08)
    this.network.add(this.rings)

    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.006, 8, 128),
      this.cloneMaterial(this.materials.whiteSoft, 0.08)
    )
    outerRing.rotation.set(0.5, 0.18, -0.28)
    this.rings.add(outerRing)

    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.62, 0.006, 8, 128),
      this.cloneMaterial(this.materials.accent, 0.1)
    )
    innerRing.rotation.set(-0.16, 0.86, 0.36)
    this.rings.add(innerRing)
  }

  resize(context = {}) {
    const { width = 0 } = context

    this.lastResizeContext = context
    this.currentTuning = getContactSceneTuning(width)

    if (this.currentBreakpointWidth !== this.currentTuning.breakpointWidth) {
      this.currentBreakpointWidth = this.currentTuning.breakpointWidth
      this.baseRotation.set(
        this.currentTuning.initialRotation.x,
        this.currentTuning.initialRotation.y,
        this.currentTuning.initialRotation.z
      )
      this.root.rotation.copy(this.baseRotation)
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
    return getContactSceneTuning(width || 0).camera
  }

  animate({ delta, pointer, weight }) {
    this.elapsed += delta * this.currentTuning.floatSpeed

    const smoothing = this.currentTuning.pointerRotation.smoothing
    const targetRotationX = this.baseRotation.x + (pointer?.y || 0) * this.currentTuning.pointerRotation.x
    const targetRotationY = this.baseRotation.y + (pointer?.x || 0) * this.currentTuning.pointerRotation.y
    const targetRotationZ = this.baseRotation.z + (pointer?.x || 0) * this.currentTuning.pointerRotation.z

    this.root.rotation.x += (targetRotationX - this.root.rotation.x) * smoothing
    this.root.rotation.y += (targetRotationY - this.root.rotation.y) * smoothing
    this.root.rotation.z += (targetRotationZ - this.root.rotation.z) * smoothing

    this.profileCard.position.y = Math.sin(this.elapsed * 0.78) * 0.022
    this.inBadge.rotation.z = Math.sin(this.elapsed * 1.2) * 0.04
    this.rings.rotation.y += delta * 0.2
    this.rings.rotation.z -= delta * 0.07

    this.nodes.forEach((node, index) => {
      node.position.z = Math.sin(this.elapsed * 1.05 + node.userData.phase) * 0.035
      node.rotation.z = Math.sin(this.elapsed * 0.8 + node.userData.phase) * 0.02
      this.pulses[index].scale.setScalar(1 + Math.sin(this.elapsed * 2 + index * 0.74) * 0.08)
    })

    this.network.position.y = Math.sin(this.elapsed * 0.62) * 0.018
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
