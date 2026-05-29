import * as THREE from 'three'
import { disposeObject, measureObjectSize, setObjectOpacity } from './sceneUtils'

export default class AboutNetworkScene {
  constructor() {
    this.root = new THREE.Group()
    this.baseScale = 1

    this.createObjects()
    this.objectSize = measureObjectSize(this.root)
    this.setOpacity(0)
  }

  mount(worldScene) {
    worldScene.add(this.root)
  }

  // Materiais base usados pelos elementos da cena.
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

  // Elementos 3D da secao about.
  createObjects() {
    const shellMaterial = this.createMaterial(0xd8d8d8, 0.2)
    const redMaterial = this.createMaterial(0xe50914, 0.42)
    const nodeMaterial = this.createMaterial(0xf5f5f5, 0.5, false)
    const signalMaterial = new THREE.LineBasicMaterial({
      color: 0xe50914,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      depthTest: false
    })
    signalMaterial.userData.baseOpacity = signalMaterial.opacity

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.72, 2),
      shellMaterial.clone()
    )
    core.material.userData.baseOpacity = shellMaterial.userData.baseOpacity
    this.root.add(core)

    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.74, 0.045, 180, 12, 2, 5),
      redMaterial.clone()
    )
    knot.material.userData.baseOpacity = redMaterial.userData.baseOpacity
    knot.rotation.set(0.8, 0.12, 0.4)
    this.root.add(knot)

    const orbitGeometry = new THREE.TorusGeometry(1.05, 0.01, 8, 128)

    for (let index = 0; index < 3; index += 1) {
      const orbit = new THREE.Mesh(orbitGeometry, shellMaterial.clone())

      orbit.material.userData.baseOpacity = 0.14
      orbit.rotation.set(index * 0.72, index * 1.14, index * 0.38)
      this.root.add(orbit)
    }

    const nodeGeometry = new THREE.SphereGeometry(0.035, 12, 12)
    const linePoints = []

    for (let index = 0; index < 10; index += 1) {
      const angle = (index / 10) * Math.PI * 2
      const radius = index % 2 === 0 ? 1.15 : 0.86
      const point = new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle * 1.5) * 0.28,
        Math.sin(angle) * radius
      )
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone())

      node.material.userData.baseOpacity = nodeMaterial.userData.baseOpacity
      node.position.copy(point)
      this.root.add(node)
      linePoints.push(point)
    }

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints.concat(linePoints[0]))
    this.root.add(new THREE.Line(lineGeometry, signalMaterial))
    this.root.rotation.set(0.2, -0.4, 0.1)
  }

  // Layout simples por enquanto: a posicao fina fica para outra etapa.
  resize({ width }) {
    const largestSide = Math.max(this.objectSize.x, this.objectSize.y, this.objectSize.z, 1)
    const targetSize = width < 721 ? 1.6 : 2.1

    this.baseScale = targetSize / largestSide
    this.root.position.set(width < 992 ? -0.1 : 0.48, 0.02, -0.22)
  }

  // Animacao propria da cena about.
  animate({ delta, pointer, weight }) {
    this.root.rotation.x += delta * 0.08
    this.root.rotation.y += delta * 0.18
    this.root.rotation.z += ((pointer?.x || 0) * 0.16 - this.root.rotation.z) * 0.035
    this.root.scale.setScalar(this.baseScale * (0.9 + weight * 0.1))
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
