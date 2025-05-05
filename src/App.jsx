import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import './App.css'
import Experience from './components/Experience'
import Sidebar from './components/Sidebar'

function App() {
  const [shapeConfig, setShapeConfig] = useState({
    shape: 'sphere',
    material: 'standard',
    color: '#ff6600',
    metalness: 0.6,
    roughness: 0.4,
  })

  const handleConfigChange = (newConfig) => {
    console.log("Config changed:", {...shapeConfig, ...newConfig})
    setShapeConfig(prevConfig => ({...prevConfig, ...newConfig}))
  }

  return (
    <div className="App">
      <Canvas>
        <color attach="background" args={['#15151a']} />  
        <Experience shapeConfig={shapeConfig} />
      </Canvas>
      
      <Sidebar 
        shapeConfig={shapeConfig} 
        onConfigChange={handleConfigChange} 
      />
    </div>
  )
}

export default App