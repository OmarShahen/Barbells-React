import React from 'react'
import Chart from 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import './chart.css'

const LineChart = ({ title, labels, data, color, hideCard }) => {

    return (

            <Line
            data={{
                labels,
                datasets: [{
                    data,
                    borderColor: color,
                    tension: 0.0,
                    fill: false,
                    label: title || '',
                }],
                transitions: {
                    zoom: {
                      animation: {
                        duration: 1000,
                        easing: 'easeOutCubic'
                      }
                    }
                  }
            }}

            options={{
              scales: {
                x: {
                  beginAtZero: true
                }
              }
            }}

            />
    )
}

export default LineChart