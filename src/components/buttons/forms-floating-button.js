import React from 'react'

const FloatingFormsButton = ({ modalId }) => {

    return (
        <div className="fixed-action-btn">
            <a href={`#${modalId}`} className="btn-floating btn-large blue modal-trigger">
                <i className="large material-icons">add</i>
            </a>   
        </div>
    )
}

export default FloatingFormsButton