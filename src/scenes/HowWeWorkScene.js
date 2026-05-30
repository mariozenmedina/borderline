import * as THREE from 'three'
import { disposeObject, measureObjectSize, setObjectOpacity } from './sceneUtils'

const HOW_WE_WORK_SCENE_TUNING = [
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
        y: 0.45,
        z: -1.44
      }
    },
    modelTargetSize: 1.0,
    position: {
      x: 0.24,
      y: 0.48,
      z: -1.55
    },
    initialRotation: {
      x: 0.18,
      y: -0.34,
      z: -1.70
    },
    pointerRotation: {
      x: 0.12,
      y: 0.2,
      z: 0.06,
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
        x: 0.16,
        y: 0.32,
        z: -1.44
      }
    },
    modelTargetSize: 0.9,
    position: {
      x: 0.18,
      y: 0.45,
      z: -1.55
    },
    initialRotation: {
      x: 0.18,
      y: -0.34,
      z: 0.06
    },
    pointerRotation: {
      x: 0.12,
      y: 0.2,
      z: 0.06,
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
        y: 0.58,
        z: -1.44
      }
    },
    modelTargetSize: 1.7,
    position: {
      x: 0,
      y: 0.32,
      z: -1.55
    },
    initialRotation: {
      x: 0.18,
      y: -0.04,
      z: -0.06
    },
    pointerRotation: {
      x: 0.12,
      y: 0.2,
      z: 0.06,
      smoothing: 0.045
    },
    floatSpeed: 1,
    weightScaleBoost: 0.1
  }
]

function getHowWeWorkSceneTuning(width) {
  return HOW_WE_WORK_SCENE_TUNING
    .filter((tuning) => tuning.breakpointWidth <= width)
    .sort((a, b) => b.breakpointWidth - a.breakpointWidth)[0] || HOW_WE_WORK_SCENE_TUNING[0]
}

export default class HowWeWorkScene {
  constructor() {
    this.root = new THREE.Group()
    this.steps = []
    this.pulses = []
    this.elapsed = 0
    this.baseScale = 1
    this.currentTuning = getHowWeWorkSceneTuning(0)
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

  createLine(points, material) {
    return new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      material
    )
  }

  createObjects() {
    this.materials = {
      glass: this.createMaterial(0xc1d5f9, 0.07),
      glassEdge: this.createLineMaterial(0xf5f5f5, 0.17),
      white: this.createMaterial(0xf5f5f5, 0.16),
      whiteLine: this.createLineMaterial(0xf5f5f5, 0.14),
      accent: this.createMaterial(0xe50914, 0.34),
      accentSoft: this.createMaterial(0xe50914, 0.12),
      accentLine: this.createLineMaterial(0xe50914, 0.4),
      blue: this.createMaterial(0xc1d5f9, 0.24)
    }

    this.process = new THREE.Group()
    this.root.add(this.process)

    this.createProcessRail()
    this.createStepNodes()
    this.createAgencyShell()

    this.root.rotation.copy(this.baseRotation)
  }

  createProcessRail() {
    this.railPath = [
      new THREE.Vector3(-0.88, -0.18, 0.06),
      new THREE.Vector3(-0.36, 0.18, 0.12),
      new THREE.Vector3(0.22, -0.08, 0.1),
      new THREE.Vector3(0.82, 0.18, 0.14)
    ]

    this.process.add(this.createLine(
      this.railPath,
      this.cloneMaterial(this.materials.accentLine, 0.34)
    ))

    this.marker = this.createBox(
      0.09,
      0.09,
      0.09,
      this.cloneMaterial(this.materials.accent, 0.42)
    )
    this.process.add(this.marker)
  }

  createStepNodes() {
    const boxGeometry = new THREE.BoxGeometry(0.28, 0.18, 0.055)
    const nodeGeometry = new THREE.SphereGeometry(0.045, 14, 14)

    this.railPath.forEach((point, index) => {
      const step = new THREE.Group()

      step.position.copy(point)
      step.userData.phase = index * 0.7

      const plate = new THREE.Mesh(
        boxGeometry,
        this.cloneMaterial(index % 2 === 0 ? this.materials.glass : this.materials.accentSoft)
      )
      step.add(plate)

      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(boxGeometry),
        this.cloneMaterial(index % 2 === 0 ? this.materials.glassEdge : this.materials.accentLine, 0.18)
      )
      edge.scale.setScalar(1.012)
      step.add(edge)

      const node = new THREE.Mesh(
        nodeGeometry,
        this.cloneMaterial(index === 0 ? this.materials.accent : this.materials.blue, index === 0 ? 0.38 : 0.26)
      )
      node.position.set(-0.12, 0.1, 0.06)
      step.add(node)
      this.pulses.push(node)

      for (let row = 0; row < 3; row += 1) {
        step.add(this.createBox(
          0.14 - row * 0.025,
          0.012,
          0.02,
          this.cloneMaterial(this.materials.white, 0.12),
          {
            x: 0.04 + row * 0.018,
            y: 0.04 - row * 0.046,
            z: 0.05
          }
        ))
      }

      this.process.add(step)
      this.steps.push(step)
    })
  }

  createAgencyShell() {
    this.agencyShell = new THREE.Group()
    this.agencyShell.position.set(0, 0.02, -0.04)
    this.process.add(this.agencyShell)

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.98, 0.007, 8, 128),
      this.cloneMaterial(this.materials.white, 0.07)
    )
    ring.rotation.set(0.45, 0.22, -0.18)
    this.agencyShell.add(ring)

    const secondRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.66, 0.006, 8, 128),
      this.cloneMaterial(this.materials.accent, 0.09)
    )
    secondRing.rotation.set(-0.2, 0.82, 0.38)
    this.agencyShell.add(secondRing)
  }

  resize(context = {}) {
    const { width = 0 } = context

    this.lastResizeContext = context
    this.currentTuning = getHowWeWorkSceneTuning(width)

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
    return getHowWeWorkSceneTuning(width || 0).camera
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

    this.updateSteps()
    this.updateMarker()
    this.agencyShell.rotation.y += delta * 0.18
    this.process.position.y = Math.sin(this.elapsed * 0.72) * 0.024
    this.root.scale.setScalar(
      this.baseScale * (
        1 - this.currentTuning.weightScaleBoost + weight * this.currentTuning.weightScaleBoost
      )
    )
  }

  updateSteps() {
    this.steps.forEach((step) => {
      step.position.z = this.railPath[this.steps.indexOf(step)].z + Math.sin(this.elapsed * 1.1 + step.userData.phase) * 0.02
      step.rotation.z = Math.sin(this.elapsed * 0.82 + step.userData.phase) * 0.018
    })

    this.pulses.forEach((pulse, index) => {
      pulse.scale.setScalar(1 + Math.sin(this.elapsed * 2.2 + index * 0.65) * 0.18)
    })
  }

  updateMarker() {
    const segmentCount = this.railPath.length - 1
    const rawProgress = (this.elapsed * 0.18) % 1
    const scaledProgress = rawProgress * segmentCount
    const segmentIndex = Math.min(Math.floor(scaledProgress), segmentCount - 1)
    const localProgress = scaledProgress - segmentIndex
    const start = this.railPath[segmentIndex]
    const end = this.railPath[segmentIndex + 1]
    const eased = localProgress < 0.5
      ? localProgress * localProgress * 2
      : 1 - ((1 - localProgress) * (1 - localProgress) * 2)

    this.marker.position.lerpVectors(start, end, eased)
    this.marker.rotation.x += 0.04
    this.marker.rotation.y += 0.045
    this.marker.scale.setScalar(0.78 + Math.sin(rawProgress * Math.PI) * 0.26)
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
