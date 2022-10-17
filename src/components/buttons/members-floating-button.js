import React from 'react'
import { NavLink } from 'react-router-dom'

const FloatingMembersButton = () => {

    const pagePath = window.location.pathname
    const clubName = pagePath.split('/')[2]
    const clubId = pagePath.split('/')[3]

    return (
        <div className="fixed-action-btn">
            <NavLink to={`/clubs/${clubName}/${clubId}/members/form`} className="btn-floating btn-large waves-effect blue modal-trigger">
                <i className="large material-icons">add</i>
            </NavLink>
            
        </div>
    )
}

export default FloatingMembersButton