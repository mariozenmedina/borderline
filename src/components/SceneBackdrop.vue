<template>
    <div ref="stage" class="scene-backdrop" aria-hidden="true"></div>
</template>

<script>
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { DEFAULT_SCENE, SCENE_REGISTRY } from '../scenes'

const SCENE_FADE_SPEED = 0.075
const CAMERA_TRANSITION_SPEED = 0.075
const OBSERVER_THRESHOLDS = [0, 0.2, 0.4, 0.6, 0.8, 1]

export default {
    name: 'SceneBackdrop',
    emits: ['ready'],
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
        this.notifyDefaultSceneReady()
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
        cancelAnimationFrame(this.scrollFrameId)
        this.scrollTarget?.removeEventListener('scroll', this.handleSceneRootScroll)
        window.removeEventListener('resize', this.resize)
        window.visualViewport?.removeEventListener('resize', this.resize)
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
            this.cameraLookAt = new THREE.Vector3(0, 0.15, -0.2)
            this.cameraTarget = null
            this.cameraTransitionReady = false

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

        notifyDefaultSceneReady() {
            const sceneModule = this.sceneInstances?.[DEFAULT_SCENE]
            const sceneReady = sceneModule?.onReady?.() || sceneModule?.readyPromise || Promise.resolve()

            Promise.resolve(sceneReady)
                .catch((error) => {
                    console.warn('[SceneBackdrop] Cena inicial nao sinalizou prontidao.', error)
                })
                .finally(() => {
                    if (!this.isUnmounted) {
                        this.$emit('ready')
                    }
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

            this.sceneRoot = root
            this.scrollTarget = this.getScrollTarget(root)
            this.sceneSections = sections
            this.sectionVisibility = sections.reduce((visibility, section) => ({
                ...visibility,
                [section.dataset.scene]: 0
            }), {})
            this.updateActiveSceneFromScroll(true)
            this.scrollTarget.addEventListener('scroll', this.handleSceneRootScroll, { passive: true })

            this.sectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        this.sectionVisibility[entry.target.dataset.scene] = entry.intersectionRatio
                    })

                    const nextActiveScene = this.getMostVisibleScene()

                    if (nextActiveScene !== this.activeScene) {
                        this.activeScene = nextActiveScene
                        this.updateTargetCamera()
                    }
                },
                {
                    root: this.scrollTarget === window ? null : root,
                    threshold: OBSERVER_THRESHOLDS
                }
            )

            sections.forEach((section) => this.sectionObserver.observe(section))
        },

        getScrollTarget(root) {
            const style = window.getComputedStyle(root)
            const canScroll = /(auto|scroll)/.test(style.overflowY)
                && root.scrollHeight > root.clientHeight + 1

            return canScroll ? root : window
        },

        getMostVisibleScene() {
            const [sceneId] = Object.entries(this.sectionVisibility)
                .sort((a, b) => b[1] - a[1])[0] || [DEFAULT_SCENE]

            return sceneId
        },

        handleSceneRootScroll() {
            if (this.scrollFrameId) {
                return
            }

            this.scrollFrameId = requestAnimationFrame(() => {
                this.scrollFrameId = null
                this.updateActiveSceneFromScroll()
            })
        },

        updateActiveSceneFromScroll(forceCameraUpdate = false) {
            const root = this.sceneRoot
            const sections = this.sceneSections || []

            if (!root || !sections.length) {
                return
            }

            const rootRect = this.scrollTarget === window ? null : root.getBoundingClientRect()
            const viewportCenter = rootRect
                ? rootRect.top + rootRect.height / 2
                : (window.visualViewport?.height || window.innerHeight) / 2
            const [closestSection] = sections
                .map((section) => {
                    const rect = section.getBoundingClientRect()
                    const sectionCenter = rect.top + rect.height / 2

                    return {
                        sceneId: section.dataset.scene,
                        distance: Math.abs(sectionCenter - viewportCenter)
                    }
                })
                .sort((a, b) => a.distance - b.distance)

            if (!closestSection?.sceneId) {
                return
            }

            if (closestSection.sceneId === this.activeScene) {
                if (forceCameraUpdate) {
                    this.updateTargetCamera({ immediate: !this.cameraTransitionReady })
                }

                return
            }

            this.activeScene = closestSection.sceneId
            this.updateTargetCamera()
        },

        // Resize centralizado: cada cena recebe o novo viewport e ajusta sua propria escala.
        observeViewport() {
            this.resizeObserver = new ResizeObserver(this.resize)
            this.resizeObserver.observe(this.$refs.stage)
            window.addEventListener('resize', this.resize)
            window.visualViewport?.addEventListener('resize', this.resize)
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


            //this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)) //limite DPR
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1))

            this.renderer.setSize(width, height, false)

            const canvas = this.renderer.domElement
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`


            this.lastViewportContext = {
                width,
                height,
                renderer: this.renderer
            }

            Object.values(this.sceneInstances || {}).forEach((sceneModule) => {
                sceneModule.resize?.({
                    width,
                    height,
                    renderer: this.renderer
                })
            })
            this.updateTargetCamera({ immediate: !this.cameraTransitionReady })
        },

        updateTargetCamera({ immediate = false } = {}) {
            const sceneModule = this.sceneInstances?.[this.activeScene]

            if (!sceneModule || !this.lastViewportContext) {
                return
            }

            const cameraConfig = sceneModule.getCameraConfig?.(this.lastViewportContext)

            if (!cameraConfig) {
                return
            }

            this.cameraTarget = this.createCameraState(cameraConfig)

            if (immediate) {
                this.applyCameraState(this.cameraTarget)
                this.cameraTransitionReady = true
            }
        },

        createCameraState(cameraConfig) {
            return {
                fov: cameraConfig.fov,
                near: cameraConfig.near,
                far: cameraConfig.far,
                position: new THREE.Vector3(
                    cameraConfig.position.x,
                    cameraConfig.position.y,
                    cameraConfig.position.z
                ),
                lookAt: new THREE.Vector3(
                    cameraConfig.lookAt.x,
                    cameraConfig.lookAt.y,
                    cameraConfig.lookAt.z
                )
            }
        },

        applyCameraState(cameraState) {
            this.camera.fov = cameraState.fov
            this.camera.near = cameraState.near
            this.camera.far = cameraState.far
            this.camera.position.copy(cameraState.position)
            this.cameraLookAt.copy(cameraState.lookAt)
            this.camera.lookAt(this.cameraLookAt)
            this.camera.updateProjectionMatrix()
            this.camera.updateMatrixWorld()
        },

        updateCameraTransition() {
            if (!this.cameraTarget) {
                return
            }

            this.camera.fov += (this.cameraTarget.fov - this.camera.fov) * CAMERA_TRANSITION_SPEED
            this.camera.near += (this.cameraTarget.near - this.camera.near) * CAMERA_TRANSITION_SPEED
            this.camera.far += (this.cameraTarget.far - this.camera.far) * CAMERA_TRANSITION_SPEED
            this.camera.position.lerp(this.cameraTarget.position, CAMERA_TRANSITION_SPEED)
            this.cameraLookAt.lerp(this.cameraTarget.lookAt, CAMERA_TRANSITION_SPEED)
            this.camera.lookAt(this.cameraLookAt)
            this.camera.updateProjectionMatrix()
            this.camera.updateMatrixWorld()
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
            this.updateCameraTransition()

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
