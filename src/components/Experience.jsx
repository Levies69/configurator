import React from 'react'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'

// Import the Shape component instead of Sphere
import { Shape } from './Shape'

export default function Experience({ shapeConfig }) {
  return (
    <>
      {/* Add some ambient light */}
      <ambientLight intensity={0.5} />
      
      {/* Add directional light */}
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Add OrbitControls to enable user interaction, but disable zoom */}
      <OrbitControls enablePan={true} enableZoom={false} enableRotate={true} />
      
      {/* Use the Shape component and pass the configuration */}
      <Shape config={shapeConfig} />
    </>
  )
}