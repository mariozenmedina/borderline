import * as THREE from 'three'
import { circuitActivation, createCircuitLayout, sampleCircuitPath } from './circuitLayout.mjs'

export function createCircuitScene(canvas, { compact = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !compact, powerPreference: 'low-power' })
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
  const layout = createCircuitLayout()
  const geometries = new Set(), materials = new Set()
  const geometry = value => (geometries.add(value), value)
  const material = value => (materials.add(value), value)
  const surface = material(new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0.08 }))
  const graphite = material(new THREE.MeshStandardMaterial({ roughness: 0.65, metalness: 0.25 }))
  const metal = material(new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.4 }))
  const red = material(new THREE.MeshStandardMaterial({ color: '#e50914', roughness: 0.6, metalness: 0.15 }))
  const tracks = material(new THREE.LineBasicMaterial({ transparent: true, opacity: 0.42 }))
  const gridMaterial = material(new THREE.LineBasicMaterial({ transparent: true, opacity: 0.12 }))
  const board = new THREE.Mesh(geometry(new THREE.PlaneGeometry(60, 44)), surface)
  board.rotation.x = -Math.PI / 2
  board.position.y = -0.08
  scene.add(board)
  scene.add(new THREE.HemisphereLight(0xffffff, 0x777777, 2.3))
  const light = new THREE.DirectionalLight(0xffffff, 3)
  light.position.set(-8, 16, 8)
  scene.add(light)

  function lineSegments(paths, lineMaterial, height = 0.015) {
    const points = []
    for (const path of paths) {
      for (let index = 1; index < path.length; index++) {
        points.push(path[index - 1][0], height, path[index - 1][1], path[index][0], height, path[index][1])
      }
    }
    const lines = new THREE.LineSegments(geometry(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(points, 3))), lineMaterial)
    scene.add(lines)
    return lines
  }
  lineSegments(layout.traces.map(trace => trace.points), tracks)
  const grid = []
  for (let x = -28; x <= 28; x += 1) grid.push([[x, -20], [x, 20]])
  for (let z = -20; z <= 20; z += 1) grid.push([[-28, z], [28, z]])
  lineSegments(grid, gridMaterial, -0.055)

  const box = geometry(new THREE.BoxGeometry(1, 1, 1))
  const dummy = new THREE.Object3D()
  function instances(items, shape, paint) {
    const mesh = new THREE.InstancedMesh(shape, paint, items.length)
    items.forEach((item, index) => {
      dummy.position.set(item.x, item.y || 0, item.z)
      dummy.rotation.set(item.rotateX || 0, 0, 0)
      dummy.scale.set(item.width || 1, item.height || 1, item.depth || 1)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    scene.add(mesh)
    return mesh
  }
  instances(layout.components.map(part => ({ ...part, y: part.height / 2 })), box, graphite)
  const chips = [layout.core, ...layout.nodes]
  instances(chips.map(chip => ({ x: chip.x, z: chip.z, y: 0.13, width: chip.size + 0.35, depth: chip.size + 0.35, height: 0.26 })), box, metal)
  instances(chips.map(chip => ({ x: chip.x, z: chip.z, y: 0.34, width: chip.size, depth: chip.size, height: 0.24 })), box, graphite)
  instances([{ x: layout.core.x, z: 0, y: 0.48, width: 1.65, depth: 1.65, height: 0.05 }], box, surface)

  const pins = []
  for (const chip of chips) {
    for (let index = 0; index < 12; index++) {
      const offset = (index / 11 - 0.5) * chip.size * 0.85
      for (const side of [-1, 1]) {
        pins.push({ x: chip.x + offset, z: chip.z + side * (chip.size / 2 + 0.23), y: 0.08, width: 0.055, depth: 0.35, height: 0.08 })
        pins.push({ x: chip.x + side * (chip.size / 2 + 0.23), z: chip.z + offset, y: 0.08, width: 0.35, depth: 0.055, height: 0.08 })
      }
    }
  }
  instances(pins, box, metal)
  instances(layout.vias.map(via => ({ ...via, y: 0.025, rotateX: Math.PI / 2 })), geometry(new THREE.TorusGeometry(0.075, 0.018, 4, 10)), metal)
  const coreDot = new THREE.Mesh(geometry(new THREE.CylinderGeometry(0.21, 0.21, 0.045, 24)), red)
  coreDot.position.set(layout.core.x, 0.53, 0)
  scene.add(coreDot)

  const activePaths = layout.traces.filter(trace => trace.primary)
  const connections = activePaths.map(trace => {
    const paint = material(new THREE.LineBasicMaterial({ color: '#e50914', transparent: true, opacity: 0.25 }))
    lineSegments([trace.points], paint, 0.045)
    const node = layout.nodes[trace.service], r = node.size / 2 + 0.45
    lineSegments([[[node.x - r, node.z - r], [node.x + r, node.z - r], [node.x + r, node.z + r], [node.x - r, node.z + r], [node.x - r, node.z - r]]], paint, 0.03)
    return paint
  })
  const pulseMaterial = material(new THREE.MeshBasicMaterial({ color: '#e50914' }))
  const pulseGeometry = geometry(new THREE.SphereGeometry(0.075, 8, 6))
  const pulses = activePaths.map(() => {
    const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial)
    scene.add(pulse)
    return pulse
  })
  let isCompact = compact, smoothedX = 0, smoothedY = 0, smoothedOpening = 0
  const lookAt = new THREE.Vector3(2.5, 0, 0)

  function setTheme(dark) {
    surface.color.set(dark ? '#161616' : '#f4f4f4')
    graphite.color.set(dark ? '#454545' : '#737373')
    metal.color.set(dark ? '#686868' : '#b3b3b3')
    tracks.color.set(dark ? '#909090' : '#777777')
    gridMaterial.color.set(dark ? '#777777' : '#a0a0a0')
    scene.fog = new THREE.Fog(dark ? '#111111' : '#ffffff', 28, 62)
  }
  setTheme(false)

  return {
    setTheme,
    resize(width, height, coarse) {
      isCompact = coarse
      renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, coarse ? 1 : 1.5))
      renderer.setSize(Math.max(1, width), Math.max(1, height), false)
      camera.aspect = width / Math.max(1, height)
      camera.updateProjectionMatrix()
    },
    render({ pointerX = 0, pointerY = 0, opening = 0, time = 0, delta = 1 / 60 }) {
      const ease = 1 - Math.exp(-Math.min(delta, 0.1) * 4)
      smoothedX += (pointerX - smoothedX) * ease
      smoothedY += (pointerY - smoothedY) * ease
      smoothedOpening += (opening - smoothedOpening) * ease
      const distance = isCompact ? 1.1 : 1
      camera.position.set(10 + smoothedX * 1.1, (17 + smoothedY * 0.65) * distance, (22 + (isCompact ? smoothedOpening * 0.013 : smoothedY * 0.7)) * distance)
      camera.lookAt(lookAt)
      for (let index = 0; index < connections.length; index++) {
        const activation = circuitActivation(smoothedOpening, index)
        connections[index].opacity = 0.24 + activation * 0.6
        const phase = (time * 0.12 + index / 6) % 1
        pulses[index].visible = phase < 0.48
        if (pulses[index].visible) {
          const [x, z] = sampleCircuitPath(activePaths[index].points, phase / 0.48)
          pulses[index].position.set(x, 0.075, z)
        }
      }
      renderer.render(scene, camera)
    },
    dispose() {
      scene.traverse(object => { if (object.isInstancedMesh) object.dispose() })
      geometries.forEach(item => item.dispose())
      materials.forEach(item => item.dispose())
      renderer.dispose()
    },
  }
}
