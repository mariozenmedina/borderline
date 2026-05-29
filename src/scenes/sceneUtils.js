import * as THREE from 'three'

export function measureObjectSize(object) {
  const box = new THREE.Box3().setFromObject(object)
  const size = new THREE.Vector3()

  box.getSize(size)
  return size
}

export function setObjectOpacity(object, weight) {
  object?.traverse((child) => {
    const materials = Array.isArray(child.material) ? child.material : [child.material]

    materials.forEach((material) => {
      if (!material) {
        return
      }

      const baseOpacity = material.userData.baseOpacity ?? material.opacity ?? 1
      material.transparent = true
      material.opacity = baseOpacity * weight
    })
  })
}

export function disposeObject(object) {
  const geometries = new Set()
  const materials = new Set()

  object?.traverse((child) => {
    if (child.geometry) {
      geometries.add(child.geometry)
    }

    const childMaterials = Array.isArray(child.material) ? child.material : [child.material]
    childMaterials.forEach((material) => {
      if (material) {
        materials.add(material)
      }
    })
  })

  geometries.forEach((geometry) => geometry.dispose())
  materials.forEach((material) => material.dispose())
}
