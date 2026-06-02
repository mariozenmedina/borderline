import * as THREE from 'three'
import { disposeObject, measureObjectSize, setObjectOpacity } from './sceneUtils'

// Painel de ajuste manual da cena service 04.
// Mexa nestes valores primeiro para posicionar e calibrar a infraestrutura 3D.
// Cada objeto vale a partir do seu breakpointWidth.
// A cena escolhe o maior breakpointWidth menor ou igual a largura atual da tela.
const SERVICE_04_SCENE_TUNING = [
    {
        breakpointWidth: 0,
        
        camera: {
            fov: 38,
            near: 0.1,
            far: 8,
            position: {
                x: 0,
                y: -4,
                z: 10
            },
            lookAt: {
                x: 0,
                y: -5.1,
                z: 0
            }
        },
        modelTargetSize: 0.8,
        position: {
            x: 0,
            y: -4,
            z: 8
        },
        initialRotation: {
            x: 0.18,
            y: -0.36,
            z: 0.08
        },
        spinSpeed: {
            x: 0.02,
            y: 0.04
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
                y: -4,
                z: 10
            },
            lookAt: {
                x: -0.2,
                y: -5.1,
                z: 0
            }
        },
        modelTargetSize: 1,
        position: {
            x: 0,
            y: -4,
            z: 8
        },
        initialRotation: {
            x: 0.18,
            y: -0.36,
            z: 0.08
        },
        spinSpeed: {
            x: 0.02,
            y: 0.04
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
                y: -4,
                z: 10
            },
            lookAt: {
                x: -2.2,
                y: -4.1,
                z: 0
            }
        },
        modelTargetSize: 1.2,
        position: {
            x: 0,
            y: -4,
            z: 8
        },
        initialRotation: {
            x: 0.18,
            y: -0.36,
            z: 0.08
        },
        spinSpeed: {
            x: 0.02,
            y: 0.04
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

function getService04SceneTuning(width) {
    return SERVICE_04_SCENE_TUNING
        .filter((tuning) => tuning.breakpointWidth <= width)
        .sort((a, b) => b.breakpointWidth - a.breakpointWidth)[0] || SERVICE_04_SCENE_TUNING[0]
}

export default class Service04Scene {
    constructor() {
        this.root = new THREE.Group()
        this.baseScale = 1
        this.elapsed = 0
        this.containers = []
        this.signals = []
        this.currentTuning = getService04SceneTuning(0)
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
            glass: this.createMaterial(0xc1d5f9, 0.08),
            glassEdge: this.createLineMaterial(0xf5f5f5, 0.2),
            white: this.createMaterial(0xf5f5f5, 0.16),
            whiteLine: this.createLineMaterial(0xf5f5f5, 0.18),
            accent: this.createMaterial(0xe50914, 0.34),
            accentSoft: this.createMaterial(0xe50914, 0.12),
            accentLine: this.createLineMaterial(0xe50914, 0.42),
            blue: this.createMaterial(0xc1d5f9, 0.26),
            blueLine: this.createLineMaterial(0xc1d5f9, 0.28)
        }

        this.infrastructure = new THREE.Group()
        this.root.add(this.infrastructure)

        this.createCloudCluster()
        this.createContainerRack()
        this.createDeployRail()
        this.createMonitoringPanel()
        this.createSignalNodes()

        this.root.rotation.copy(this.baseRotation)
    }

    createCloudCluster() {
        this.cloud = new THREE.Group()
        this.cloud.position.set(-0.02, 0.14, 0.02)
        this.infrastructure.add(this.cloud)

        const core = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.34, 1),
            this.cloneMaterial(this.materials.glass, 0.08)
        )
        this.cloud.add(core)
        this.cloudCore = core

        const coreEdges = new THREE.LineSegments(
            new THREE.EdgesGeometry(core.geometry),
            this.cloneMaterial(this.materials.glassEdge, 0.16)
        )
        coreEdges.scale.setScalar(1.012)
        this.cloud.add(coreEdges)

        const orbitGeometry = new THREE.TorusGeometry(0.56, 0.008, 8, 128)

        for (let index = 0; index < 3; index += 1) {
            const orbit = new THREE.Mesh(
                orbitGeometry,
                this.cloneMaterial(index === 1 ? this.materials.accent : this.materials.white, index === 1 ? 0.18 : 0.08)
            )

            orbit.rotation.set(index * 0.62, index * 1.08, index * 0.45)
            this.cloud.add(orbit)
        }

        const nodeGeometry = new THREE.SphereGeometry(0.045, 12, 12)

        for (let index = 0; index < 7; index += 1) {
            const angle = (index / 7) * Math.PI * 2
            const node = new THREE.Mesh(
                nodeGeometry,
                this.cloneMaterial(index % 3 === 0 ? this.materials.accent : this.materials.blue, index % 3 === 0 ? 0.35 : 0.26)
            )

            node.userData.angle = angle
            node.userData.radius = index % 2 === 0 ? 0.6 : 0.48
            node.userData.speed = index % 2 === 0 ? 0.52 : -0.44
            this.cloud.add(node)
            this.signals.push(node)
        }
    }

    createContainerRack() {
        this.rack = new THREE.Group()
        this.rack.position.set(-0.82, -0.27, 0.12)
        this.rack.rotation.set(-0.12, 0.18, -0.06)
        this.infrastructure.add(this.rack)

        const rackFrame = this.createBox(
            0.52,
            0.62,
            0.05,
            this.cloneMaterial(this.materials.glass, 0.07)
        )
        this.rack.add(rackFrame)

        const rackEdge = new THREE.LineSegments(
            new THREE.EdgesGeometry(rackFrame.geometry),
            this.cloneMaterial(this.materials.glassEdge, 0.18)
        )
        rackEdge.scale.setScalar(1.012)
        this.rack.add(rackEdge)

        const containerGeometry = new THREE.BoxGeometry(0.4, 0.09, 0.075)

        for (let index = 0; index < 5; index += 1) {
            const container = new THREE.Mesh(
                containerGeometry,
                this.cloneMaterial(index === 2 ? this.materials.accentSoft : this.materials.blue, index === 2 ? 0.16 : 0.13)
            )

            container.position.set(0, 0.22 - index * 0.11, 0.06)
            container.userData.baseX = container.position.x
            container.userData.phase = index * 0.65
            this.rack.add(container)
            this.containers.push(container)

            const indicator = new THREE.Mesh(
                new THREE.SphereGeometry(0.016, 10, 10),
                this.cloneMaterial(index === 2 ? this.materials.accent : this.materials.white, index === 2 ? 0.34 : 0.16)
            )
            indicator.position.set(-0.16, container.position.y, 0.11)
            indicator.userData.phase = index * 0.7
            this.rack.add(indicator)
            this.signals.push(indicator)
        }
    }

    createDeployRail() {
        this.deployRail = new THREE.Group()
        this.infrastructure.add(this.deployRail)

        this.deployPath = [
            new THREE.Vector3(-0.58, -0.22, 0.2),
            new THREE.Vector3(-0.24, -0.05, 0.16),
            new THREE.Vector3(0.22, 0.08, 0.12),
            new THREE.Vector3(0.58, 0.18, 0.18)
        ]

        this.deployRail.add(this.createLine(
            this.deployPath,
            this.cloneMaterial(this.materials.accentLine, 0.34)
        ))

        this.deployPackage = this.createBox(
            0.08,
            0.08,
            0.08,
            this.cloneMaterial(this.materials.accent, 0.38)
        )
        this.deployRail.add(this.deployPackage)

        this.deployGhosts = this.deployPath.map((point, index) => {
            const node = new THREE.Mesh(
                new THREE.SphereGeometry(0.022, 10, 10),
                this.cloneMaterial(index === this.deployPath.length - 1 ? this.materials.accent : this.materials.blue, 0.22)
            )

            node.position.copy(point)
            this.deployRail.add(node)
            return node
        })
    }

    createMonitoringPanel() {
        this.monitor = new THREE.Group()
        this.monitor.position.set(0.58, 0.48, 0.08)
        this.monitor.rotation.set(0.08, -0.18, 0.06)
        this.infrastructure.add(this.monitor)

        const panel = this.createBox(
            0.58,
            0.32,
            0.038,
            this.cloneMaterial(this.materials.glass, 0.07)
        )
        this.monitor.add(panel)

        const edge = new THREE.LineSegments(
            new THREE.EdgesGeometry(panel.geometry),
            this.cloneMaterial(this.materials.glassEdge, 0.17)
        )
        edge.scale.setScalar(1.012)
        this.monitor.add(edge)

        this.monitorPoints = Array.from({ length: 18 }, (_, index) => (
            new THREE.Vector3(
                -0.24 + index * (0.48 / 17),
                Math.sin(index * 0.7) * 0.04,
                0.045
            )
        ))

        this.monitorLine = this.createLine(
            this.monitorPoints,
            this.cloneMaterial(this.materials.accentLine, 0.38)
        )
        this.monitor.add(this.monitorLine)

        const baseline = this.createLine([
            new THREE.Vector3(-0.25, -0.1, 0.043),
            new THREE.Vector3(0.25, -0.1, 0.043)
        ], this.cloneMaterial(this.materials.whiteLine, 0.08))
        this.monitor.add(baseline)
    }

    createSignalNodes() {
        this.signalLines = new THREE.Group()
        this.infrastructure.add(this.signalLines)

        const routes = [
            [new THREE.Vector3(-0.6, -0.16, 0.16), new THREE.Vector3(-0.26, 0.02, 0.1)],
            [new THREE.Vector3(0.35, 0.38, 0.1), new THREE.Vector3(0.14, 0.22, 0.06)],
            [new THREE.Vector3(0.42, 0.44, 0.1), new THREE.Vector3(0.7, 0.3, 0.13)]
        ]

        routes.forEach((route, index) => {
            this.signalLines.add(this.createLine(
                route,
                this.cloneMaterial(index % 2 === 0 ? this.materials.blueLine : this.materials.whiteLine, index % 2 === 0 ? 0.2 : 0.12)
            ))
        })
    }

    resize(context = {}) {
        const { width = 0 } = context

        this.lastResizeContext = context
        this.currentTuning = getService04SceneTuning(width)

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
        return getService04SceneTuning(width || 0).camera
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

        this.updateCloud(delta)
        this.updateContainers()
        this.updateDeployPackage()
        this.updateMonitorLine()

        this.infrastructure.position.y = Math.sin(this.elapsed * 0.72) * 0.025
        this.root.scale.setScalar(this.baseScale)
    }

    updateCloud(delta) {
        this.cloud.rotation.y += delta * 0.24
        this.cloudCore.rotation.x += delta * 0.4
        this.cloudCore.rotation.z += delta * 0.32

        this.signals.forEach((signal) => {
            if (signal.userData.angle !== undefined) {
                const angle = signal.userData.angle + this.elapsed * signal.userData.speed

                signal.position.set(
                    Math.cos(angle) * signal.userData.radius,
                    Math.sin(angle * 1.35) * 0.12,
                    Math.sin(angle) * signal.userData.radius
                )
                return
            }

            if (signal.userData.phase !== undefined) {
                signal.scale.setScalar(1 + Math.sin(this.elapsed * 2.6 + signal.userData.phase) * 0.22)
            }
        })
    }

    updateContainers() {
        this.containers.forEach((container) => {
            container.position.x = container.userData.baseX + Math.sin(this.elapsed * 1.4 + container.userData.phase) * 0.018
            container.scale.x = 1 + Math.sin(this.elapsed * 1.1 + container.userData.phase) * 0.035
        })
    }

    updateDeployPackage() {
        const segmentCount = this.deployPath.length - 1
        const rawProgress = (this.elapsed * 0.28) % 1
        const scaledProgress = rawProgress * segmentCount
        const segmentIndex = Math.min(Math.floor(scaledProgress), segmentCount - 1)
        const localProgress = scaledProgress - segmentIndex
        const start = this.deployPath[segmentIndex]
        const end = this.deployPath[segmentIndex + 1]
        const eased = localProgress < 0.5
            ? localProgress * localProgress * 2
            : 1 - ((1 - localProgress) * (1 - localProgress) * 2)

        this.deployPackage.position.lerpVectors(start, end, eased)
        this.deployPackage.rotation.x += 0.035
        this.deployPackage.rotation.y += 0.045
        this.deployPackage.scale.setScalar(0.78 + Math.sin(rawProgress * Math.PI) * 0.26)

        this.deployGhosts.forEach((node, index) => {
            node.scale.setScalar(1 + Math.sin(this.elapsed * 1.8 + index * 0.7) * 0.18)
        })
    }

    updateMonitorLine() {
        const positions = this.monitorLine.geometry.attributes.position

        this.monitorPoints.forEach((point, index) => {
            point.y = Math.sin(this.elapsed * 1.9 + index * 0.58) * 0.04
            positions.setXYZ(index, point.x, point.y, point.z)
        })

        positions.needsUpdate = true
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
