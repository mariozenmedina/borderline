import * as THREE from 'three'
import { disposeObject, measureObjectSize, setObjectOpacity } from './sceneUtils'

// Painel de ajuste manual da cena service 01.
// Mexa nestes valores primeiro para posicionar e calibrar os wireframes 3D.
// Cada objeto vale a partir do seu breakpointWidth.
// A cena escolhe o maior breakpointWidth menor ou igual a largura atual da tela.
const SERVICE_01_SCENE_TUNING = [
  {
    breakpointWidth: 0,
    camera: {
      fov: 30,
      near: 0.01,
      far: 30,
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      lookAt: {
        x: 0.25,
        y: 0.25,
        z: -1.4
      }
    },
    modelTargetSize: 0.4,
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
      x: 0.04,
      y: 0.035
    },
    pointerRotation: {
      x: 0.16,
      y: 0.22,
      z: 0.08,
      smoothing: 0.045
    },
    floatSpeed: 1,
    weightScaleBoost: 0.1
  },
  {
    breakpointWidth: 720,
    camera: {
      fov: 30,
      near: 0.01,
      far: 30,
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      lookAt: {
        x: 0.30,
        y: 0.35,
        z: -1.4
      }
    },
    modelTargetSize: 0.7,
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
      x: 0.04,
      y: 0.035
    },
    pointerRotation: {
      x: 0.16,
      y: 0.22,
      z: 0.08,
      smoothing: 0.045
    },
    floatSpeed: 1,
    weightScaleBoost: 0.1
  },
  {
    breakpointWidth: 1200,
    camera: {
      fov: 30,
      near: 0.01,
      far: 30,
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      lookAt: {
        x: 0.30,
        y: 0.35,
        z: -1.4
      }
    },
    modelTargetSize: 1.0,
    position: {
      x: 0,
      y: 0.35,
      z: -1.5
    },
    initialRotation: {
      x: 0.2,
      y: -0.4,
      z: 0.1
    },
    spinSpeed: {
      x: 0.04,
      y: 0.035
    },
    pointerRotation: {
      x: 0.16,
      y: 0.22,
      z: 0.08,
      smoothing: 0.045
    },
    floatSpeed: 1,
    weightScaleBoost: 0.1
  }
]

function getService01SceneTuning(width) {
  return SERVICE_01_SCENE_TUNING
    .filter((tuning) => tuning.breakpointWidth <= width)
    .sort((a, b) => b.breakpointWidth - a.breakpointWidth)[0] || SERVICE_01_SCENE_TUNING[0]
}

export default class Service01Scene {
  constructor() {
    this.root = new THREE.Group()
    this.baseScale = 1
    this.elapsed = 0
    this.currentTuning = getService01SceneTuning(0)
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
      glass: this.createMaterial(0xc1d5f9, 0.08),
      white: this.createMaterial(0xf5f5f5, 0.14),
      muted: this.createMaterial(0xffffff, 0.07),
      accent: this.createMaterial(0xe50914, 0.34),
      accentSoft: this.createMaterial(0xe50914, 0.12),
      edge: this.createLineMaterial(0xf5f5f5, 0.22),
      guide: this.createLineMaterial(0xe50914, 0.42),
      faintGuide: this.createLineMaterial(0xffffff, 0.12)
    }

    this.desktopFrame = this.createBrowserFrame({
      width: 1.9,
      height: 1.1,
      depth: 0.03,
      contentScale: 1,
      position: {
        x: -0.08,
        y: 0.02,
        z: 0
      }
    })
    this.root.add(this.desktopFrame)

    this.mobileFrame = this.createBrowserFrame({
      width: 0.56,
      height: 1,
      depth: 0.035,
      contentScale: 0.62,
      isMobile: true,
      position: {
        x: 0.86,
        y: -0.09,
        z: 0.18
      },
      rotation: {
        x: -0.04,
        y: -0.3,
        z: 0.04
      }
    })
    this.root.add(this.mobileFrame)

    this.createMeasurementGuides()
    this.createCursor()

    this.root.rotation.copy(this.baseRotation)
  }

  createBrowserFrame({
    width,
    height,
    depth,
    contentScale,
    isMobile = false,
    position,
    rotation = {}
  }) {
    const frame = new THREE.Group()

    frame.position.set(position.x, position.y, position.z)
    frame.rotation.set(rotation.x || 0, rotation.y || 0, rotation.z || 0)

    const shell = this.createBox(width, height, depth, this.materials.glass.clone())
    shell.material.userData.baseOpacity = this.materials.glass.userData.baseOpacity
    frame.add(shell)

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(shell.geometry),
      this.materials.edge.clone()
    )
    edges.material.userData.baseOpacity = this.materials.edge.userData.baseOpacity
    edges.scale.setScalar(1.01)
    frame.add(edges)

    const topBarHeight = isMobile ? height * 0.08 : height * 0.11
    const topBar = this.createBox(
      width * 0.92,
      topBarHeight,
      depth * 1.2,
      this.materials.muted.clone(),
      {
        y: height * 0.5 - topBarHeight * 0.85,
        z: depth * 0.72
      }
    )
    topBar.material.userData.baseOpacity = this.materials.muted.userData.baseOpacity
    frame.add(topBar)

    this.addBrowserControls(frame, width, height, depth, isMobile)
    this.addPageBlocks(frame, width, height, depth, contentScale, isMobile)

    return frame
  }

  addBrowserControls(frame, width, height, depth, isMobile) {
    const dotGeometry = new THREE.SphereGeometry(isMobile ? 0.012 : 0.018, 10, 10)
    const dotY = height * 0.5 - (isMobile ? 0.044 : 0.06)
    const firstX = -width * 0.42

    for (let index = 0; index < 3; index += 1) {
      const dot = new THREE.Mesh(dotGeometry, this.materials.accent.clone())

      dot.material.userData.baseOpacity = index === 0 ? 0.45 : 0.16
      dot.position.set(firstX + index * width * 0.055, dotY, depth * 1.15)
      frame.add(dot)
    }
  }

  addPageBlocks(frame, width, height, depth, contentScale, isMobile) {
    const z = depth * 1.25
    const leftX = isMobile ? 0 : -width * 0.2
    const heroWidth = width * (isMobile ? 0.72 : 0.44) * contentScale
    const heroHeight = height * 0.13 * contentScale
    const heroY = height * 0.22
    const hero = this.createBox(
      heroWidth,
      heroHeight,
      depth * 0.26,
      this.materials.white.clone(),
      {
        x: leftX,
        y: heroY,
        z
      }
    )

    hero.material.userData.baseOpacity = this.materials.white.userData.baseOpacity
    frame.add(hero)

    const headline = this.createBox(
      heroWidth * 0.72,
      height * 0.025 * contentScale,
      depth * 0.32,
      this.materials.accent.clone(),
      {
        x: leftX - heroWidth * 0.08,
        y: heroY + heroHeight * 0.12,
        z: z + depth * 0.15
      }
    )
    headline.material.userData.baseOpacity = 0.38
    frame.add(headline)

    const button = this.createBox(
      heroWidth * 0.22,
      height * 0.035 * contentScale,
      depth * 0.32,
      this.materials.accentSoft.clone(),
      {
        x: leftX - heroWidth * 0.28,
        y: heroY - heroHeight * 0.22,
        z: z + depth * 0.15
      }
    )
    button.material.userData.baseOpacity = this.materials.accentSoft.userData.baseOpacity
    frame.add(button)

    const lineCount = isMobile ? 4 : 5
    for (let index = 0; index < lineCount; index += 1) {
      const lineWidth = heroWidth * (0.86 - index * 0.11)
      const line = this.createBox(
        lineWidth,
        height * 0.012 * contentScale,
        depth * 0.22,
        this.materials.white.clone(),
        {
          x: leftX - (heroWidth - lineWidth) * 0.5,
          y: height * 0.03 - index * height * 0.055 * contentScale,
          z
        }
      )

      line.material.userData.baseOpacity = 0.12
      frame.add(line)
    }

    const cardCount = isMobile ? 3 : 4
    const cardWidth = width * (isMobile ? 0.52 : 0.16)
    const cardGap = width * 0.04
    const startX = isMobile ? 0 : -((cardCount - 1) * (cardWidth + cardGap)) * 0.5

    for (let index = 0; index < cardCount; index += 1) {
      const card = this.createBox(
        cardWidth,
        height * (isMobile ? 0.08 : 0.12),
        depth * 0.24,
        index % 2 === 0 ? this.materials.muted.clone() : this.materials.accentSoft.clone(),
        {
          x: isMobile ? 0 : startX + index * (cardWidth + cardGap),
          y: -height * (isMobile ? 0.24 + index * 0.12 : 0.28),
          z
        }
      )

      card.material.userData.baseOpacity = index % 2 === 0 ? 0.09 : 0.1
      frame.add(card)

      if (isMobile) {
        continue
      }

      const cardEdge = new THREE.LineSegments(
        new THREE.EdgesGeometry(card.geometry),
        this.materials.faintGuide.clone()
      )

      cardEdge.material.userData.baseOpacity = this.materials.faintGuide.userData.baseOpacity
      cardEdge.position.copy(card.position)
      cardEdge.scale.setScalar(1.01)
      frame.add(cardEdge)
    }
  }

  createMeasurementGuides() {
    const guideGroup = new THREE.Group()
    const width = 2.18
    const height = 1.28
    const z = 0.09

    guideGroup.add(this.createLine([
      new THREE.Vector3(-width * 0.5, -height * 0.5, z),
      new THREE.Vector3(width * 0.5, -height * 0.5, z),
      new THREE.Vector3(width * 0.5, height * 0.5, z),
      new THREE.Vector3(-width * 0.5, height * 0.5, z),
      new THREE.Vector3(-width * 0.5, -height * 0.5, z)
    ], this.materials.guide.clone()))

    guideGroup.add(this.createLine([
      new THREE.Vector3(-width * 0.46, height * 0.26, z),
      new THREE.Vector3(width * 0.3, height * 0.26, z)
    ], this.materials.faintGuide.clone()))

    guideGroup.add(this.createLine([
      new THREE.Vector3(-width * 0.46, height * 0.06, z),
      new THREE.Vector3(width * 0.1, height * 0.06, z)
    ], this.materials.faintGuide.clone()))

    guideGroup.children.forEach((child) => {
      child.material.userData.baseOpacity = child.material.opacity
    })

    guideGroup.rotation.z = -0.025
    this.root.add(guideGroup)
    this.guideGroup = guideGroup
  }

  createCursor() {
    const cursorGroup = new THREE.Group()
    const points = [
      new THREE.Vector3(0, 0.07, 0),
      new THREE.Vector3(0.055, -0.055, 0),
      new THREE.Vector3(0.012, -0.038, 0),
      new THREE.Vector3(-0.02, -0.1, 0),
      new THREE.Vector3(-0.045, -0.086, 0),
      new THREE.Vector3(-0.012, -0.03, 0),
      new THREE.Vector3(-0.058, -0.03, 0),
      new THREE.Vector3(0, 0.07, 0)
    ]

    cursorGroup.add(this.createLine(points, this.materials.guide.clone()))
    cursorGroup.children.forEach((child) => {
      child.material.userData.baseOpacity = child.material.opacity
    })
    cursorGroup.position.set(0.36, 0.05, 0.28)
    cursorGroup.rotation.z = -0.25
    this.root.add(cursorGroup)
    this.cursor = cursorGroup
  }

  resize(context = {}) {
    const { width = 0 } = context

    this.lastResizeContext = context
    this.currentTuning = getService01SceneTuning(width)

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
    return getService01SceneTuning(width || 0).camera
  }

  animate({ delta, pointer, weight }) {
    this.elapsed += delta * this.currentTuning.floatSpeed

    const targetRotationX = this.baseRotation.x + (pointer?.y || 0) * this.currentTuning.pointerRotation.x
    const targetRotationY = this.baseRotation.y + (pointer?.x || 0) * this.currentTuning.pointerRotation.y
    const targetRotationZ = this.baseRotation.z + (pointer?.x || 0) * this.currentTuning.pointerRotation.z
    const smoothing = this.currentTuning.pointerRotation.smoothing

    this.root.rotation.x += (targetRotationX - this.root.rotation.x) * smoothing
    this.root.rotation.y += (targetRotationY - this.root.rotation.y) * smoothing
    this.root.rotation.z += (targetRotationZ - this.root.rotation.z) * smoothing

    this.desktopFrame.rotation.y = Math.sin(this.elapsed * 0.72) * 0.035
    this.mobileFrame.rotation.y = -0.3 + Math.sin(this.elapsed * 0.9) * 0.06
    this.mobileFrame.position.y = -0.09 + Math.sin(this.elapsed * 1.2) * 0.025
    this.guideGroup.rotation.z = -0.025 + Math.sin(this.elapsed * 0.85) * 0.018
    this.cursor.position.x = 0.28 + Math.sin(this.elapsed * 1.35) * 0.18
    this.cursor.position.y = 0.04 + Math.cos(this.elapsed * 1.1) * 0.1

    this.root.rotation.x += delta * this.currentTuning.spinSpeed.x * 0.2
    this.root.rotation.y += delta * this.currentTuning.spinSpeed.y * 0.2
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
