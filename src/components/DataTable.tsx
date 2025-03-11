"use client"

import { useState, useEffect, useRef } from 'react'
import { ChartData } from '@/types/types'
import rough from 'roughjs'

interface DataTableProps {
  data: ChartData[]
  onUpdate: (data: ChartData[]) => void
}

const DataTable: React.FC<DataTableProps> = ({ data, onUpdate }) => {
  const [tableData, setTableData] = useState<ChartData[]>(data)
  const tableRef = useRef<HTMLTableElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!tableRef.current || !canvasRef.current) return

    const table = tableRef.current
    const canvas = canvasRef.current
    const rc = rough.canvas(canvas)

    // Set canvas size to match table
    const resizeCanvas = () => {
      const rect = table.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      // Draw the table borders with a sketch style
      const cells = table.querySelectorAll('th, td')
      cells.forEach(cell => {
        const cellRect = cell.getBoundingClientRect()
        const relativeX = cellRect.left - rect.left
        const relativeY = cellRect.top - rect.top

        rc.rectangle(
          relativeX, 
          relativeY, 
          cellRect.width, 
          cellRect.height, 
          { 
            stroke: '#333',
            strokeWidth: 1,
            roughness: 1.5,
            fillStyle: 'solid',
            fill: 'rgba(255, 255, 255, 0.3)'
          }
        )
      })
    }

    // Initial draw and resize handler
    setTimeout(resizeCanvas, 100) // Wait for layout to be completed
    window.addEventListener('resize', resizeCanvas)

    // Redraw when tableData changes
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [tableData])

  const handleInputChange = (id: number, field: keyof ChartData, value: string | number) => {
    const updatedData = tableData.map(item => {
      if (item.id === id) {
        if (field === 'value') {
          // Ensure value is a number and positive
          const numValue = parseFloat(value as string)
          return { ...item, [field]: isNaN(numValue) ? 0 : Math.max(0, numValue) }
        }
        return { ...item, [field]: value }
      }
      return item
    })
    
    setTableData(updatedData)
    onUpdate(updatedData)
  }

  const addRow = () => {
    const newId = Math.max(...tableData.map(item => item.id), 0) + 1
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`
    
    const newRow: ChartData = {
      id: newId,
      label: `Item ${newId}`,
      value: 10,
      color: randomColor
    }
    
    const updatedData = [...tableData, newRow]
    setTableData(updatedData)
    onUpdate(updatedData)
  }

  const removeRow = (id: number) => {
    if (tableData.length <= 1) return
    
    const updatedData = tableData.filter(item => item.id !== id)
    setTableData(updatedData)
    onUpdate(updatedData)
  }

  return (
    <div className="sketch-table-container relative">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none" 
      />
      <table ref={tableRef} className="sketch-table w-full relative z-10">
        <thead>
          <tr>
            <th className="text-left">Label</th>
            <th className="text-left">Color</th>
            <th className="text-left">Value</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map(item => (
            <tr key={item.id}>
              <td>
                <input
                  type="text"
                  className="sketch-input"
                  value={item.label}
                  onChange={(e) => handleInputChange(item.id, 'label', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="color"
                  className="sketch-input w-full h-8"
                  value={item.color}
                  onChange={(e) => handleInputChange(item.id, 'color', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="sketch-input"
                  value={item.value}
                  min="0"
                  onChange={(e) => handleInputChange(item.id, 'value', e.target.value)}
                />
              </td>
              <td className="text-right">
                <button 
                  onClick={() => removeRow(item.id)}
                  className="sketch-button p-1 text-red-500"
                  disabled={tableData.length <= 1}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="text-right pt-4">
              <button 
                onClick={addRow} 
                className="sketch-button bg-gray-100 px-4 py-2 rounded-lg"
              >
                + Add Item
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default DataTable