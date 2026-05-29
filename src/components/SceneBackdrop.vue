<template>
  <div ref="stage" class="scene-backdrop" aria-hidden="true"></div>
</template>

<script>
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { DEFAULT_SCENE, SCENE_REGISTRY } from '../scenes'

const SCENE_FADE_SPEED = 0.075
const OBSERVER_THRESHOLDS = [0, 0.2, 0.4, 0.6, 0.8, 1]

export default {
  name: 'SceneBackdrop',
  props: {
    rootSelector: {
      type: String,
      default: '[data-scene-root]'
    }
  },
  data() {
    return {
      activeScene: DEFAULT_SCENE
    }
  },
  mounted() {
    this.isUnmounted = false
    this.clock = new THREE.Clock()
    this.pointer = new THREE.Vector2()
    this.sceneWeights = {}
    this.sceneInstances = {}
    this.sectionVisibility = {}

    this.initThree()
    this.initSceneRegistry()
    this.resize()
    this.observeViewport()
    this.observeSectionsWhenReady()
    this.animate()
  },
  beforeUnmount() {
    this.isUnmounted = true
    this.sectionObserver?.disconnect()
    this.resizeObserver?.disconnect()
    cancelAnimationFrame(this.frameId)
    cancelAnimationFrame(this.observeFrameId)
    window.removeEventListener('resize', this.resize)
    window.visualViewport?.removeEventListener('resize', this.resize)
    window.visualViewport?.removeEventListener('scroll', this.resize)
    window.removeEventListener('pointermove', this.handlePointerMove)

    Object.values(this.sceneInstances).forEach((sceneModule) => sceneModule.dispose?.())
    this.environmentTexture?.dispose()
    this.pmremGenerator?.dispose()
    this.renderer?.dispose()
  },
  methods: {
    // Motor compartilhado: camera, renderer e ambiente servem todas as cenas.
    initThree() {
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(45, 1, 1, 20)
      this.camera.position.set(-1.8, 0.8, 3)
      this.camera.lookAt(0, 0.15, -0.2)

      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      })
      this.renderer.setClearColor(0x000000, 0)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      this.renderer.outputColorSpace = THREE.SRGBColorSpace
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping
      this.$refs.stage.appendChild(this.renderer.domElement)

      this.pmremGenerator = new THREE.PMREMGenerator(this.renderer)
      this.environmentTexture = this.pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture
      this.scene.environment = this.environmentTexture
    },

    // Registro das cenas: para adicionar uma nova, crie o arquivo e registre em src/scenes/index.js.
    initSceneRegistry() {
      Object.entries(SCENE_REGISTRY).forEach(([sceneId, SceneModule]) => {
        const sceneModule = new SceneModule({
          camera: this.camera,
          renderer: this.renderer
        })

        sceneModule.mount(this.scene)
        this.sceneInstances[sceneId] = sceneModule
        this.sceneWeights[sceneId] = sceneId === this.activeScene ? 1 : 0
        sceneModule.setOpacity?.(this.sceneWeights[sceneId])
      })
    },

    // Observer do scroll: decide qual data-scene esta mais visivel.
    observeSectionsWhenReady() {
      this.observeFrameId = requestAnimationFrame(() => {
        if (!this.isUnmounted) {
          this.observeSections()
        }
      })
    },

    observeSections() {
      const root = document.querySelector(this.rootSelector)

      if (!root) {
        this.observeSectionsWhenReady()
        return
      }

      const sections = Array.from(root.querySelectorAll('[data-scene]'))

      if (!sections.length) {
        return
      }

      this.sectionVisibility = sections.reduce((visibility, section) => ({
        ...visibility,
        [section.dataset.scene]: 0
      }), {})
      this.activeScene = sections[0].dataset.scene || DEFAULT_SCENE

      this.sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.sectionVisibility[entry.target.dataset.scene] = entry.intersectionRatio
          })

          this.activeScene = this.getMostVisibleScene()
        },
        {
          root,
          threshold: OBSERVER_THRESHOLDS
        }
      )

      sections.forEach((section) => this.sectionObserver.observe(section))
    },

    getMostVisibleScene() {
      const [sceneId] = Object.entries(this.sectionVisibility)
        .sort((a, b) => b[1] - a[1])[0] || [DEFAULT_SCENE]

      return sceneId
    },

    // Resize centralizado: cada cena recebe o novo viewport e ajusta sua propria escala.
    observeViewport() {
      this.resizeObserver = new ResizeObserver(this.resize)
      this.resizeObserver.observe(this.$refs.stage)
      window.addEventListener('resize', this.resize)
      window.visualViewport?.addEventListener('resize', this.resize)
      window.visualViewport?.addEventListener('scroll', this.resize)
      window.addEventListener('pointermove', this.handlePointerMove, { passive: true })
    },

    resize() {
      const { width, height } = this.getStageSize()

      if (!width || !height) {
        return
      }

      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
      this.camera.updateMatrixWorld()
      this.renderer.setSize(width, height, false)

      Object.values(this.sceneInstances || {}).forEach((sceneModule) => {
        sceneModule.resize?.({
          width,
          height,
          camera: this.camera,
          renderer: this.renderer
        })
      })
    },

    getStageSize() {
      const rect = this.$refs.stage?.getBoundingClientRect()
      const width = rect?.width || window.visualViewport?.width || window.innerWidth
      const height = rect?.height || window.visualViewport?.height || window.innerHeight

      return { width, height }
    },

    handlePointerMove(event) {
      const { width, height } = this.getStageSize()

      if (!width || !height) {
        return
      }

      this.pointer.x = (event.clientX / width - 0.5) * 2
      this.pointer.y = (event.clientY / height - 0.5) * 2
    },

    // Loop unico: o backdrop so calcula pesos/transicoes e delega animacao.
    animate() {
      const delta = this.clock.getDelta()

      this.updateSceneTransitions()

      Object.entries(this.sceneInstances).forEach(([sceneId, sceneModule]) => {
        sceneModule.animate?.({
          delta,
          pointer: this.pointer,
          weight: this.sceneWeights[sceneId] || 0,
          active: sceneId === this.activeScene
        })
      })

      this.renderer.render(this.scene, this.camera)
      this.frameId = requestAnimationFrame(this.animate)
    },

    updateSceneTransitions() {
      Object.entries(this.sceneInstances).forEach(([sceneId, sceneModule]) => {
        const targetWeight = sceneId === this.activeScene ? 1 : 0
        const currentWeight = this.sceneWeights[sceneId] || 0
        const nextWeight = currentWeight + (targetWeight - currentWeight) * SCENE_FADE_SPEED

        this.sceneWeights[sceneId] = nextWeight
        sceneModule.setOpacity?.(nextWeight)
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
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
