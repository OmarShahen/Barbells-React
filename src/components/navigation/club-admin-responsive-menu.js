import React, { useState, useEffect } from 'react'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import GroupIcon from '@mui/icons-material/Group'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import LogoutIcon from '@mui/icons-material/Logout'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import PaymentIcon from '@mui/icons-material/Payment'
import { NavLink } from 'react-router-dom'
import translations from '../../i18n'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { iconPicker } from '../../utils/icon-finder'

const ClubAdminResponsiveMenu = ({ pageName, user, club }) => {

    const lang = localStorage.getItem('lang')

    const pagePath = window.location.pathname

    return <div className="app-responsive-menu black">
        <ul className="side-nav-list">
            <NavLink to={`/app/clubs/${club._id}/dashboard`}>
                <li className={ pagePath.includes('dashboard') ? 'active-side-nav' : null } >
                    <DashboardIcon />
                    <span>{translations[lang]['Dashboard']}</span>
                </li>
            </NavLink>
            <li className={ pagePath.includes('packages') ? 'active-side-nav' : null } >
                <NavLink to={`/app/clubs/${club._id}/packages/main`}>
                    <AppsOutlinedIcon />
                    <span>{translations[lang]['Packages']}</span>
                </NavLink>
            </li>
            <li className={ pagePath.includes('payments') ? 'active-side-nav' : null } >
            <NavLink to={`/app/clubs/${club._id}/payments/main`}>
                <PaymentIcon />
                <span>{translations[lang]['Payments']}</span>
            </NavLink>
            </li>
                <div className="list-collection">
                <li>
                   <a href="#">
                        {translations[lang]['Performance']}
                    </a> 
                </li>
                <div className="nested-menu">
                <li className={ pagePath.includes('members') ? 'active-side-nav' : null } >
                    <NavLink to={`/app/clubs/${club._id}/members/main`}>
                        <GroupOutlinedIcon />
                        <span>{translations[lang]['Members']}</span>
                        {/*<span class="new badge blue">4</span>*/}
                    </NavLink>
                    </li>
                <li className={ pageName === 'registrations' ? 'active-side-nav' : null } >
                <NavLink to={`/app/clubs/${club._id}/registrations/main`}>
                    <ContentPasteOutlinedIcon />
                    <span>{translations[lang]['Registrations']}</span>
                        {/*<span class="new badge blue">4</span>*/}
                </NavLink>
                </li>
                <li className={ pagePath.includes('attendances') ? 'active-side-nav' : null } >
                <NavLink to={`/app/clubs/${club._id}/attendances/main`}>
                    <DoneAllIcon />
                    <span>{translations[lang]['Attendances']}</span>
                    {/*<span class="new badge blue">4</span>*/}
                </NavLink>
                </li>
                <li className={ pagePath.includes('freezed-registrations') ? 'active-side-nav' : null } >
                    <NavLink to={`/app/clubs/${club._id}/freezed-registrations/main`}>
                        { iconPicker('freezed') }
                        <span>{translations[lang]['Freezed']}</span>
                    </NavLink>
                </li>
                </div>
                </div>
                <div className="list-collection">
                <li>
                   <a href="#">
                        {translations[lang]['Users']}
                    </a> 
                </li>
                <div className="nested-menu">
                    <li className={ pagePath.includes('staffs') ? 'active-side-nav' : null } >
                    <NavLink to={`/app/clubs/${club._id}/staffs/main`}>
                        <BadgeOutlinedIcon />
                        <span>{translations[lang]['Staffs']}</span>
                    </NavLink>
                    </li>
                </div>
                </div>
                <div className="list-collection">
                <li>
                   <a href="#">
                        {translations[lang]['Statistics']}
                    </a> 
                </li>
                <div className="nested-menu">
                    <li>
                        <NavLink to={`/app/clubs/${club._id}/registrations/stats`}>
                        <ContentPasteOutlinedIcon />
                            <span>{translations[lang]['Registrations']}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={`/app/clubs/${club._id}/attendances/stats`}>
                        <DoneAllIcon />
                            <span>{translations[lang]['Attendances']}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={`/app/clubs/${club._id}/members/stats`}>
                            <GroupOutlinedIcon />
                            <span>{translations[lang]['Members']}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={`/app/clubs/${club._id}/packages/stats`}>
                        <AppsOutlinedIcon />
                            <span>{translations[lang]['Packages']}</span>
                        </NavLink>
                    </li>
                </div>
                </div>
                <div className="list-collection">
                <li>
                   <a href="#">
                   {translations[lang]['Cancellations']}
                    </a> 
                </li>
                <div className="nested-menu">
                    <li className={ pagePath.includes('cancelled-registrations') ? 'active-side-nav' : null } >
                        <NavLink to={`/app/clubs/${club._id}/cancelled-registrations/main`}>
                            <GroupOutlinedIcon />
                            <span>{translations[lang]['Registrations']}</span>
                        </NavLink>
                    </li>
                    <li className={ pageName === 'cancelled-attendances' ? 'active-side-nav' : null } >
                    <NavLink to={`/app/clubs/${club._id}/cancelled-attendances/main`}>
                        <ContentPasteOutlinedIcon />
                        <span>{translations[lang]['Attendances']}</span>
                    </NavLink>
                    </li>
                </div>
                </div>
        </ul>
    </div>
}

export default ClubAdminResponsiveMenu