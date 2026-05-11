<template>
  <div ref="stage" class="scene-backdrop" aria-hidden="true"></div>
</template>

<script>
import * as THREE from 'three'

const MASK_POINTS = [
  [0, 3.35, 0.05],
  [-1.35, 3.08, -0.05],
  [1.35, 3.08, -0.05],
  [-2.1, 2.45, 0],
  [2.1, 2.45, 0],
  [-2.45, 1.45, 0.08],
  [2.45, 1.45, 0.08],
  [-2.3, 0.2, 0.12],
  [2.3, 0.2, 0.12],
  [-2.05, -1.25, 0.02],
  [2.05, -1.25, 0.02],
  [-1.35, -2.55, -0.06],
  [1.35, -2.55, -0.06],
  [0, -3.15, 0.1],
  [0, 1.55, 0.4],
  [0, 0.2, 0.75],
  [0, -0.85, 0.55],
  [0, -1.75, 0.2],
  [-1.15, 1.25, 0.35],
  [-1.82, 0.82, 0.22],
  [-0.62, 0.72, 0.48],
  [1.15, 1.25, 0.35],
  [1.82, 0.82, 0.22],
  [0.62, 0.72, 0.48],
  [-1.22, -1.34, 0.28],
  [-0.38, -1.22, 0.42],
  [0.42, -1.15, 0.42],
  [1.34, -0.92, 0.25],
  [-1.55, -0.2, 0.28],
  [-0.66, -0.28, 0.52],
  [0.7, -0.24, 0.52],
  [1.5, -0.05, 0.28],
  [-0.42, -2.25, 0.02],
  [0.48, -2.2, 0.02],
  [-1.75, 1.92, 0.08],
  [-0.55, 2.35, 0.08],
  [0.58, 2.25, 0.08],
  [1.76, 1.9, 0.08],
  [-1.86, -2.02, -0.04],
  [1.78, -1.88, -0.04]
]

const MASK_EDGES = [
  [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 8],
  [7, 9], [8, 10], [9, 11], [10, 12], [11, 13], [12, 13],
  [0, 14], [14, 15], [15, 16], [16, 17], [17, 13],
  [1, 34], [34, 3], [34, 35], [35, 14], [35, 18], [18, 34],
  [2, 37], [37, 4], [37, 36], [36, 14], [36, 21], [21, 37],
  [3, 18], [18, 20], [20, 14], [18, 19], [19, 5], [19, 28],
  [4, 21], [21, 23], [23, 14], [21, 22], [22, 6], [22, 31],
  [5, 28], [28, 7], [7, 29], [29, 15], [15, 30], [30, 8], [31, 8],
  [18, 28], [28, 20], [20, 29], [29, 15], [15, 23], [23, 31], [31, 21],
  [20, 15], [23, 15], [14, 20], [14, 23],
  [7, 24], [24, 25], [25, 16], [16, 26], [26, 27], [27, 8],
  [24, 38], [38, 9], [27, 39], [39, 10], [24, 16], [16, 27],
  [9, 32], [32, 17], [17, 33], [33, 10], [32, 13], [33, 13],
  [11, 38], [38, 32], [12, 39], [39, 33],
  [28, 24], [29, 25], [30, 26], [31, 27],
  [15, 24], [15, 27], [16, 32], [16, 33]
]

const EYE_POINTS = [
  [-1.74, 0.86, 0.34],
  [-1.34, 0.66, 0.42],
  [-0.82, 0.6, 0.52],
  [-0.55, 0.74, 0.55],
  [0.55, 0.74, 0.55],
  [0.9, 0.62, 0.52],
  [1.42, 0.66, 0.42],
  [1.78, 0.86, 0.34]
]

export default {
  name: 'SceneBackdrop',
  mounted() {
    this.clock = new THREE.Clock()
    this.pointer = new THREE.Vector2()
    this.targetRotation = new THREE.Vector2()
    this.initScene()
    this.buildMask()
    this.resize()
    window.addEventListener('resize', this.resize)
    window.addEventListener('pointermove', this.handlePointerMove, { passive: true })
    this.animate()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('pointermove', this.handlePointerMove)
    cancelAnimationFrame(this.frameId)
    this.renderer?.dispose()
    this.maskLineGeometry?.dispose()
    this.maskPointGeometry?.dispose()
    this.eyeGeometry?.dispose()
  },
  methods: {
    initScene() {
      this.scene = new THREE.Scene()
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
      this.camera.position.set(0, 0, 10)

      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      })
      this.renderer.setClearColor(0x000000, 0)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      this.$refs.stage.appendChild(this.renderer.domElement)
    },
    buildMask() {
      this.maskGroup = new THREE.Group()
      this.scene.add(this.maskGroup)

      this.basePositions = MASK_POINTS.map(([x, y, z], index) => ({
        x,
        y,
        z,
        phase: index * 0.73,
        drift: 0.018 + (index % 5) * 0.006
      }))

      this.linePositions = new Float32Array(MASK_EDGES.length * 2 * 3)
      this.pointPositions = new Float32Array(MASK_POINTS.length * 3)
      this.eyePositions = new Float32Array(EYE_POINTS.length * 3)

      this.maskLineGeometry = new THREE.BufferGeometry()
      this.maskLineGeometry.setAttribute('position', new THREE.BufferAttribute(this.linePositions, 3))

      this.maskPointGeometry = new THREE.BufferGeometry()
      this.maskPointGeometry.setAttribute('position', new THREE.BufferAttribute(this.pointPositions, 3))

      this.eyeGeometry = new THREE.BufferGeometry()
      this.eyeGeometry.setAttribute('position', new THREE.BufferAttribute(this.eyePositions, 3))

      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xf4f4f4,
        transparent: true,
        opacity: 0.86,
        blending: THREE.AdditiveBlending
      })
      const pointMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.035,
        transparent: true,
        opacity: 0.82,
        sizeAttenuation: true
      })
      const eyeMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.08,
        transparent: true,
        opacity: 0.96,
        sizeAttenuation: true
      })

      this.maskLines = new THREE.LineSegments(this.maskLineGeometry, lineMaterial)
      this.maskPoints = new THREE.Points(this.maskPointGeometry, pointMaterial)
      this.eyeHighlights = new THREE.Points(this.eyeGeometry, eyeMaterial)
      this.maskGroup.add(this.maskLines, this.maskPoints, this.eyeHighlights)
    },
    resize() {
      const width = window.innerWidth
      const height = window.innerHeight
      const aspect = width / height
      const frustumHeight = 8
      const frustumWidth = frustumHeight * aspect

      this.camera.left = frustumWidth / -2
      this.camera.right = frustumWidth / 2
      this.camera.top = frustumHeight / 2
      this.camera.bottom = frustumHeight / -2
      this.camera.updateProjectionMatrix()

      const maskWidth = 4.9
      const maskHeight = 6.5
      const containScale = Math.min((frustumWidth * 0.9) / maskWidth, (frustumHeight * 0.9) / maskHeight)
      this.maskGroup.scale.setScalar(containScale)

      this.renderer.setSize(width, height, false)
    },
    handlePointerMove(event) {
      this.pointer.x = (event.clientX / window.innerWidth - 0.5) * 2
      this.pointer.y = (event.clientY / window.innerHeight - 0.5) * 2
      this.targetRotation.y = this.pointer.x * 0.08
      this.targetRotation.x = this.pointer.y * -0.06
    },
    writeAnimatedPositions(time) {
      const animated = this.basePositions.map((point, index) => {
        const pulse = Math.sin(time * 0.92 + point.phase)
        const secondary = Math.cos(time * 0.47 + point.phase * 1.7)
        const breath = Math.sin(time * 0.32) * 0.012

        return {
          x: point.x + pulse * point.drift + secondary * point.drift * 0.45,
          y: point.y + secondary * point.drift + breath,
          z: point.z + pulse * point.drift * 2.2,
          index
        }
      })

      animated.forEach((point, index) => {
        const offset = index * 3
        this.pointPositions[offset] = point.x
        this.pointPositions[offset + 1] = point.y
        this.pointPositions[offset + 2] = point.z
      })

      MASK_EDGES.forEach(([from, to], edgeIndex) => {
        const offset = edgeIndex * 6
        const start = animated[from]
        const end = animated[to]
        this.linePositions[offset] = start.x
        this.linePositions[offset + 1] = start.y
        this.linePositions[offset + 2] = start.z
        this.linePositions[offset + 3] = end.x
        this.linePositions[offset + 4] = end.y
        this.linePositions[offset + 5] = end.z
      })

      EYE_POINTS.forEach(([x, y, z], index) => {
        const offset = index * 3
        this.eyePositions[offset] = x
        this.eyePositions[offset + 1] = y + Math.sin(time * 0.72 + index) * 0.01
        this.eyePositions[offset + 2] = z + 0.04
      })

      this.maskPointGeometry.attributes.position.needsUpdate = true
      this.maskLineGeometry.attributes.position.needsUpdate = true
      this.eyeGeometry.attributes.position.needsUpdate = true
    },
    animate() {
      const time = this.clock.getElapsedTime()
      this.writeAnimatedPositions(time)

      this.maskGroup.rotation.x += (this.targetRotation.x - this.maskGroup.rotation.x) * 0.035
      this.maskGroup.rotation.y += (this.targetRotation.y - this.maskGroup.rotation.y) * 0.035
      this.maskGroup.rotation.z = Math.sin(time * 0.23) * 0.018
      this.maskGroup.position.y = Math.sin(time * 0.38) * 0.08

      this.renderer.render(this.scene, this.camera)
      this.frameId = requestAnimationFrame(this.animate)
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
