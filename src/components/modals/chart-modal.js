import React from 'react'

const ChartModal = ({ id, children }) => {

    return (
        <div id={id} className="modal">
            <div className="modal-content">
                {children}
            </div>
    </div>
    )
}

export default ChartModal