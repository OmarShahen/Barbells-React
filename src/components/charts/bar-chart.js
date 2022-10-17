import React from 'react'
import Chart from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'
import './chart.css'

const BarChart = ({ title, labels, data, color, axis }) => {

    if(!axis) axis = 'x'

    return (
            <Bar
            data={{
                labels,
                datasets: [{
                    data,
                    barPercentage: 0,
                    borderRadius: 0,
                    hoverBackgroundColor: 'dodgerblue',
                    barThickness: 10,
                    backgroundColor: [
                        
                    ],
                    borderColor: [
                        color
                    ],
                    borderWidth: 1
                }]
            }}

                options={{
                    animation: true,
                    indexAxis: axis,
                    plugins: {
                        title: {
                            display: true,
                            text: title,
                            fullSize: true
                        },
                        legend: {
                            display: false,
                            position: 'bottom'
                        }
                    },
                    transitions: {
                        zoom: {
                          animation: {
                            duration: 1000,
                            easing: 'easeOutCubic'
                          }
                        }
                      }
                }}
            />
    )
}

export default BarChart