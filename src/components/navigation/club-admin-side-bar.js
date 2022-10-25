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
import DashboardIcon from '@mui/icons-material/Dashboard'
import Logo from '../../images/new-logo-2.png'


const ClubAdminSideBar = () => {

    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem('user'))
    const club = JSON.parse(localStorage.getItem('club'))

    const lang = localStorage.getItem('lang')

    const pagePath = window.location.pathname
    const pageName = pagePath.split('/')[4]

    return (
        <div className="side-bar center hide-on-small-only">
            {/*<div className="app-logo">
                <img src={Logo} className="" style={{ width: '4rem', height: '4rem' }}/>
                <span>Barbells</span>
            </div>*/}
            <ul className="side-nav-list">
                <NavLink to={`/app/clubs/${club._id}/dashboard`}>
                    <li className={ pagePath.includes('dashboard') ? 'active-side-nav' : null } >
                        <DashboardIcon />
                        <span>{translation[lang]['Dashboard']}</span>
                    </li>
                </NavLink>
                <li className={ pagePath.includes('packages') ? 'active-side-nav' : null } >
                    <NavLink to={`/app/clubs/${club._id}/packages/main`}>
                        <AppsOutlinedIcon />
                        <span>{translation[lang]['Packages']}</span>
                    </NavLink>
                </li>
                <li className={ pagePath.includes('payments') ? 'active-side-nav' : null } >
                <NavLink to={`/app/clubs/${club._id}/payments/main`}>
                    <PaymentIcon />
                    <span>{translation[lang]['Payments']}</span>
                </NavLink>
                </li>
                <div className="list-collection">
                <li>
                   <a href="#">
                        {translation[lang]['Performance']}
                    </a> 
                </li>
                <div className="nested-menu">
                <li className={ pagePath.includes('members') ? 'active-side-nav' : null } >
                    <NavLink to={`/app/clubs/${club._id}/members/main`}>
                        <GroupOutlinedIcon />
                        <span>{translation[lang]['Members']}</span>
                        {/*<span class="new badge blue">4</span>*/}
                    </NavLink>
                    </li>
                <li className={ pageName === 'registrations' ? 'active-side-nav' : null } >
                <NavLink to={`/app/clubs/${club._id}/registrations/main`}>
                    <ContentPasteOutlinedIcon />
                    <span>{translation[lang]['Registrations']}</span>
                        {/*<span class="new badge blue">4</span>*/}
                </NavLink>
                </li>
                <li className={ pagePath.includes('attendances') ? 'active-side-nav' : null } >
                <NavLink to={`/app/clubs/${club._id}/attendances/main`}>
                    <DoneAllIcon />
                    <span>{translation[lang]['Attendances']}</span>
                    {/*<span class="new badge blue">4</span>*/}
                </NavLink>
                </li>
                <li className={ pagePath.includes('freezed-registrations') ? 'active-side-nav' : null } >
                    <NavLink to={`/app/clubs/${club._id}/freezed-registrations/main`}>
                        { iconPicker('freezed') }
                        <span>{translation[lang]['Freezed']}</span>
                    </NavLink>
                </li>
                </div>
                </div>
                <div className="list-collection">
                <li>
                   <a href="#">
                        {translation[lang]['Users']}
                    </a> 
                </li>
                <div className="nested-menu">
                    <li className={ pagePath.includes('staffs') ? 'active-side-nav' : null } >
                    <NavLink to={`/app/clubs/${club._id}/staffs/main`}>
                        <BadgeOutlinedIcon />
                        <span>{translation[lang]['Staffs']}</span>
                    </NavLink>
                    </li>
                </div>
                </div>
                <div className="list-collection">
                <li>
                   <a href="#">
                        {translation[lang]['Statistics']}
                    </a> 
                </li>
                <div className="nested-menu">
                    <li>
                        <NavLink to={`/app/clubs/${club._id}/registrations/stats`}>
                        <ContentPasteOutlinedIcon />
                            <span>{translation[lang]['Registrations']}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={`/app/clubs/${club._id}/attendances/stats`}>
                        <DoneAllIcon />
                            <span>{translation[lang]['Attendances']}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={`/app/clubs/${club._id}/members/stats`}>
                            <GroupOutlinedIcon />
                            <span>{translation[lang]['Members']}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={`/app/clubs/${club._id}/packages/stats`}>
                        <AppsOutlinedIcon />
                            <span>{translation[lang]['Packages']}</span>
                        </NavLink>
                    </li>
                </div>
                </div>
                <div className="list-collection">
                <li>
                   <a href="#">
                   {translation[lang]['Cancellations']}
                    </a> 
                </li>
                <div className="nested-menu">
                    <li className={ pagePath.includes('cancelled-registrations') ? 'active-side-nav' : null } >
                        <NavLink to={`/app/clubs/${club._id}/cancelled-registrations/main`}>
                            <GroupOutlinedIcon />
                            <span>{translation[lang]['Registrations']}</span>
                        </NavLink>
                        </li>
                    <li className={ pageName === 'cancelled-attendances' ? 'active-side-nav' : null } >
                    <NavLink to={`/app/clubs/${club._id}/cancelled-attendances/main`}>
                        <ContentPasteOutlinedIcon />
                        <span>{translation[lang]['Attendances']}</span>
                    </NavLink>
                    </li>
                </div>
                </div>
            </ul>
        </div>
    )
}

export default ClubAdminSideBar