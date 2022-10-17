import React from 'react'

const Dropdown = ({ id, children }) => {

    return (
        <div id={id} className="dropdown-content white">
            {children}
        </div>
    )
}

export default Dropdown