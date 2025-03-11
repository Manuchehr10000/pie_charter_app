"use client"

import React, { useRef, useEffect } from 'react'
import rough from 'roughjs'

interface SketchContainerProps {
  children: React.ReactNode
}

const SketchContainer: React.FC<SketchContainerProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return

    const container = containerRef.current
    const canvas = canvasRef.current
    const rc = rough.canvas(canvas)

    // Set canvas size to match container
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      // Draw the sketch border and background
      rc.rectangle(0, 0, rect.width, rect.height, { 
        fill: 'rgba(255, 255, 255, 0.7)',
        fillStyle: 'solid',
        roughness: 1.5,
        stroke: '#333',
        strokeWidth: 2
      })
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div ref={containerRef} className="sketch-container relative p-8 rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
      <div className="relative z-10 overflow-hidden">
        {children}
      </div>
    </div>
  )
}

export default SketchContainer