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
            {PRESET_COLORS.map(color => {
              const isUsed = usedColors.includes(color)
              const isSelected = value === color
              return (
                <button
                  key={color}
                  className={`
                    w-6 h-6 rounded-md transition-all duration-150 shadow-sm
                    ${isUsed ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 hover:shadow-md'}
                    ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                  `}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    if (!isUsed) {
                      onChange(color)
                      setIsOpen(false)
                    }
                  }}
                  disabled={isUsed}
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
  useEffect(() => {
    if (data.length === 0) {
      const defaultData = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        label: `Item ${i + 1}`,
        value: 5,
        color: PRESET_COLORS[i]
      }))
      onDataUpdate(defaultData)
    }
  }, [])

  const handleDelete = (id: number) => {
    onDataUpdate(data.filter(item => item.id !== id))
  }

  const handleAdd = () => {
    const newId = Math.max(...data.map(item => item.id), 0) + 1
    const availableColor = PRESET_COLORS.find(color => 
      !data.map(item => item.color).includes(color)
    ) || PRESET_COLORS[0]

    onDataUpdate([
      ...data,
      {
        id: newId,
        label: '',
        value: 5,
        color: availableColor
      }
    ])
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
            <td className="w-1/3">
              <input
                type="text"
                value={item.label}
                onChange={e => handleUpdate(item.id, 'label', e.target.value)}
                className="border p-1 w-full"
              />
            </td>
            <td className="w-1/4">
              <input
                type="number"
                value={item.value}
                onChange={e => handleUpdate(item.id, 'value', e.target.value)}
                min={hasSpecialName ? "10" : "1"}
                max={hasSpecialName ? "13" : "10"}
                step={hasSpecialName ? "1" : "1"}
                list={hasSpecialName ? `values-${item.id}` : undefined}
                className="border p-1 w-full"
              />
              {hasSpecialName && (
                <datalist id={`values-${item.id}`}>
                  <option value="10" />
                  <option value="11" />
                  <option value="12" />
                  <option value="13" />
                </datalist>
              )}
            </td>
            <td className="w-1/4">
              <ColorPicker
                value={item.color}
                onChange={color => handleUpdate(item.id, 'color', color)}
                usedColors={data.filter(d => d.id !== item.id).map(d => d.color)}
              />
            </td>
            <td className="w-[100px]">
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-500 text-white px-2 py-1 rounded w-full"
              >
                Delete
              </button>
            </td>
          </tr>
        )})}
        <tr>
          <td colSpan={4}>
            <button
              onClick={handleAdd}
              className="bg-blue-500 text-white px-2 py-1 rounded w-full"
            >
              Add Row
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default DataTable