"use client"

import { useState, useEffect } from 'react'
import PieChart from '@/components/PieChart'
import DataTable from '@/components/DataTable'
import { ChartData } from '@/types/types'

const DEFAULT_DATA: ChartData[] = [
  { id: 1, label: 'Category A', value: 30, color: '#4E79A7' },
  { id: 2, label: 'Category B', value: 25, color: '#F28E2B' },
  { id: 3, label: 'Category C', value: 20, color: '#E15759' },
  { id: 4, label: 'Category D', value: 15, color: '#76B7B2' },
  { id: 5, label: 'Category E', value: 10, color: '#59A14F' },
]

const ensureFiveRows = (data: ChartData[]): ChartData[] => {
  if (data.length >= 5) return data

  const usedIds = new Set(data.map(item => item.id))
  const usedColors = new Set(data.map(item => item.color))
  
  const availableColors = DEFAULT_DATA
    .map(item => item.color)
    .filter(color => !usedColors.has(color))

  const newRows = Array.from({ length: 5 - data.length }, (_, index) => {
    let newId = 1
    while (usedIds.has(newId)) newId++
    usedIds.add(newId)

    return {
      id: newId,
      label: `Category ${newId}`,
      value: 10,
      color: availableColors[index] || DEFAULT_DATA[index].color
    }
  })

  return [...data, ...newRows]
}

export default function Home() {
  const [chartData, setChartData] = useState<ChartData[]>(DEFAULT_DATA)
  const [isClient, setIsClient] = useState(false)
  const [title, setTitle] = useState("Pie Chart Data")

  useEffect(() => {
    setIsClient(true)
    const savedData = localStorage.getItem('pieChartData')
    const savedTitle = localStorage.getItem('chartTitle')
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setChartData(ensureFiveRows(parsedData))
    }
    if (savedTitle) {
      setTitle(savedTitle)
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('pieChartData', JSON.stringify(chartData))
      localStorage.setItem('chartTitle', title)
    }
  }, [chartData, isClient, title])

  const handleDataUpdate = (newData: ChartData[]) => {
    setChartData(ensureFiveRows(newData))
  }

  if (!isClient) {
    return null
  }

  return (
    <main className="container mx-auto p-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-2xl font-bold mb-6 text-center w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-gray-500 focus:outline-none transition-colors"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <PieChart data={chartData} />
        </div>
        <div>
          <DataTable data={chartData} onDataUpdate={handleDataUpdate} />
        </div>
      </div>
    </main>
  )
}