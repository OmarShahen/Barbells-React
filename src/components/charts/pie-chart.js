import React from 'react'
import Chart from 'chart.js/auto'
import { Doughnut } from 'react-chartjs-2'
import './chart.css'

const PieChart = ({ title, labels, data, colors }) => {

    return (
            <Doughnut
            data={{
                labels,
                datasets: [{
                  label: {title},
                  data,
                  backgroundColor: colors,
                  hoverOffset: 4,
                }]
              }}
              options={{
                responsive: true,
                aspectRatio: 1
              }}
            />
    )
}

export default PieChart