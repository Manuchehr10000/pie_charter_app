"use client"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { ChartData } from '@/types/types'

ChartJS.register(ArcElement, Tooltip, Legend)

interface PieChartProps {
  data: ChartData[]
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  // Sort data by value in descending order
  const sortedData = [...data].sort((a, b) => b.value - a.value)
  const total = sortedData.reduce((sum, item) => sum + item.value, 0)

  const chartData = {
    labels: sortedData.map(item => item.label),
    datasets: [
      {
        data: sortedData.map(item => item.value),
        backgroundColor: sortedData.map(item => item.color),
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          padding: 8,
          font: {
            size: 14
          },
          generateLabels: (chart: any) => {
            const data = chart.data
            return data.labels.map((label: string, index: number) => {
              const value = data.datasets[0].data[index]
              const percentage = ((value / total) * 100).toFixed(1)
              return {
                text: `${label} (${percentage}%)`,
                fillStyle: data.datasets[0].backgroundColor[index],
                hidden: false,
                index: index
              }
            })
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw
            const percentage = ((value / total) * 100).toFixed(1)
            return `${context.label}: ${value} (${percentage}%)`
          }
        }
      }
    },
    rotation: 0, // Start at 3 o'clock
    layout: {
      padding: 5
    }
  }

  return (
    <div className="h-[403px]">
      <Pie data={chartData} options={chartOptions} />
    </div>
  )
}

export default PieChart