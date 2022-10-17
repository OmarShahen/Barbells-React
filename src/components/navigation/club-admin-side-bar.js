import React from 'react'
import './side-bar.css'
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
import { useNavigate, NavLink } from 'react-router-dom'
import { iconPicker } from '../../utils/icon-finder'
import translation from '../../i18n/index'
import Dashboard from '@mui/icons-material/Dashboard'

const ClubAdminSideBar = () => {

    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem('user'))
    const club = JSON.parse(localStorage.getItem('club'))

    const lang = localStorage.getItem('lang')

    const pagePath = window.location.pathname
    const pageName = pagePath.split('/')[4]

    return (
        <div className="side-bar center hide-on-small-only">
            <div className="app-logo">
                <img 
                src={`https://avatars.dicebear.com/api/initials/${club.name}.svg`} 
                style={{ width: '3rem', height: '3rem', borderRadius: '50%' }} 
                alt="club avatar" 
                />
                <div className="center">
                    <strong>
                        {club.name}
                    </strong>
                </div>
            </div>
            <ul className="side-nav-list">
                <NavLink to={`/app/clubs/${club._id}/dashboard`}>
                    <li className={ pagePath.includes('dashboard') ? 'active-side-nav' : null } >
                        <Dashboard />
                        <span>{translation[lang]['Dashboard']}</span>
                    </li>
                </NavLink>
                <a className="modal-trigger" href="#club-admin-stats-nav">
                    <li className={ pagePath.includes('stats') ? 'active-side-nav' : null }>
                        <i className="material-icons">show_chart</i>
                        <span>{translation[lang]['Statistics']}</span>
                    </li>
                </a>
                <li className={ pagePath.includes('staffs') ? 'active-side-nav' : null } >
                <NavLink to={`/app/clubs/${club._id}/staffs/main`}>
                    <BadgeOutlinedIcon />
                    <span>{translation[lang]['Staffs']}</span>
                </NavLink>
                </li>
                <li className={ pagePath.includes('members') ? 'active-side-nav' : null } >
                <NavLink to={`/app/clubs/${club._id}/members/main`}>
                    <GroupOutlinedIcon />
                    <span>{translation[lang]['Members']}</span>
                </NavLink>
                </li>
                <li className={ pagePath.includes('payments') ? 'active-side-nav' : null } >
                <NavLink to={`/app/clubs/${club._id}/payments/main`}>
                    <PaymentIcon />
                    <span>{translation[lang]['Payments']}</span>
                </NavLink>
                </li>
                <li className={ pageName === 'registrations' ? 'active-side-nav' : null } >
                <NavLink to={`/app/clubs/${club._id}/registrations/main`}>
                    <ContentPasteOutlinedIcon />
                    <span>{translation[lang]['Registrations']}</span>
                </NavLink>
                </li>
                <li className={ pagePath.includes('attendances') ? 'active-side-nav' : null } >
                <NavLink to={`/app/clubs/${club._id}/attendances/main`}>
                    <DoneAllIcon />
                    <span>{translation[lang]['Attendances']}</span>
                </NavLink>
                </li>
                <li className={ pagePath.includes('packages') ? 'active-side-nav' : null } >
                    <NavLink to={`/app/clubs/${club._id}/packages/main`}>
                        <AppsOutlinedIcon />
                        <span>{translation[lang]['Packages']}</span>
                    </NavLink>
                </li>
                <li className={ pagePath.includes('freezed-registrations') ? 'active-side-nav' : null } >
                    <NavLink to={`/app/clubs/${club._id}/freezed-registrations/main`}>
                        { iconPicker('freezed') }
                        <span>{translation[lang]['Freezed']}</span>
                    </NavLink>
                </li>
              
            </ul>
        </div>
    )
}

export default ClubAdminSideBar