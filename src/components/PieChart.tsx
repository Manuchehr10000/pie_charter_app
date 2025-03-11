"use client"

import { useRef, useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { ChartData } from '@/types/types'
import rough from 'roughjs'

ChartJS.register(ArcElement, Tooltip, Legend)

// Custom plugin to apply the sketch style to the chart
const sketchPlugin = {
  id: 'sketchPlugin',
  afterDraw: (chart: any) => {
    const ctx = chart.ctx
    const rc = rough.canvas(ctx.canvas)
    const width = chart.chartArea.width
    const height = chart.chartArea.height
    const centerX = chart.chartArea.left + width / 2
    const centerY = chart.chartArea.top + height / 2
    const radius = Math.min(width, height) / 2

    // Draw a rough circle outline around the pie chart
    rc.circle(centerX, centerY, radius * 2, {
      stroke: '#333',
      strokeWidth: 1,
      roughness: 2,
      bowing: 2
    })

    // Add rough borders to each segment
    const meta = chart.getDatasetMeta(0)
    meta.data.forEach((arc: any, i: number) => {
      const startAngle = arc.startAngle
      const endAngle = arc.endAngle
      const mid = (startAngle + endAngle) / 2
      
      const x = centerX + Math.cos(mid) * radius * 0.65
      const y = centerY + Math.sin(mid) * radius * 0.65
      
      const dataValue = chart.data.datasets[0].data[i]
      const total = chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0)
      const percentage = Math.round((dataValue / total) * 100)
      
      // Draw a rough line from center to segment
      rc.line(centerX, centerY, centerX + Math.cos(mid) * radius, centerY + Math.sin(mid) * radius, {
        stroke: '#333',
        strokeWidth: 1,
        roughness: 1.5
      })
    })
  }
}

interface PieChartProps {
  data: ChartData[]
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const chartRef = useRef<any>(null)

  useEffect(() => {
    // Register the sketch plugin
    if (!ChartJS.registry.plugins.get('sketchPlugin')) {
      ChartJS.register(sketchPlugin)
    }
  }, [])

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color),
        borderColor: '#333',
        borderWidth: 1,
        hoverOffset: 4,
      }
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: '"Indie Flower", cursive, system-ui, sans-serif',
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== undefined) {
              label += context.parsed + ' (';
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = Math.round((context.parsed / total) * 100);
              label += percentage + '%)';
            }
            return label;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <Pie 
        ref={chartRef}
        data={chartData} 
        options={chartOptions}
      />
    </div>
  )
}

export default PieChart