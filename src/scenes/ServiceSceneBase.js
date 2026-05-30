import * as THREE from 'three'
import { disposeObject, measureObjectSize, setObjectOpacity } from './sceneUtils'

const BASE_CAMERA = {
  fov: 10,
  near: 0.01,
  far: 30,
  position: {
    x: 0,
    y: 0,
    z: 0
  }
}

function createServiceSceneTuning({ side = 'right', accentColor = 0xe50914 } = {}) {
  const desktopX = side === 'left' ? -0.3 : 0.3
  const desktopLookAtX = side === 'left' ? -0.2 : 0.2

  return [
    {
      breakpointWidth: 0,
      accentColor,
      camera: {
        ...BASE_CAMERA,
        lookAt: {
          x: 0.2,
          y: 0.41,
          z: -1.5
        }
      },
      modelTargetSize: 0.35,
      position: {
        x: 0.25,
        y: 0.5,
        z: -1.5
      },
      initialRotation: {
        x: 0.2,
        y: -0.4,
        z: 0.1
      },
      spinSpeed: {
        x: 0.12,
        y: 0.16
      },
      pointerRotation: {
        z: 0.56,
        smoothing: 0.035
      },
      weightScaleBoost: 0.1
    },
    {
      breakpointWidth: 720,
      accentColor,
      camera: {
        ...BASE_CAMERA,
        lookAt: {
          x: 0.2,
          y: 0.4,
          z: -1.5
        }
      },
      modelTargetSize: 0.35,
      position: {
        x: 0.25,
        y: 0.5,
        z: -1.5
      },
      initialRotation: {
        x: 0.2,
        y: -0.4,
        z: 0.1
      },
      spinSpeed: {
        x: 0.12,
        y: 0.16
      },
      pointerRotation: {
        z: 0.56,
        smoothing: 0.035
      },
      weightScaleBoost: 0.1
    },
    {
      breakpointWidth: 1200,
      accentColor,
      camera: {
        ...BASE_CAMERA,
        lookAt: {
          x: desktopLookAtX,
          y: 0.5,
          z: -1.5
        }
      },
      modelTargetSize: 0.35,
      position: {
        x: desktopX,
        y: 0.5,
        z: -1.5
      },
      initialRotation: {
        x: 0.2,
        y: -0.4,
        z: 0.1
      },
      spinSpeed: {
        x: 0.12,
        y: 0.16
      },
      pointerRotation: {
        z: 0.56,
        smoothing: 0.035
      },
      weightScaleBoost: 0.1
    }
  ]
}

function getServiceSceneTuning(tunings, width) {
  return tunings
    .filter((tuning) => tuning.breakpointWidth <= width)
    .sort((a, b) => b.breakpointWidth - a.breakpointWidth)[0] || tunings[0]
}

export default class ServiceSceneBase {
  constructor(options = {}) {
    this.tunings = createServiceSceneTuning(options)
    this.root = new THREE.Group()
    this.baseScale = 1
    this.currentTuning = getServiceSceneTuning(this.tunings, 0)
    this.currentBreakpointWidth = null

    this.createObjects()
    this.objectSize = measureObjectSize(this.root)
    this.setOpacity(0)
  }

  mount(worldScene) {
    worldScene.add(this.root)
  }

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

  createObjects() {
    const cubeMaterial = this.createMaterial(this.currentTuning.accentColor, 0.44)
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xf5f5f5,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      depthTest: false
    })
    edgeMaterial.userData.baseOpacity = edgeMaterial.opacity

    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      cubeMaterial
    )
    this.root.add(this.cube)

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(this.cube.geometry),
      edgeMaterial
    )
    edges.scale.setScalar(1.012)
    this.root.add(edges)

    this.root.rotation.set(
      this.currentTuning.initialRotation.x,
      this.currentTuning.initialRotation.y,
      this.currentTuning.initialRotation.z
    )
  }

  resize(context = {}) {
    const { width = 0 } = context

    this.lastResizeContext = context
    this.currentTuning = getServiceSceneTuning(this.tunings, width)

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
    return getServiceSceneTuning(this.tunings, width || 0).camera
  }

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
