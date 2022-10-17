import React from 'react'

const Modal = ({ id, children }) => {

    return (
        <div id={id} className="modal white">
            <div className="modal-content">
                {children}
            </div>
    </div>
    )
}

export default Modal