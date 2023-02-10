import React, { useState, useEffect } from 'react'
import './side-bar.css'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import PaymentIcon from '@mui/icons-material/Payment'
import { NavLink } from 'react-router-dom'
import { iconPicker } from '../../utils/icon-finder'
import translations from '../../i18n/index'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Logo from '../logo/logo'
import { localStorageSecured } from '../../security/localStorage'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined'
import LocalDrinkOutlinedIcon from '@mui/icons-material/LocalDrinkOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined'
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined'
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined'
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ClubAdminSideBar = () => {

    const club = useSelector(state => state.club.club)
    const lang = localStorage.getItem('lang')

    const pagePath = window.location.pathname
    const pageName = pagePath.split('/')[4]

    const [showMemberships, setShowMemberships] = useState(false)
    const [showEmployees, setShowEmployees] = useState(false)
    const [showPayments, setShowPayments] = useState(false)
    const [showInventory, setShowInventory] = useState(false)
    const [showReports, setShowReports] = useState(false)
    const [showCancellations, setShowCancellations] = useState(false)


    return (
            <div className="side-bar center hide-on-small-only">
            <div className="app-logo">
                <Logo width={'3rem'} height={'3rem'} />
            </div>
            <ul className="side-nav-list">
                <div className="list-collection">
                    <li className={ pagePath.includes('dashboard') ? 'active-side-nav' : null } >
                        <NavLink to={`/app/clubs/${club._id}/dashboard`}>
                            <DashboardIcon />
                            <span>{translations[lang]['Dashboard']}</span>
                        </NavLink>
                    </li>
                </div>
                <div className="list-collection">
                    <li className={ pagePath.includes('offers-messages') ? 'active-side-nav' : null } >
                        <NavLink to={`/app/clubs/${club._id}/offers-messages/main`}>
                            <SendOutlinedIcon />
                            <span>{translations[lang]['Send Offers']}</span>
                        </NavLink>
                    </li>
                </div>
                <div className="list-collection">
                <li onClick={e => setShowMemberships(!showMemberships)}>
                   <a href="#">
                    <BookOnlineOutlinedIcon />
                        {translations[lang]['Memberships']}
                    </a> 
                    {showMemberships ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </li>
                {
                    showMemberships ?
                    <div className="nested-menu">
                        <li className={ pagePath.includes('packages') ? 'active-side-nav' : null } >
                            <NavLink to={`/app/clubs/${club._id}/packages/main`}>
                                <AppsOutlinedIcon />
                                <span>{translations[lang]['Packages']}</span>
                            </NavLink>
                        </li>
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
                    :
                    null
                }
                </div>
                <div className="list-collection">
                <li onClick={e => setShowEmployees(!showEmployees)}>
                   <a href="#">
                    <EngineeringOutlinedIcon />
                        {translations[lang]['Employees']}
                    </a> 
                    {showEmployees ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </li>
                {
                    showEmployees ?
                    <div className="nested-menu">
                        <li className={ pagePath.includes('staffs') ? 'active-side-nav' : null } >
                        <NavLink to={`/app/clubs/${club._id}/staffs/main`}>
                            <BadgeOutlinedIcon />
                            <span>{translations[lang]['Staffs']}</span>
                        </NavLink>
                        </li>
                    </div>
                    :
                    null
                }
                
                </div>
                <div className="list-collection">
                <li onClick={e => setShowPayments(!showPayments)}>
                   <a href="#">
                    <PaidOutlinedIcon />
                        {translations[lang]['Payments']}
                    </a> 
                    {showPayments ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </li>
                {
                    showPayments ?
                    <div className="nested-menu">
                        <li className={ pagePath.includes('installments') ? 'active-side-nav' : null } >
                        <NavLink to={`/app/clubs/${club._id}/installments/main`}>
                            <RequestQuoteOutlinedIcon />
                            <span>{translations[lang]['Installments']}</span>
                        </NavLink>
                        </li>
                        <li className={ pagePath.includes('payments') ? 'active-side-nav' : null } >
                            <NavLink to={`/app/clubs/${club._id}/staff-payments/main`}>
                                <PaymentIcon />
                                <span>{translations[lang]['Payments Receivers']}</span>
                            </NavLink>
                        </li>
                        
                        <li className={ pagePath.includes('inventory') ? 'active-side-nav' : null } >
                        <NavLink to={`/app/clubs/${club._id}/payrolls/main`}>
                            <PaymentsOutlinedIcon />
                            <span>{translations[lang]['Payrolls']}</span>
                        </NavLink>
                        </li>
                        <li className={ pagePath.includes('maintenance') ? 'active-side-nav' : null } >
                        <NavLink to={`/app/clubs/${club._id}/payments/maintenance/main`}>
                            <BuildOutlinedIcon />
                            <span>{translations[lang]['Maintenance']}</span>
                        </NavLink>
                        </li>
                        <li className={ pagePath.includes('bill') ? 'active-side-nav' : null } >
                        <NavLink to={`/app/clubs/${club._id}/payments/bill/main`}>
                            <DescriptionOutlinedIcon />
                            <span>{translations[lang]['Bills']}</span>
                        </NavLink>
                        </li>
                    </div>
                    :
                    null
                }
                
                </div>
                <div className="list-collection">
                <li onClick={e => setShowInventory(!showInventory)}>
                   <a href="#">
                    <Inventory2OutlinedIcon />
                        {translations[lang]['Inventory']}
                    </a> 
                    {showInventory ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </li>
                {
                    showInventory ?
                    <div className="nested-menu">
                        <li className={ pagePath.includes('items') ? 'active-side-nav' : null } >
                            <NavLink to={`/app/clubs/${club._id}/items/main`}>
                                <LocalDrinkOutlinedIcon />
                                <span>{translations[lang]['Items']}</span>
                            </NavLink>
                        </li>
                        
                        <li className={ pagePath.includes('suppliers') ? 'active-side-nav' : null } >
                        <NavLink to={`/app/clubs/${club._id}/suppliers/main`}>
                            <AssignmentIndOutlinedIcon />
                            <span>{translations[lang]['Suppliers']}</span>
                        </NavLink>
                        </li>
                    </div>
                    :
                    null
                }
                
                </div>
                <div className="list-collection">
                <li onClick={e => setShowReports(!showReports)}>
                   <a href="#">
                    <QueryStatsOutlinedIcon />
                        {translations[lang]['Reports']}
                    </a> 
                    {showReports ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </li>
                {
                    showReports ?
                    <div className="nested-menu">
                        <li className={ pagePath.includes('payments') ? 'active-side-nav' : null } >
                            <NavLink to={`/app/clubs/${club._id}/payments/stats`}>
                                <PaymentsOutlinedIcon />
                                <span>{translations[lang]['Payments']}</span>
                            </NavLink>
                            </li>
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
                            <li className={ pagePath.includes('inventory') ? 'active-side-nav' : null } >
                            <NavLink to={`/app/clubs/${club._id}/inventory/stats`}>
                                <Inventory2OutlinedIcon />
                                <span>{translations[lang]['Inventory']}</span>
                            </NavLink>
                            </li>
                            <li>
                            <NavLink to={`/app/clubs/${club._id}/payments/bill/stats`}>
                                <DescriptionOutlinedIcon />
                                <span>{translations[lang]['Bills']}</span>
                            </NavLink>
                            </li>
                            <li>
                            <NavLink to={`/app/clubs/${club._id}/payments/maintenance/stats`}>
                                <BuildOutlinedIcon />
                                <span>{translations[lang]['Maintenance']}</span>
                            </NavLink>
                            </li>
                        </div>
                    :
                    null
                }
                
                </div>
                <div className="list-collection">
                <li onClick={e => setShowCancellations(!showCancellations)}>
                   <a href="#">
                    <EventBusyOutlinedIcon />
                   {translations[lang]['Cancellations']}
                    </a> 
                    {showCancellations ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </li>
                {
                    showCancellations ?
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
                    :
                    null
                }
                </div>
            </ul>
        </div>
       )
}

export default ClubAdminSideBar