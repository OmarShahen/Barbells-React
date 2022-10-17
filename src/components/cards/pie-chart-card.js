import React from 'react'
import PieChart from '../charts/pie-chart'


const PieChartCard = () => {
    return (
        <>
        <div className="graph-container">
            <PieChart
            title={'Ride It'}
            labels={['1', '2']}
            data={['1', '2']} 
            />
            <div>
                Omar Reda
            </div>
        </div>
        </>
    )
}

export default PieChartCard