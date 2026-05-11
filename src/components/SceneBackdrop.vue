<template>
  <div ref="stage" class="scene-backdrop" aria-hidden="true"></div>
</template>

<script>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const MODEL_PATH = '/models/gltf/LeePerrySmith/LeePerrySmith.glb'
const MODEL_HEIGHT = 5.8
const SHOCK_DURATION = 0.82
const SHOCK_PATH_COUNT = 42

export default {
  name: 'SceneBackdrop',
  mounted() {
    this.clock = new THREE.Clock()
    this.pointer = new THREE.Vector2()
    this.targetRotation = new THREE.Vector2()
    this.wireframes = []
    this.nextShockAt = this.randomShockDelay()
    this.initScene()
    this.loadBust()
    this.resize()
    window.addEventListener('resize', this.resize)
    window.addEventListener('pointermove', this.handlePointerMove, { passive: true })
    this.animate()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('pointermove', this.handlePointerMove)
    cancelAnimationFrame(this.frameId)
    this.disposeObject(this.bustGroup)
    this.renderer?.dispose()
  },
  methods: {
    initScene() {
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
      this.camera.position.set(0, 0, 8.5)

      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      })
      this.renderer.setClearColor(0x000000, 0)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      this.renderer.outputColorSpace = THREE.SRGBColorSpace
      this.$refs.stage.appendChild(this.renderer.domElement)

      this.bustGroup = new THREE.Group()
      this.bustGroup.position.set(0, -0.04, 0)
      this.scene.add(this.bustGroup)

      const ambient = new THREE.HemisphereLight(0xffffff, 0x1b1111, 1.35)
      const key = new THREE.DirectionalLight(0xffffff, 3.3)
      const rim = new THREE.DirectionalLight(0xe50914, 1.7)

      key.position.set(-2.5, 3.2, 5.4)
      rim.position.set(3.5, 1.2, 2.3)
      this.scene.add(ambient, key, rim)
    },
    loadBust() {
      const loader = new GLTFLoader()

      loader.load(
        MODEL_PATH,
        (gltf) => {
          const model = gltf.scene.clone(true)
          const transparentMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            depthWrite: false
          })
          const wireMaterial = new THREE.LineBasicMaterial({
            color: 0xb8b8b8,
            transparent: true,
            opacity: 0.34
          })
          let hasMesh = false

          model.traverse((child) => {
            if (!child.isMesh) {
              return
            }

            hasMesh = true
            child.geometry = child.geometry.clone()
            child.material = transparentMaterial.clone()
            child.castShadow = false
            child.receiveShadow = false

            const wireGeometry = new THREE.WireframeGeometry(child.geometry)
            const wireframe = new THREE.LineSegments(wireGeometry, wireMaterial.clone())
            wireframe.userData.basePositions = wireGeometry.attributes.position.array.slice()
            wireframe.userData.shockPaths = []
            wireframe.userData.graph = this.buildWireGraph(wireframe.userData.basePositions)
            child.add(wireframe)
            this.wireframes.push(wireframe)
          })

          if (!hasMesh) {
            return
          }

          this.centerModel(model)
          this.bustGroup.add(model)
        },
        undefined,
        () => {
          this.buildFallbackBust()
        }
      )
    },
    centerModel(model) {
      const box = new THREE.Box3().setFromObject(model)
      const center = new THREE.Vector3()
      const size = new THREE.Vector3()

      box.getCenter(center)
      box.getSize(size)
      model.position.sub(center)

      if (size.y > 0) {
        model.scale.setScalar(MODEL_HEIGHT / size.y)
      }
    },
    buildFallbackBust() {
      const geometry = new THREE.SphereGeometry(1.45, 42, 64)
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.7,
        metalness: 0.04,
        wireframe: true,
        transparent: true,
        opacity: 0.58
      })

      const fallback = new THREE.Mesh(geometry, material)
      fallback.scale.set(0.82, 1.2, 0.7)
      this.bustGroup.add(fallback)
    },
    resize() {
      const width = window.innerWidth
      const height = window.innerHeight
      const aspect = width / height
      const narrowScale = aspect < 0.75 ? 0.78 : 1

      this.camera.aspect = aspect
      this.camera.updateProjectionMatrix()
      this.bustGroup.scale.setScalar(narrowScale)
      this.renderer.setSize(width, height, false)
    },
    handlePointerMove(event) {
      this.pointer.x = (event.clientX / window.innerWidth - 0.5) * 2
      this.pointer.y = (event.clientY / window.innerHeight - 0.5) * 2
      this.targetRotation.y = this.pointer.x * 0.34
      this.targetRotation.x = this.pointer.y * 0.22
    },
    animate() {
      const time = this.clock.getElapsedTime()

      this.updateShock(time)
      this.bustGroup.rotation.x += (this.targetRotation.x - this.bustGroup.rotation.x) * 0.055
      this.bustGroup.rotation.y += (this.targetRotation.y - this.bustGroup.rotation.y) * 0.055
      this.bustGroup.rotation.z = Math.sin(time * 0.18) * 0.012
      this.bustGroup.position.y = Math.sin(time * 0.34) * 0.035

      this.renderer.render(this.scene, this.camera)
      this.frameId = requestAnimationFrame(this.animate)
    },
    buildWireGraph(basePositions) {
      const nodes = []
      const byKey = new Map()

      const getNodeIndex = (vertexIndex) => {
        const offset = vertexIndex * 3
        const x = basePositions[offset]
        const y = basePositions[offset + 1]
        const z = basePositions[offset + 2]
        const key = `${x.toFixed(4)}:${y.toFixed(4)}:${z.toFixed(4)}`

        if (!byKey.has(key)) {
          byKey.set(key, nodes.length)
          nodes.push({
            position: new THREE.Vector3(x, y, z),
            direction: new THREE.Vector3(x, y, z).normalize(),
            occurrences: [],
            neighbors: new Set()
          })
        }

        const nodeIndex = byKey.get(key)
        nodes[nodeIndex].occurrences.push(vertexIndex)

        if (nodes[nodeIndex].direction.lengthSq() === 0) {
          nodes[nodeIndex].direction.set(0, 1, 0)
        }

        return nodeIndex
      }

      for (let vertexIndex = 0; vertexIndex < basePositions.length / 3; vertexIndex += 2) {
        const from = getNodeIndex(vertexIndex)
        const to = getNodeIndex(vertexIndex + 1)

        nodes[from].neighbors.add(to)
        nodes[to].neighbors.add(from)
      }

      nodes.forEach((node) => {
        node.neighbors = Array.from(node.neighbors)
      })

      return nodes
    },
    updateShock(time) {
      if (time >= this.nextShockAt) {
        this.startShock(time)
        this.nextShockAt = time + this.randomShockDelay()
      }

      if (!this.shockEndsAt) {
        return
      }

      this.wireframes.forEach((wireframe) => {
        const positionAttribute = wireframe.geometry.attributes.position
        const positions = positionAttribute.array
        const basePositions = wireframe.userData.basePositions
        const graph = wireframe.userData.graph

        positions.set(basePositions)

        wireframe.userData.shockPaths.forEach((path) => {
          path.nodes.forEach((nodeIndex, stepIndex) => {
            const pulseStart = path.startedAt + path.stepStarts[stepIndex]
            const pulseProgress = (time - pulseStart) / path.stepDurations[stepIndex]

            if (pulseProgress <= 0 || pulseProgress >= 1) {
              return
            }

            const node = graph[nodeIndex]
            const jitter = path.jitters[stepIndex]
            const distance = Math.sin(pulseProgress * Math.PI) * path.strengths[stepIndex]
            const direction = node.direction

            node.occurrences.forEach((vertexIndex) => {
              const offset = vertexIndex * 3

              positions[offset] += (direction.x + jitter.x) * distance
              positions[offset + 1] += (direction.y + jitter.y) * distance
              positions[offset + 2] += (direction.z + jitter.z) * distance
            })
          })
        })

        positionAttribute.needsUpdate = true
      })

      if (time >= this.shockEndsAt) {
        this.shockEndsAt = 0
        this.wireframes.forEach((wireframe) => {
          wireframe.geometry.attributes.position.array.set(wireframe.userData.basePositions)
          wireframe.geometry.attributes.position.needsUpdate = true
          wireframe.userData.shockPaths = []
        })
      }
    },
    startShock(time) {
      this.shockEndsAt = time + SHOCK_DURATION + Math.random() * 0.22

      this.wireframes.forEach((wireframe) => {
        const graph = wireframe.userData.graph
        const pathCount = Math.min(SHOCK_PATH_COUNT + Math.floor(Math.random() * 34), graph.length)

        wireframe.userData.shockPaths = Array.from({ length: pathCount }, () => {
          const nodes = this.buildShockPath(graph)
          let cursor = Math.random() * 0.16

          return {
            nodes,
            startedAt: time + Math.random() * 0.24,
            stepStarts: nodes.map(() => {
              cursor += 0.006 + Math.random() * 0.025
              return cursor
            }),
            stepDurations: nodes.map(() => 0.08 + Math.random() * 0.16),
            strengths: nodes.map(() => 0.16 + Math.random() * 0.5),
            jitters: nodes.map(() => new THREE.Vector3(
              (Math.random() - 0.5) * 0.32,
              (Math.random() - 0.5) * 0.32,
              (Math.random() - 0.5) * 0.32
            ))
          }
        })
      })
    },
    randomShockDelay() {
      if (Math.random() < 0.22) {
        return 0.18 + Math.random() * 0.42
      }

      return 0.75 + Math.random() * 2.2
    },
    buildShockPath(graph) {
      const length = 16 + Math.floor(Math.random() * 38)
      const path = [Math.floor(Math.random() * graph.length)]
      let previous = -1

      while (path.length < length) {
        const current = path[path.length - 1]
        const neighbors = graph[current].neighbors.filter((neighbor) => neighbor !== previous)

        if (!neighbors.length) {
          break
        }

        previous = current
        path.push(neighbors[Math.floor(Math.random() * neighbors.length)])

        if (Math.random() < 0.12) {
          path.push(Math.floor(Math.random() * graph.length))
          previous = -1
        }
      }

      return path
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
