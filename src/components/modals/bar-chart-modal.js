import React from 'react'

const BarChartModal = ({ children }) => {

    return (
        <div id="bar-chart-modal" className="modal">
            <div className="modal-content">
                { children }
            </div>
    </div>
    )
}

export default BarChartModal