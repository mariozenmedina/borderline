import * as THREE from 'three'
import { disposeObject, measureObjectSize, setObjectOpacity } from './sceneUtils'

// Painel de ajuste manual da cena service 03.
// Mexa nestes valores primeiro para posicionar e calibrar a arquitetura 3D.
// Cada objeto vale a partir do seu breakpointWidth.
// A cena escolhe o maior breakpointWidth menor ou igual a largura atual da tela.
const SERVICE_03_SCENE_TUNING = [
    {
        breakpointWidth: 0,
        
        camera: {
            fov: 38,
            near: 0.1,
            far: 8,
            position: {
                x: 0,
                y: -3,
                z: 10
            },
            lookAt: {
                x: 0,
                y: -4.8,
                z: 0
            }
        },
        modelTargetSize: 0.8,
        position: {
            x: 0,
            y: -3,
            z: 8
        },
        initialRotation: {
            x: 0.2,
            y: -0.42,
            z: 0.08
        },
        spinSpeed: {
            x: 0.02,
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
                y: -3,
                z: 10
            },
            lookAt: {
                x: 0,
                y: -4.8,
                z: 0
            }
        },
        modelTargetSize: 1.2,
        position: {
            x: 0,
            y: -3,
            z: 8
        },
        initialRotation: {
            x: 0.2,
            y: -0.42,
            z: 0.08
        },
        spinSpeed: {
            x: 0.02,
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
                y: -3,
                z: 10
            },
            lookAt: {
                x: 1.9,
                y: -3.1,
                z: 0
            }
        },
        modelTargetSize: 1.3,
        position: {
            x: 0,
            y: -3,
            z: 8
        },
        initialRotation: {
            x: 0.2,
            y: 0.24,
            z: 0.18
        },
        spinSpeed: {
            x: 0.02,
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

function getService03SceneTuning(width) {
    return SERVICE_03_SCENE_TUNING
        .filter((tuning) => tuning.breakpointWidth <= width)
        .sort((a, b) => b.breakpointWidth - a.breakpointWidth)[0] || SERVICE_03_SCENE_TUNING[0]
}

export default class Service03Scene {
    constructor() {
        this.root = new THREE.Group()
        this.baseScale = 1
        this.elapsed = 0
        this.serviceModules = []
        this.packets = []
        this.currentTuning = getService03SceneTuning(0)
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
            glassEdge: this.createLineMaterial(0xf5f5f5, 0.22),
            white: this.createMaterial(0xf5f5f5, 0.16),
            whiteLine: this.createLineMaterial(0xf5f5f5, 0.18),
            accent: this.createMaterial(0xe50914, 0.34),
            accentSoft: this.createMaterial(0xe50914, 0.12),
            accentLine: this.createLineMaterial(0xe50914, 0.4),
            blue: this.createMaterial(0xc1d5f9, 0.28),
            blueLine: this.createLineMaterial(0xc1d5f9, 0.28)
        }

        this.architecture = new THREE.Group()
        this.root.add(this.architecture)

        this.createCoreGateway()
        this.createServiceLayer()
        this.createDatabase()
        this.createAutomationGear()
        this.createConnectionMap()
        this.createPackets()

        this.root.rotation.copy(this.baseRotation)
    }

    createCoreGateway() {
        this.gateway = new THREE.Group()
        this.gateway.position.set(-0.05, 0.03, 0.05)
        this.architecture.add(this.gateway)

        const core = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.28, 1),
            this.cloneMaterial(this.materials.blue, 0.22)
        )
        this.gateway.add(core)
        this.gatewayCore = core

        const shell = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.43, 1),
            this.cloneMaterial(this.materials.glass, 0.06)
        )
        this.gateway.add(shell)

        const shellEdge = new THREE.LineSegments(
            new THREE.EdgesGeometry(shell.geometry),
            this.cloneMaterial(this.materials.glassEdge, 0.16)
        )
        shellEdge.scale.setScalar(1.015)
        this.gateway.add(shellEdge)

        const apiLabel = this.createBox(
            0.58,
            0.12,
            0.045,
            this.cloneMaterial(this.materials.accent, 0.22),
            {
                y: -0.46,
                z: 0.04
            }
        )
        this.gateway.add(apiLabel)

        for (let index = 0; index < 3; index += 1) {
            const stripe = this.createBox(
                0.36 - index * 0.06,
                0.014,
                0.026,
                this.cloneMaterial(this.materials.white, 0.12),
                {
                    x: -0.02 + index * 0.025,
                    y: -0.45 + index * 0.035,
                    z: 0.075
                }
            )

            this.gateway.add(stripe)
        }
    }

    createServiceLayer() {
        const modulePositions = [
            { x: -0.82, y: 0.34, z: -0.04, color: 'white' },
            { x: -0.82, y: -0.18, z: 0.02, color: 'blue' },
            { x: 0.64, y: 0.36, z: -0.02, color: 'accent' },
            { x: 0.66, y: -0.2, z: 0.03, color: 'white' }
        ]

        modulePositions.forEach((config, index) => {
            const module = this.createServiceModule(config, index)

            this.architecture.add(module)
            this.serviceModules.push(module)
        })
    }

    createServiceModule(config, index) {
        const module = new THREE.Group()

        module.position.set(config.x, config.y, config.z)
        module.userData.phase = index * 0.78
        module.userData.baseZ = config.z

        const bodyMaterial = config.color === 'accent'
            ? this.cloneMaterial(this.materials.accentSoft, 0.13)
            : this.cloneMaterial(this.materials.glass, 0.08)
        const body = this.createBox(0.46, 0.28, 0.055, bodyMaterial)

        module.add(body)

        const edge = new THREE.LineSegments(
            new THREE.EdgesGeometry(body.geometry),
            this.cloneMaterial(config.color === 'accent' ? this.materials.accentLine : this.materials.glassEdge, 0.2)
        )
        edge.scale.setScalar(1.012)
        module.add(edge)

        const material = config.color === 'accent'
            ? this.materials.accent
            : config.color === 'blue'
                ? this.materials.blue
                : this.materials.white

        for (let row = 0; row < 3; row += 1) {
            const width = 0.26 - row * 0.045
            const line = this.createBox(
                width,
                0.014,
                0.024,
                this.cloneMaterial(material, row === 0 ? 0.24 : 0.13),
                {
                    x: -0.04 + row * 0.026,
                    y: 0.07 - row * 0.06,
                    z: 0.047
                }
            )

            module.add(line)
        }

        const portGeometry = new THREE.SphereGeometry(0.025, 10, 10)
        const port = new THREE.Mesh(
            portGeometry,
            this.cloneMaterial(config.color === 'accent' ? this.materials.accent : this.materials.blue, 0.32)
        )
        port.position.set(0.2, -0.09, 0.058)
        module.add(port)

        return module
    }

    createDatabase() {
        this.database = new THREE.Group()
        this.database.position.set(0.95, -0.02, 0.2)
        this.database.rotation.set(0.1, -0.28, 0.08)
        this.architecture.add(this.database)

        const cylinder = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.18, 0.46, 32, 1, true),
            this.cloneMaterial(this.materials.glass, 0.09)
        )
        this.database.add(cylinder)

        const topRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.18, 0.008, 8, 64),
            this.cloneMaterial(this.materials.accent, 0.24)
        )
        topRing.rotation.x = Math.PI / 2
        topRing.position.y = 0.23
        this.database.add(topRing)

        const bottomRing = topRing.clone()
        bottomRing.material = this.cloneMaterial(this.materials.white, 0.12)
        bottomRing.position.y = -0.23
        this.database.add(bottomRing)

        for (let index = 0; index < 3; index += 1) {
            const band = new THREE.Mesh(
                new THREE.TorusGeometry(0.181, 0.004, 8, 64),
                this.cloneMaterial(index === 1 ? this.materials.accent : this.materials.white, index === 1 ? 0.16 : 0.08)
            )

            band.rotation.x = Math.PI / 2
            band.position.y = -0.12 + index * 0.12
            this.database.add(band)
        }
    }

    createAutomationGear() {
        this.gear = new THREE.Group()
        this.gear.position.set(-0.96, -0.48, 0.22)
        this.gear.rotation.set(-0.2, 0.18, 0.1)
        this.architecture.add(this.gear)

        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.18, 0.024, 8, 48),
            this.cloneMaterial(this.materials.accent, 0.2)
        )
        this.gear.add(ring)

        const toothMaterial = this.cloneMaterial(this.materials.white, 0.13)

        for (let index = 0; index < 8; index += 1) {
            const angle = (index / 8) * Math.PI * 2
            const tooth = this.createBox(
                0.04,
                0.11,
                0.028,
                toothMaterial.clone(),
                {
                    x: Math.cos(angle) * 0.19,
                    y: Math.sin(angle) * 0.19,
                    z: 0
                }
            )

            tooth.material.userData.baseOpacity = toothMaterial.userData.baseOpacity
            tooth.rotation.z = angle
            this.gear.add(tooth)
        }

        const center = new THREE.Mesh(
            new THREE.SphereGeometry(0.045, 12, 12),
            this.cloneMaterial(this.materials.blue, 0.3)
        )
        this.gear.add(center)
    }

    createConnectionMap() {
        this.connectionGroup = new THREE.Group()
        this.architecture.add(this.connectionGroup)

        const routes = [
            { start: new THREE.Vector3(-0.62, 0.34, 0.02), end: new THREE.Vector3(-0.2, 0.13, 0.09), accent: false },
            { start: new THREE.Vector3(-0.62, -0.18, 0.07), end: new THREE.Vector3(-0.22, -0.08, 0.1), accent: true },
            { start: new THREE.Vector3(0.38, 0.34, 0.04), end: new THREE.Vector3(0.18, 0.12, 0.1), accent: true },
            { start: new THREE.Vector3(0.42, -0.18, 0.08), end: new THREE.Vector3(0.18, -0.1, 0.1), accent: false },
            { start: new THREE.Vector3(0.24, 0.02, 0.1), end: new THREE.Vector3(0.78, -0.02, 0.22), accent: true },
            { start: new THREE.Vector3(-0.88, -0.36, 0.2), end: new THREE.Vector3(-0.32, -0.2, 0.1), accent: false }
        ]

        this.routes = routes

        routes.forEach((route) => {
            const material = route.accent
                ? this.cloneMaterial(this.materials.accentLine, 0.32)
                : this.cloneMaterial(this.materials.blueLine, 0.22)

            this.connectionGroup.add(this.createLine([route.start, route.end], material))
        })
    }

    createPackets() {
        const packetGeometry = new THREE.BoxGeometry(0.055, 0.055, 0.055)

        this.routes.forEach((route, index) => {
            const packet = new THREE.Mesh(
                packetGeometry,
                this.cloneMaterial(route.accent ? this.materials.accent : this.materials.blue, route.accent ? 0.38 : 0.3)
            )

            packet.userData.route = route
            packet.userData.phase = index / this.routes.length
            packet.userData.speed = route.accent ? 0.34 : 0.26
            this.connectionGroup.add(packet)
            this.packets.push(packet)
        })
    }

    resize(context = {}) {
        const { width = 0 } = context

        this.lastResizeContext = context
        this.currentTuning = getService03SceneTuning(width)

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
        return getService03SceneTuning(width || 0).camera
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

        this.gateway.rotation.y += delta * 0.28
        this.gatewayCore.rotation.x += delta * 0.6
        this.gatewayCore.rotation.z += delta * 0.45
        this.database.rotation.y = -0.28 + Math.sin(this.elapsed * 0.75) * 0.08
        this.gear.rotation.z += delta * 0.9

        this.updateServiceModules()
        this.updatePackets()

        this.architecture.position.y = Math.sin(this.elapsed * 0.72) * 0.025
        this.root.scale.setScalar(this.baseScale)
    }

    updateServiceModules() {
        this.serviceModules.forEach((module) => {
            const lift = Math.sin(this.elapsed * 1.1 + module.userData.phase) * 0.018

            module.position.z = module.userData.baseZ + lift
            module.rotation.z = Math.sin(this.elapsed * 0.9 + module.userData.phase) * 0.018
        })
    }

    updatePackets() {
        this.packets.forEach((packet) => {
            const route = packet.userData.route
            const progress = (this.elapsed * packet.userData.speed + packet.userData.phase) % 1
            const eased = progress < 0.5
                ? progress * progress * 2
                : 1 - ((1 - progress) * (1 - progress) * 2)

            packet.position.lerpVectors(route.start, route.end, eased)
            packet.rotation.x += 0.03
            packet.rotation.y += 0.04
            packet.scale.setScalar(0.75 + Math.sin(progress * Math.PI) * 0.35)
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
