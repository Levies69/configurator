import React, { useEffect, useState } from 'react'
import '../Sidebar.css'

const Sidebar = ({ shapeConfig, onConfigChange }) => {
  // Add state to track if sidebar is open or closed
  const [isOpen, setIsOpen] = useState(true);
  
  // Add state to track which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    shape: false,
    material: false,
    color: false,
    properties: false
  });
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  // Shape options
  const shapes = [
    { id: 'sphere', name: 'Sphere' },
    { id: 'cube', name: 'Cube' },
    { id: 'torus', name: 'Torus' },
    { id: 'cone', name: 'Cone' },
    { id: 'cylinder', name: 'Cylinder' }
  ]

  // Material options with image paths
  const materials = [
    { id: 'standard', name: 'Standard' },
    { id: 'abstract', name: 'Abstract', imagePath: '/textures/abstract/color.jpg' },
    { id: 'metal', name: 'Metal', imagePath: '/textures/metal/color.jpg' },
    { id: 'wood', name: 'Wood', imagePath: '/textures/wood/color.png' },
    { id: 'wallStone', name: 'Wall Stone', imagePath: '/textures/wallstone/color.png' }
  ]

  // Color presets
  const colorPresets = [
    { id: '#ffffff', name: 'White' },
    { id: '#3498db', name: 'Blue' },
    { id: '#2ecc71', name: 'Green' },
    { id: '#e74c3c', name: 'Red' },
    { id: '#9b59b6', name: 'Purple' },
    { id: '#f1c40f', name: 'Yellow' }
  ]

  // Set default color to white on component mount if no color is set
  useEffect(() => {
    if (!shapeConfig.color) {
      onConfigChange({ color: '#ffffff' });
    }
  }, []);

  // Handle changes
  const handleShapeChange = (shape) => {
    console.log("Shape changed to:", shape)
    onConfigChange({ shape })
  }

  const handleMaterialChange = (material) => {
    console.log("Material changed to:", material)
    onConfigChange({ material })
  }

  const handleColorChange = (color) => {
    console.log("Color preset changed to:", color)
    onConfigChange({ color })
  }

  const handleCustomColorChange = (e) => {
    console.log("Custom color changed to:", e.target.value)
    onConfigChange({ color: e.target.value })
  }

  const handleMetalnessChange = (e) => {
    onConfigChange({ metalness: parseFloat(e.target.value) })
  }

  const handleRoughnessChange = (e) => {
    onConfigChange({ roughness: parseFloat(e.target.value) })
  }

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      right: 0,
      height: '100vh',
      zIndex: 10
    }}>
      {/* Toggle button - now outside the sidebar */}
      <button 
        style={{
          position: 'fixed',
          right: isOpen ? '300px' : '0px',
          top: '10px',
          width: '40px',
          height: '40px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: isOpen ? '4px 0 0 4px' : '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          zIndex: 11,
          transition: 'right 0.3s'
        }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
      <div className="sidebar" style={{ 
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
        overflowX: 'hidden',
        width: '300px',
        maxWidth: '85vw',
        height: '100%',
        backgroundColor: 'rgba(25, 25, 30, 0.8)',
        backdropFilter: 'blur(8px)',
        color: 'white',
        boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Sidebar content */}
        <div style={{ 
          padding: '20px',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch', // Enable momentum scrolling on iOS
          msOverflowStyle: 'none', // Hide scrollbar in IE and Edge
          scrollbarWidth: 'thin' // Thin scrollbar in Firefox
        }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>3D Configurator</h1>
          
          <section className="config-section">
            <div 
              className="section-header" 
              onClick={() => toggleSection('shape')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <h2 style={{ margin: 0 }}>Shape</h2>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ 
                  transform: expandedSections.shape ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {expandedSections.shape && (
              <div className="option-buttons" style={{ marginTop: '10px' }}>
                {shapes.map(shape => (
                  <button 
                    key={shape.id}
                    className={shapeConfig.shape === shape.id ? 'active' : ''}
                    onClick={() => handleShapeChange(shape.id)}
                  >
                    {shape.name}
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="config-section">
            <div 
              className="section-header" 
              onClick={() => toggleSection('material')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <h2 style={{ margin: 0 }}>Material</h2>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ 
                  transform: expandedSections.material ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {expandedSections.material && (
              <div className="material-presets" style={{ marginTop: '10px' }}>
                {materials.map(material => (
                  <div 
                    key={material.id}
                    className={`material-swatch ${shapeConfig.material === material.id ? 'active' : ''}`}
                    onClick={() => handleMaterialChange(material.id)}
                    title={material.name}
                    style={material.imagePath ? {
                      backgroundImage: `url(${material.imagePath})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    } : {
                      backgroundColor: '#888',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {!material.imagePath && <span>{material.name.charAt(0)}</span>}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="config-section">
            <div 
              className="section-header" 
              onClick={() => toggleSection('color')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <h2 style={{ margin: 0 }}>Color</h2>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ 
                  transform: expandedSections.color ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {expandedSections.color && (
              <div className="color-options" style={{ marginTop: '10px' }}>
                <div className="color-presets">
                  {colorPresets.map(color => (
                    <div 
                      key={color.id}
                      className={`color-swatch ${shapeConfig.color === color.id ? 'active' : ''}`}
                      style={{ backgroundColor: color.id }}
                      onClick={() => handleColorChange(color.id)}
                      title={color.name}
                    />
                  ))}
                </div>
                <div className="custom-color">
                  <input 
                    type="color" 
                    value={shapeConfig.color}
                    onChange={handleCustomColorChange}
                  />
                  <h2>Custom</h2>
                </div>
              </div>
            )}
          </section>

          {/* Material properties section - only show for standard material */}
          {shapeConfig.material === 'standard' && (
            <section className="config-section">
              <div 
                className="section-header" 
                onClick={() => toggleSection('properties')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <h2 style={{ margin: 0 }}>Material Properties</h2>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ 
                    transform: expandedSections.properties ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              {expandedSections.properties && (
                <div style={{ marginTop: '10px' }}>
                  <div className="slider-control">
                    <label>Metalness</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={shapeConfig.metalness}
                      onChange={handleMetalnessChange}
                    />
                    <span>{shapeConfig.metalness.toFixed(1)}</span>
                  </div>
                  <div className="slider-control">
                    <label>Roughness</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={shapeConfig.roughness}
                      onChange={handleRoughnessChange}
                    />
                    <span>{shapeConfig.roughness.toFixed(1)}</span>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar