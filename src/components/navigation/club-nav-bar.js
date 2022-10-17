import React from 'react'
import './nav-bar.css'
import { NavLink } from 'react-router-dom'

const ClubNavBar = () => {

    const pagePath = window.location.pathname
    const clubName = pagePath.split('/')[2]
    const clubId = pagePath.split('/')[3]
    const pageName = pagePath.split('/')[4]
    

    return (
        <div className="club-nav-bar white">
            <div className={pageName === 'staffs' ? 'active-tab':''}>
                <NavLink to={`/app/clubs/${clubName}/${clubId}/staffs/main`}>
                    Staffs
                </NavLink>
            </div>
            <div className={pageName === 'freezed-registrations' ? 'active-tab':''}>
                <NavLink to={`/app/clubs/${clubName}/${clubId}/freezed-registrations/main`}>
                    Freezed Registrations
                </NavLink>
            </div>
            <div className={pageName === 'members' ? 'active-tab':''}>
                <NavLink to={`/app/clubs/${clubName}/${clubId}/members/main`}>
                    Members
                </NavLink>
            </div>
            <div className={pageName === 'registrations' ? 'active-tab':''}>
                <NavLink to={`/app/clubs/${clubName}/${clubId}/registrations/main`}>
                    Registrations
                </NavLink>
            </div>
            <div className={pageName === 'cancelled-registrations' ? 'active-tab':''}>
                <NavLink to={`/app/clubs/${clubName}/${clubId}/cancelled-registrations/main`}>
                    Cancelled Registrations
                </NavLink>
            </div>
            <div className={pageName === 'attendances' ? 'active-tab':''}>
                <NavLink to={`/app/clubs/${clubName}/${clubId}/attendances/main`}>
                    Attendances
                </NavLink>
            </div>
            <div className={pageName === 'cancelled-attendances' ? 'active-tab':''}>
                <NavLink to={`/app/clubs/${clubName}/${clubId}/cancelled-attendances/main`}>
                    Cancelled Attendances
                </NavLink>
            </div>
            <div className={pageName === 'packages' ? 'active-tab':''}>
                <NavLink to={`/app/clubs/${clubName}/${clubId}/packages/main`}>
                    Packages
                </NavLink>
            </div>
        </div>
    )
}

export default ClubNavBar