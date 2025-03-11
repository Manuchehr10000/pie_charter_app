"use client"

import { useState, useRef, useEffect } from 'react'
import { ChartData } from '@/types/types'

const PRESET_COLORS = [
  '#4E79A7', // Blue
  '#F28E2B', // Orange
  '#E15759', // Red
  '#76B7B2', // Teal
  '#59A14F', // Green
  '#EDC948', // Yellow
  '#B07AA1', // Purple
  '#FF9DA7', // Pink
  '#9C755F', // Brown
  '#BAB0AC'  // Gray
]

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  usedColors: string[]
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, usedColors }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleButtonClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      })
    }
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        className="w-full h-8 border rounded flex items-center gap-2 px-2 bg-white hover:bg-gray-50"
        onClick={handleButtonClick}
        type="button"
      >
        <div 
          className="w-5 h-5 rounded-sm shadow-sm"
          style={{ backgroundColor: value }}
        />
        <div className="ml-auto">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {isOpen && (
        <div 
          className="fixed bg-white border rounded-lg shadow-lg p-3 z-50"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
        >
          <div className="grid grid-cols-5 gap-2">
            {PRESET_COLORS.filter(color => !usedColors.includes(color) || color === value).map(color => {
              const isSelected = value === color
              return (
                <button
                  key={color}
                  className={`
                    w-6 h-6 rounded-md transition-all duration-150 shadow-sm
                    hover:scale-110 hover:shadow-md
                    ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                  `}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onChange(color)
                    setIsOpen(false)
                  }}
                  type="button"
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

interface DataTableProps {
  data: ChartData[]
  onDataUpdate: (data: ChartData[]) => void
}

const DataTable: React.FC<DataTableProps> = ({ data, onDataUpdate }) => {
  // Constants for row limits
  const MIN_ROWS = 3;
  const MAX_ROWS = 10;

  useEffect(() => {
    if (data.length === 0) {
      // Default to 5 rows, but ensure it's at least MIN_ROWS
      const rowCount = Math.max(5, MIN_ROWS);
      
      const defaultData = Array.from({ length: rowCount }, (_, i) => ({
        id: i + 1,
        label: `Category ${i + 1}`,
        value: 5,
        color: PRESET_COLORS[i % PRESET_COLORS.length]
      }))
      onDataUpdate(defaultData)
    }
  }, [])

  const handleDelete = (id: number) => {
    // Only allow deletion if we have more than MIN_ROWS
    if (data.length <= MIN_ROWS) {
      alert(`You must have at least ${MIN_ROWS} categories.`);
      return;
    }
    
    // Allow deletion of rows without auto-replacement
    onDataUpdate(data.filter(item => item.id !== id))
  }

  const handleAdd = () => {
    // Only allow adding if we have fewer than MAX_ROWS
    if (data.length >= MAX_ROWS) {
      alert(`You can have a maximum of ${MAX_ROWS} categories.`);
      return;
    }
    
    const newId = Math.max(...data.map(item => item.id), 0) + 1
    const availableColor = PRESET_COLORS.find(color => 
      !data.map(item => item.color).includes(color)
    ) || PRESET_COLORS[0]

    // Find the highest category number
    let highestNumber = 0
    data.forEach(item => {
      const match = /Category (\d+)/.exec(item.label)
      if (match && match[1]) {
        const num = parseInt(match[1], 10)
        if (num > highestNumber) highestNumber = num
      }
    })

    onDataUpdate([
      ...data,
      {
        id: newId,
        label: `Category ${highestNumber + 1}`,
        value: 5,
        color: availableColor
      }
    ])
  }

  const handleStartOver = () => {
    if (window.confirm('Are you sure you want to reset the data to default values?')) {
      // Use 5 rows by default, but ensure it's within limits
      const rowCount = Math.min(Math.max(5, MIN_ROWS), MAX_ROWS);
      
      const defaultData = Array.from({ length: rowCount }, (_, i) => ({
        id: i + 1,
        label: `Category ${i + 1}`,
        value: 5,
        color: PRESET_COLORS[i % PRESET_COLORS.length]
      }))
      onDataUpdate(defaultData)
    }
  }

  const handleUpdate = (id: number, field: keyof ChartData, value: any) => {
    onDataUpdate(data.map(item => {
      if (item.id === id) {
        if (field === 'value') {
          const hasSpecialName = item.label.toLowerCase().includes('manu') || 
                                item.label.toLowerCase().includes('manuchehr')
          
          if (hasSpecialName) {
            // Convert to number and round to nearest integer
            const numValue = Math.round(Number(value))
            // Only allow 10, 11, 12, or 13
            if ([10, 11, 12, 13].includes(numValue)) {
              value = numValue
            } else {
              // Default to 10 if invalid value
              value = 10
            }
          } else {
            // Regular categories: 1-10 range
            value = Math.max(1, Math.min(10, Number(value) || 1))
          }
        }
        return { ...item, [field]: value }
      }
      return item
    }))
  }

  return (
    <table className="w-full">
      <tbody>
        {data.map(item => {
          const hasSpecialName = item.label.toLowerCase().includes('manu') || 
                                item.label.toLowerCase().includes('manuchehr')
          return (
          <tr key={item.id}>
            <td className="w-[60%]">
              <input
                type="text"
                value={item.label}
                onChange={e => handleUpdate(item.id, 'label', e.target.value)}
                className="border p-1 w-full"
              />
            </td>
            <td className="w-[15%]">
              <select
                value={item.value}
                onChange={e => handleUpdate(item.id, 'value', e.target.value)}
                className="border p-1 w-full"
              >
                {hasSpecialName ? (
                  // Options 10-13 for special categories
                  [10, 11, 12, 13].map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))
                ) : (
                  // Options 1-10 for regular categories
                  Array.from({ length: 10 }, (_, i) => i + 1).map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))
                )}
              </select>
            </td>
            <td className="w-[15%]">
              <ColorPicker
                value={item.color}
                onChange={color => handleUpdate(item.id, 'color', color)}
                usedColors={data.filter(d => d.id !== item.id).map(d => d.color)}
              />
            </td>
            <td className="w-[10%] text-center">
              {data.length > MIN_ROWS && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </td>
          </tr>
        )})}
        <tr>
          <td colSpan={4} className="pt-4">
            {data.length < MAX_ROWS ? (
              <button
                onClick={handleAdd}
                className="bg-blue-500 text-white px-2 py-1 rounded w-full mb-3"
              >
                Add Row
              </button>
            ) : (
              <div className="text-gray-500 text-center mb-3 text-sm">
                Maximum of {MAX_ROWS} categories reached
              </div>
            )}
          </td>
        </tr>
        <tr>
          <td colSpan={4}>
            <button
              onClick={handleStartOver}
              className="bg-gray-500 text-white px-2 py-1 rounded w-full"
            >
              Start Over
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default DataTable