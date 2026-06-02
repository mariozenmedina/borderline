import * as THREE from 'three'
import { disposeObject, measureObjectSize, setObjectOpacity } from './sceneUtils'

// Painel de ajuste manual da cena service 02.
// Mexa nestes valores primeiro para posicionar e calibrar o painel interativo 3D.
// Cada objeto vale a partir do seu breakpointWidth.
// A cena escolhe o maior breakpointWidth menor ou igual a largura atual da tela.
const SERVICE_02_SCENE_TUNING = [
    {
        breakpointWidth: 0,
        
        camera: {
            fov: 38,
            near: 0.1,
            far: 8,
            position: {
                x: 0,
                y: -2,
                z: 10
            },
            lookAt: {
                x: 0,
                y: -3.7,
                z: 0
            }
        },
        modelTargetSize: 0.8,
        position: {
            x: 0,
            y: -2,
            z: 8
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
        floatSpeed: 1
    },
    {
        breakpointWidth: 720,
        
        camera: {
            fov: 38,
            near: 0.1,
            far: 8,
            position: {
                x: 0,
                y: -2,
                z: 10
            },
            lookAt: {
                x: 0,
                y: -3.7,
                z: 0
            }
        },
        modelTargetSize: 1,
        position: {
            x: 0,
            y: -2,
            z: 8
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
        floatSpeed: 1
    },
    {
        breakpointWidth: 1200,
        
        camera: {
            fov: 38,
            near: 0.1,
            far: 8,
            position: {
                x: 0,
                y: -2,
                z: 10
            },
            lookAt: {
                x: 0,
                y: -3.7,
                z: 0
            }
        },
        modelTargetSize: 1.2,
        position: {
            x: 0.3,
            y: -2.3,
            z: 8
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
        floatSpeed: 1
    }
]

function getService02SceneTuning(width) {
    return SERVICE_02_SCENE_TUNING
        .filter((tuning) => tuning.breakpointWidth <= width)
        .sort((a, b) => b.breakpointWidth - a.breakpointWidth)[0] || SERVICE_02_SCENE_TUNING[0]
}

export default class Service02Scene {
    constructor() {
        this.root = new THREE.Group()
        this.baseScale = 1
        this.elapsed = 0
        this.bars = []
        this.nodes = []
        this.currentTuning = getService02SceneTuning(0)
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

        clone.userData.baseOpacity = opacity
        clone.opacity = opacity
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
            panel: this.createMaterial(0xc1d5f9, 0.07),
            panelEdge: this.createLineMaterial(0xf5f5f5, 0.2),
            grid: this.createLineMaterial(0xffffff, 0.08),
            data: this.createMaterial(0xc1d5f9, 0.34),
            dataSoft: this.createMaterial(0xc1d5f9, 0.12),
            accent: this.createMaterial(0xe50914, 0.34),
            accentLine: this.createLineMaterial(0xe50914, 0.46),
            white: this.createMaterial(0xf5f5f5, 0.16),
            whiteLine: this.createLineMaterial(0xf5f5f5, 0.18)
        }

        this.dashboard = new THREE.Group()
        this.dashboard.position.set(-0.06, 0, 0)
        this.root.add(this.dashboard)

        this.createDashboardPanel()
        this.createDataBars()
        this.createWaveform()
        this.createOrbitSystem()
        this.createGameControls()

        this.root.rotation.copy(this.baseRotation)
    }

    createDashboardPanel() {
        const panel = this.createBox(
            1.76,
            1.04,
            0.035,
            this.cloneMaterial(this.materials.panel)
        )
        this.dashboard.add(panel)

        const edge = new THREE.LineSegments(
            new THREE.EdgesGeometry(panel.geometry),
            this.cloneMaterial(this.materials.panelEdge)
        )
        edge.scale.setScalar(1.01)
        this.dashboard.add(edge)

        const gridGroup = new THREE.Group()
        const left = -0.78
        const right = 0.78
        const bottom = -0.4
        const top = 0.36
        const z = 0.04

        for (let index = 0; index <= 5; index += 1) {
            const y = bottom + ((top - bottom) / 5) * index

            gridGroup.add(this.createLine([
                new THREE.Vector3(left, y, z),
                new THREE.Vector3(right, y, z)
            ], this.cloneMaterial(this.materials.grid)))
        }

        for (let index = 0; index <= 7; index += 1) {
            const x = left + ((right - left) / 7) * index

            gridGroup.add(this.createLine([
                new THREE.Vector3(x, bottom, z),
                new THREE.Vector3(x, top, z)
            ], this.cloneMaterial(this.materials.grid)))
        }

        this.dashboard.add(gridGroup)
        this.gridGroup = gridGroup
    }

    createDataBars() {
        const geometry = new THREE.BoxGeometry(0.09, 1, 0.05)
        const baseY = -0.36
        const heights = [0.18, 0.32, 0.24, 0.46, 0.36, 0.58, 0.42]

        heights.forEach((height, index) => {
            const bar = new THREE.Mesh(
                geometry,
                this.cloneMaterial(index % 3 === 1 ? this.materials.accent : this.materials.data)
            )

            bar.userData.baseHeight = height
            bar.userData.phase = index * 0.62
            bar.position.set(-0.58 + index * 0.18, baseY + height * 0.5, 0.08)
            bar.scale.y = height
            this.dashboard.add(bar)
            this.bars.push(bar)
        })
    }

    createWaveform() {
        this.wavePoints = Array.from({ length: 32 }, (_, index) => {
            const x = -0.68 + index * (1.36 / 31)
            const y = 0.1 + Math.sin(index * 0.55) * 0.06

            return new THREE.Vector3(x, y, 0.105)
        })

        this.waveLine = this.createLine(
            this.wavePoints,
            this.cloneMaterial(this.materials.accentLine)
        )
        this.dashboard.add(this.waveLine)

        const nodeGeometry = new THREE.SphereGeometry(0.018, 10, 10)

        for (let index = 0; index < this.wavePoints.length; index += 6) {
            const node = new THREE.Mesh(
                nodeGeometry,
                this.cloneMaterial(this.materials.white)
            )

            node.userData.waveIndex = index
            node.position.copy(this.wavePoints[index])
            this.dashboard.add(node)
            this.nodes.push(node)
        }
    }

    createOrbitSystem() {
        this.orbitSystem = new THREE.Group()
        this.orbitSystem.position.set(0.72, 0.06, 0.28)
        this.root.add(this.orbitSystem)

        const core = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.16, 1),
            this.cloneMaterial(this.materials.data, 0.22)
        )
        this.orbitSystem.add(core)
        this.core = core

        const orbitGeometry = new THREE.TorusGeometry(0.34, 0.006, 8, 96)

        for (let index = 0; index < 3; index += 1) {
            const orbit = new THREE.Mesh(
                orbitGeometry,
                this.cloneMaterial(index === 1 ? this.materials.accent : this.materials.white, index === 1 ? 0.18 : 0.08)
            )

            orbit.rotation.set(index * 0.72, index * 1.1, index * 0.45)
            this.orbitSystem.add(orbit)
        }

        const nodeGeometry = new THREE.SphereGeometry(0.035, 12, 12)

        for (let index = 0; index < 6; index += 1) {
            const angle = (index / 6) * Math.PI * 2
            const node = new THREE.Mesh(
                nodeGeometry,
                this.cloneMaterial(index % 2 === 0 ? this.materials.accent : this.materials.data)
            )

            node.userData.angle = angle
            node.userData.radius = index % 2 === 0 ? 0.38 : 0.29
            node.userData.speed = index % 2 === 0 ? 0.72 : -0.58
            this.orbitSystem.add(node)
            this.nodes.push(node)
        }
    }

    createGameControls() {
        this.controls = new THREE.Group()
        this.controls.position.set(-0.7, -0.54, 0.18)
        this.controls.rotation.set(-0.16, 0.12, -0.08)
        this.root.add(this.controls)

        const base = this.createBox(
            0.52,
            0.26,
            0.045,
            this.cloneMaterial(this.materials.panel, 0.09)
        )
        this.controls.add(base)

        const baseEdge = new THREE.LineSegments(
            new THREE.EdgesGeometry(base.geometry),
            this.cloneMaterial(this.materials.panelEdge, 0.18)
        )
        baseEdge.scale.setScalar(1.01)
        this.controls.add(baseEdge)

        const padVertical = this.createBox(
            0.045,
            0.16,
            0.035,
            this.cloneMaterial(this.materials.accent, 0.3),
            {
                x: -0.13,
                z: 0.045
            }
        )
        this.controls.add(padVertical)

        const padHorizontal = this.createBox(
            0.16,
            0.045,
            0.035,
            this.cloneMaterial(this.materials.accent, 0.3),
            {
                x: -0.13,
                z: 0.05
            }
        )
        this.controls.add(padHorizontal)

        const buttonGeometry = new THREE.SphereGeometry(0.043, 14, 14)

        for (let index = 0; index < 3; index += 1) {
            const button = new THREE.Mesh(
                buttonGeometry,
                this.cloneMaterial(index === 1 ? this.materials.accent : this.materials.white, index === 1 ? 0.34 : 0.16)
            )

            button.position.set(0.1 + index * 0.085, index === 1 ? 0.045 : -0.015, 0.065)
            button.userData.phase = index * 0.8
            this.controls.add(button)
            this.nodes.push(button)
        }
    }

    resize(context = {}) {
        const { width = 0 } = context

        this.lastResizeContext = context
        this.currentTuning = getService02SceneTuning(width)

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
        return getService02SceneTuning(width || 0).camera
    }

    animate({ delta, pointer }) {
        this.elapsed += delta * this.currentTuning.floatSpeed

        const targetRotationX = this.baseRotation.x + (pointer?.y || 0) * this.currentTuning.pointerRotation.x
        const targetRotationY = this.baseRotation.y + (pointer?.x || 0) * this.currentTuning.pointerRotation.y
        const targetRotationZ = this.baseRotation.z + (pointer?.x || 0) * this.currentTuning.pointerRotation.z
        const smoothing = this.currentTuning.pointerRotation.smoothing

        this.root.rotation.x += (targetRotationX - this.root.rotation.x) * smoothing
        this.root.rotation.y += (targetRotationY - this.root.rotation.y) * smoothing
        this.root.rotation.z += (targetRotationZ - this.root.rotation.z) * smoothing

        this.root.rotation.x += delta * this.currentTuning.spinSpeed.x * 0.2
        this.root.rotation.y += delta * this.currentTuning.spinSpeed.y * 0.2

        this.updateBars()
        this.updateWaveform()
        this.updateOrbitSystem(delta)
        this.updateControls()

        this.dashboard.position.y = Math.sin(this.elapsed * 0.78) * 0.025
        this.controls.rotation.z = -0.08 + Math.sin(this.elapsed * 1.3) * 0.035
        this.root.scale.setScalar(this.baseScale)
    }

    updateBars() {
        const baseY = -0.36

        this.bars.forEach((bar) => {
            const height = bar.userData.baseHeight + Math.sin(this.elapsed * 1.8 + bar.userData.phase) * 0.055

            bar.scale.y = Math.max(0.06, height)
            bar.position.y = baseY + bar.scale.y * 0.5
        })
    }

    updateWaveform() {
        const positions = this.waveLine.geometry.attributes.position

        this.wavePoints.forEach((point, index) => {
            point.y = 0.1 + Math.sin(this.elapsed * 1.6 + index * 0.48) * 0.06
            positions.setXYZ(index, point.x, point.y, point.z)
        })

        positions.needsUpdate = true

        this.nodes.forEach((node) => {
            if (node.userData.waveIndex === undefined) {
                return
            }

            node.position.copy(this.wavePoints[node.userData.waveIndex])
        })
    }

    updateOrbitSystem(delta) {
        this.orbitSystem.rotation.y += delta * 0.32
        this.orbitSystem.rotation.z = Math.sin(this.elapsed * 0.65) * 0.16
        this.core.rotation.x += delta * 0.7
        this.core.rotation.y += delta * 0.55

        this.nodes.forEach((node) => {
            if (node.userData.angle === undefined) {
                return
            }

            const angle = node.userData.angle + this.elapsed * node.userData.speed

            node.position.set(
                Math.cos(angle) * node.userData.radius,
                Math.sin(angle * 1.4) * 0.12,
                Math.sin(angle) * node.userData.radius
            )
        })
    }

    updateControls() {
        this.nodes.forEach((node) => {
            if (node.userData.phase === undefined) {
                return
            }

            const pulse = 1 + Math.sin(this.elapsed * 2.2 + node.userData.phase) * 0.12

            node.scale.setScalar(pulse)
        })
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
