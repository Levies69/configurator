import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useSpring, animated, config } from '@react-spring/three'

// Predefined shapes with their morphing targets and texture settings
const shapeConfigs = {
  sphere: { 
    geometry: (args) => <sphereGeometry args={[1, 64, 64]} />, 
    scale: 1,
    uvScale: [1, 1]  // Default UV scale for sphere
  },
  cube: { 
    geometry: (args) => <boxGeometry args={[1.5, 1.5, 1.5]} />, 
    scale: 1,
    uvScale: [1, 1]  // Default UV scale for cube
  },
  torus: { 
    geometry: (args) => <torusGeometry args={[1, 0.4, 32, 64]} />, 
    scale: 1,
    uvScale: [2, 1]  // Adjusted UV scale for torus to prevent stretching
  },
  cone: { 
    geometry: (args) => <coneGeometry args={[1, 2, 64]} />, 
    scale: 1,
    uvScale: [1, 1.5]  // Adjusted UV scale for cone
  },
  cylinder: { 
    geometry: (args) => <cylinderGeometry args={[1, 1, 2, 64]} />, 
    scale: 1,
    uvScale: [1, 1.5]  // Adjusted UV scale for cylinder
  }
}

// Material types with their properties
const materialTypes = {
  standard: ({ color = "#FFFFFF", metalness, roughness }) => (
    <meshStandardMaterial 
      color={color} 
      metalness={metalness} 
      roughness={roughness} 
    />
  ),
  abstract: ({ color = "#FFFFFF", uvScale = [1, 1] }) => {
    // Load abstract textures
    const textures = useLoader(TextureLoader, [
      '/textures/abstract/color.jpg',
      '/textures/abstract/normal.jpg',
      '/textures/abstract/roughness.jpg',
      '/textures/abstract/ao.jpg'
    ]);
    
    // Destructure after ensuring textures are loaded
    const [colorMap, normalMap, roughnessMap, aoMap] = textures;
    
    // Apply texture settings with UV scaling
    textures.forEach(texture => {
      if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(uvScale[0], uvScale[1]);
        texture.anisotropy = 16; // Improve texture quality
      }
    });
    
    return (
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        aoMap={aoMap}
        color={color}
      />
    )
  },
  metal: ({ color = "#FFFFFF", uvScale = [1, 1] }) => {
    // Load metal textures
    const textures = useLoader(TextureLoader, [
      '/textures/metal/color.png',
      '/textures/metal/normal.png',
      '/textures/metal/metallic.png',
      '/textures/metal/roughness.png'
    ]);
    
    // Destructure after ensuring textures are loaded
    const [colorMap, normalMap, metalnessMap, roughnessMap] = textures;
    
    // Apply texture settings with UV scaling
    textures.forEach(texture => {
      if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(uvScale[0], uvScale[1]);
        texture.anisotropy = 16; // Improve texture quality
      }
    });
    
    return (
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        metalnessMap={metalnessMap}
        roughnessMap={roughnessMap}
        color={color}
      />
    )
  },
  wood: ({ color = "#FFFFFF", uvScale = [1, 1] }) => {
    // Load wood textures
    const textures = useLoader(TextureLoader, [
      '/textures/wood/color.png',
      '/textures/wood/normal.png',
      '/textures/wood/roughness.png',
      '/textures/wood/ao.png'
    ])
    
    // Destructure after ensuring textures are loaded
    const [colorMap, normalMap, roughnessMap, aoMap] = textures;
    
    // Apply texture settings with UV scaling
    textures.forEach(texture => {
      if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(uvScale[0], uvScale[1]);
        texture.anisotropy = 16; // Improve texture quality
      }
    });
    
    return (
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        aoMap={aoMap}
        color={color}
      />
    )
  },
  wallStone: ({ color = "#FFFFFF", uvScale = [1, 1] }) => {
    // Load wall stone textures
    const [colorMap, normalMap, roughnessMap, aoMap, ] = useLoader(TextureLoader, [
      '/textures/wallstone/color.png',
      '/textures/wallstone/normal.png',
      '/textures/wallstone/roughness.png',
      '/textures/wallstone/height.png',
      '/textures/wallstone/ao.png',
    ])
    
    // Set repeat for texture tiling with UV scaling
    const textures = [colorMap, normalMap, roughnessMap, aoMap, ];
    textures.forEach(texture => {
      if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2 * uvScale[0], 2 * uvScale[1]); // Adjust repeat values based on UV scale
        texture.anisotropy = 16; // Improve texture quality
      }
    });
    
    return (
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        aoMap={aoMap}
        color={color}
      />
    )
  }
}

// Fallback material if textures fail to load
const FallbackMaterial = ({ color = "#FFFFFF", metalness = 0.6, roughness = 0.4 }) => (
  <meshStandardMaterial 
    color={color} 
    metalness={metalness} 
    roughness={roughness} 
  />
)

// The main Shape component
export function Shape({ config }) {
  const shapeRef = useRef()
  const geometryRef = useRef()
  const [autoRotate, setAutoRotate] = useState(true)
  
  // Get current shape config
  const currentShape = shapeConfigs[config.shape] || shapeConfigs.sphere
  
  // Create spring animation for morphing
  const springProps = useSpring({
    scale: currentShape.scale,
    config: {
      mass: 1,
      tension: 170,
      friction: 26
    }
  })

  // Compute vertex normals for smoother appearance
  useEffect(() => {
    if (shapeRef.current && shapeRef.current.geometry) {
      shapeRef.current.geometry.computeVertexNormals();
    }
  }, [config.shape]);

  // Set up auto-rotation
  useFrame((state, delta) => {
    if (shapeRef.current && autoRotate) {
      shapeRef.current.rotation.y += delta * 0.5
    }
  })

  // Render appropriate material or fallback to standard
  const Material = () => {
    try {
      if (!materialTypes[config.material]) {
        console.warn("Unknown material type:", config.material)
        return <FallbackMaterial {...config} />
      }
      
      const MaterialComponent = materialTypes[config.material]
      // Pass the UV scale from the current shape to the material
      return <MaterialComponent {...config} uvScale={currentShape.uvScale} />
    } catch (error) {
      console.error("Error loading material:", error)
      return <FallbackMaterial {...config} />
    }
  }

  return (
    <group>
      {/* Single ambient light for base illumination */}
      <ambientLight intensity={0.5} />
      
      {/* Single directional light - removed the second light */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1.0} 
        castShadow 
      />
      
      <animated.mesh 
        ref={shapeRef} 
        position={[0, 0, 0]}
        scale={springProps.scale}
        onClick={() => setAutoRotate(!autoRotate)} // Toggle auto-rotation
        castShadow
        receiveShadow
      >
        {React.cloneElement(currentShape.geometry(), {
          ref: geometryRef,
          attach: "geometry",
          flatShading: false,
        })}
        <Material />
      </animated.mesh>
    </group>
  )
}