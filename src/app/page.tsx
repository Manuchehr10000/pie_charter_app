"use client"

import { useState, useEffect } from 'react'
import PieChart from '@/components/PieChart'
import DataTable from '@/components/DataTable'
import { ChartData } from '@/types/types'
import SketchContainer from '@/components/SketchContainer'

export default function Home() {
  const [chartData, setChartData] = useState<ChartData[]>([
    { id: 1, label: 'Apples', value: 35, color: '#ff6384' },
    { id: 2, label: 'Oranges', value: 25, color: '#ff9f40' },
    { id: 3, label: 'Bananas', value: 20, color: '#ffcd56' },
    { id: 4, label: 'Grapes', value: 15, color: '#4bc0c0' },
    { id: 5, label: 'Berries', value: 5, color: '#36a2eb' },
  ])

  const handleUpdate = (updatedData: ChartData[]) => {
    setChartData(updatedData)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center font-indie-flower">Pie Charter</h1>
        
        <SketchContainer>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex justify-center items-center">
              <PieChart data={chartData} />
            </div>
            <div>
              <DataTable data={chartData} onUpdate={handleUpdate} />
            </div>
          </div>
        </SketchContainer>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Edit the table values to update the pie chart in real-time</p>
        </div>
      </div>
    </main>
  )
}