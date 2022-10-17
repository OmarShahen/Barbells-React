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

const ChainOwnerResponsiveMenu = ({ pageName, user }) => {

    const lang = localStorage.getItem('lang')

    return <div className="app-responsive-menu black">
    <ul>
        <li className="club-icon-container">
        <img 
        src={`https://avatars.dicebear.com/api/initials/${user.name}.svg`} 
        style={{ width: '3rem', height: '3rem', borderRadius: '50%' }} 
        alt="club avatar" 
        />
            <span className="white-text">{user.name}</span>
        </li>
        <div className="divider"></div>
        <li className={ pageName === 'dashboard' ? 'active-side-nav' : null } style={{marginTop: '1rem'}} >
            <NavLink to={`/app/chain-owners/${user._id}/dashboard`}>
                <i className="material-icons">developer_board</i>
                <span>{translations[lang]['Dashboard']}</span>
            </NavLink>
        </li>
        <li className="">
            <a className="modal-trigger" href="#owner-stats-nav">
                <i className="material-icons">show_chart</i>
                <span>{translations[lang]['Statistics']}</span>
            </a>
            <ul className="nested-stats-navbar">
                <li>
                    <NavLink to={`/app/chain-owners/${user._id}/registrations/stats`}>
                        <span>{translations[lang]['Registrations']}</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={`/app/chain-owners/${user._id}/attendances/stats`}>
                        <span>{translations[lang]['Attendances']}</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={`/app/chain-owners/${user._id}/packages/stats`}>
                        <span>{translations[lang]['Packages']}</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={`/app/chain-owners/${user._id}/members/stats`}>
                        <span>{translations[lang]['Members']}</span>
                    </NavLink>
                </li>
            </ul>
        </li>
        <li className={ pageName === 'staffs' ? 'active-side-nav' : null } >
        <NavLink to={`/app/chain-owners/${user._id}/staffs/main`}>
            <BadgeOutlinedIcon />
            <span>{translations[lang]['Staffs']}</span>
        </NavLink>
        </li>
        <li className={ pageName === 'members' ? 'active-side-nav' : null } >
        <NavLink to={`/app/chain-owners/${user._id}/members/main`}>
            <GroupOutlinedIcon />
            <span>{translations[lang]['Members']}</span>
        </NavLink>
        </li>
        <li className={ pageName === 'payments' ? 'active-side-nav' : null } >
        <NavLink to={`/app/chain-owners/${user._id}/payments/main`}>
            <PaymentIcon />
            <span>{translations[lang]['Payments']}</span>
        </NavLink>
        </li>
        <li className={ pageName === 'registrations' ? 'active-side-nav' : null } >
        <NavLink to={`/app/chain-owners/${user._id}/registrations/main`}>
            <ContentPasteOutlinedIcon />
            <span>{translations[lang]['Registrations']}</span>
        </NavLink>
        </li>
        <li className={ pageName === 'attendances' ? 'active-side-nav' : null } >
        <NavLink to={`/app/chain-owners/${user._id}/attendances/main`}>
            <DoneAllIcon />
            <span>{translations[lang]['Attendances']}</span>
        </NavLink>
        </li>
        <li className={ pageName === 'packages' ? 'active-side-nav' : null } >
            <NavLink to={`/app/chain-owners/${user._id}/packages/main`}>
                <AppsOutlinedIcon />
                <span>{translations[lang]['Packages']}</span>
            </NavLink>
        </li>                
    </ul>
    </div>
}

export default ChainOwnerResponsiveMenu