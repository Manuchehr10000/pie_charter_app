"use client"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
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
    cutout: '25%', // Make it a doughnut chart with 25% cutout
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          boxWidth: 20,
          padding: 15,
          font: {
            size: 18
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
        titleFont: {
          size: 16
        },
        bodyFont: {
          size: 16
        },
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
      padding: 20
    },
    radius: '100%' // Maximum chart radius
  }

  return (
    <div className="h-[600px]">
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  )
}

export default PieChart