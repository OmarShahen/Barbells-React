import React from 'react'
import { NavLink } from 'react-router-dom'

const FloatingPackagesButton = () => {

    const pagePath = window.location.pathname
    const clubName = pagePath.split('/')[2]
    const clubId = pagePath.split('/')[3]

    return (
        <div className="fixed-action-btn">
            <a className="btn-floating btn-large waves-effect blue modal-trigger scale-transition scale-in" href="#package-form-modal">
                <i className="large material-icons">add</i>
            </a>
        </div>
    )
}

export default FloatingPackagesButton