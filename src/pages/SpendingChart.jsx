import { Doughnut } from "react-chartjs-2"
import ChartDataLabels from "chartjs-plugin-datalabels"
import { Chart as ChartJS } from "chart.js/auto"
import { useState, useEffect } from "react"
import { auth } from "../state/store"

ChartJS.register(ChartDataLabels)

export default function SpendingChart() {



  const [categoryTotals, setCategoryTotals] = useState(auth.state.categoryTotals)

  useEffect(() => {
    const interval = setInterval(() => {
      setCategoryTotals({ ...auth.state.categoryTotals })
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const filteredData = Object.entries(categoryTotals)
    .filter(([cat, val]) => val > 0)

  const categories = filteredData.map(([cat]) => cat)
  const values = filteredData.map(([_, val]) => val)

  const isEmpty = values.length === 0
  const labels = isEmpty ? ["No Spending"] : categories
  const dataValues = isEmpty ? [1] : values



  const data = {
    labels,
    datasets: [
      {
        label: "Spending",
        data: values,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderColor: "#fff",
        borderWidth: 2,
        cutout: "60%",
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: { label: (ctx) => `₹${ctx.raw}` },
      },
      datalabels: {
        color: "#fff",
        align: "center",
        anchor: "center",
        formatter: (value, ctx) => ctx.chart.data.labels[ctx.dataIndex],
        font: { size: 12, weight: "bold" },
      },
    },
  }

  const centerText = {
    id: "centerText",
    beforeDraw: (chart) => {
      const { width, height } = chart
      const ctx = chart.ctx
      ctx.restore()

      let total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0)
      if (total === 1) total = 0  // <-- set to 0 if placeholder

      ctx.fillStyle = "#666"
      ctx.font = "bold 1.4em Arial"
      ctx.textBaseline = "middle"
      const totalLabel = "Total:"
      ctx.fillText(
        totalLabel,
        Math.round((width - ctx.measureText(totalLabel).width) / 2),
        height / 2 - 10
      )

      ctx.fillStyle = "#666"
      ctx.font = "700 1.8em 'Source Code Pro', monospace"
      ctx.fillText(
        `₹${total}`,
        Math.round((width - ctx.measureText(`₹${total}`).width) / 2),
        height / 2 + 15
      )
      ctx.save()
    },
  }


  return (
    <div className="card" >
      <h3>Spending</h3>
      <div style={{ width: "350px", margin: "0 auto", paddingBottom: "15px" }}>
        <Doughnut data={data} options={options} plugins={[centerText]} />
      </div>

    </div>
  )
}
