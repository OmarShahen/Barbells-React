import React, { useState, useEffect } from 'react'
import ClubNavBar from './club-nav-bar'
import './nav-bar.css'
import OwnerStatsNav from './owner-stats-nav'
import Modal from '../modals/modal'
import M from 'materialize-css'
import ClubAdminStatNav from './club-admin-stats-nav'
import UserNavIcon from '../dropdown/user-nav-icon'
import ClubAdminResponsiveMenu from './club-admin-responsive-menu'
import DataDateShower from '../data-date-shower'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import translations from '../../i18n'

const NavBar = ({ pageName, statsQuery }) => {

    const user = JSON.parse(localStorage.getItem('user'))
    const club = JSON.parse(localStorage.getItem('club'))
    const lang = localStorage.getItem('lang')

    const [showMenu, setShowMenu] = useState(false)

    const toggleMenu = () => {

        if(showMenu) {
            setShowMenu(false)
        } else {
            setShowMenu(true)
        }
    }


    const pagePath = window.location.pathname.split('/')

    useEffect(() => {

        window.scrollTo(0, 0)
          
        let dropdown = document.querySelectorAll('.dropdown-trigger')
        M.Dropdown.init(dropdown, { alignment: 'right' })

        let tooltip = document.querySelectorAll('.tooltipped');
        M.Tooltip.init(tooltip)

    }, [])

    return (

        <>
            <div className="app-all-nav-container blue white">
                <div className="app-nav-bar white-text">
                    

                    {
                        user.role === 'CLUB-ADMIN' ?
                        <Modal id={'club-admin-stats-nav'}>
                            <ClubAdminStatNav />
                        </Modal>
                        :
                        <Modal id={'owner-stats-nav'}>
                            <OwnerStatsNav />
                        </Modal>
                    }
                    <div className="club-admin-responsive-menu" onClick={e => toggleMenu()}>
                        <i className="material-icons">menu</i>
                    </div>
                    <div className="page-name">
                        <strong>
                            {pageName}
                        </strong>
                        {
                            statsQuery &&
                            <div className="data-date-container">
                                <CalendarMonthOutlinedIcon />
                                <DataDateShower statsQuery={statsQuery} />
                            </div>
                            
                        }
                    </div>
                    
                    <a href="#" className="dropdown-trigger tooltipped" data-position="bottom" data-tooltip="Profile" data-target="user-info" >
                    <div className="user-pic">
                        <div>
                            <span className="name">{user.name}</span>
                            <span className="role grey-text">{translations[lang][user.role]}</span>
                        </div>
                        <img src={`https://avatars.dicebear.com/api/initials/${user.name}.svg`} alt="user avatar" />
                    </div>
                    <UserNavIcon user={user} />
                    </a>
                </div>
            </div>
            { showMenu && <ClubAdminResponsiveMenu user={user} club={club} /> }
        </>

            
    )
}

export default NavBar