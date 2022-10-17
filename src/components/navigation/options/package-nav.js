import React, { useState, useEffect } from 'react'
import './app-nav-card.css'
import { NavLink } from 'react-router-dom'

const PackageNav = () => {

    const club = JSON.parse(localStorage.getItem('club'))


    return (
        <>
            <div className="row app-nav-card-container">
                <div className="app-nav-card-tab">
                    <span>Registrations</span>
                </div>
                <div className="divider"></div>
                <div className="app-nav-card-tab">
                    <span>Attendances</span>
                </div>
                <div className="divider"></div>
                <div className="app-nav-card-tab">
                    <span>Statistics</span>
                </div>
                <div className="divider"></div>
                <div className="app-nav-card-tab">
                    <span>Cancelled Registrations</span>
                </div>
                <div className="divider"></div>
                <div className="app-nav-card-tab">
                    <span>Cancelled Attendances</span>
                </div>
                <div className="divider"></div>
                <div className="app-nav-card-tab">
                    <span>Freezed Registrations</span>
                </div>
            </div>
        </>
    )
}

export default PackageNav