import React, { useState, useEffect } from 'react'
import './nav-bar.css'
import M from 'materialize-css'
import UserNavIcon from '../dropdown/user-nav-icon'
import ClubAdminResponsiveMenu from './club-admin-responsive-menu'
import DataDateShower from '../data-date-shower'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import { localStorageSecured } from '../../security/localStorage'

const NavBar = ({ pageName, statsQuery }) => {

    const user = localStorageSecured.get('user')
    const club = localStorageSecured.get('club')

    const [showMenu, setShowMenu] = useState(false)

    const toggleMenu = () => {

        if(showMenu) {
            setShowMenu(false)
        } else {
            setShowMenu(true)
        }
    }

    useEffect(() => {

        window.scrollTo(0, 0)
          
        let dropdown = document.querySelectorAll('.dropdown-trigger')
        M.Dropdown.init(dropdown, { alignment: 'right' })

    }, [])

    return (

        <>
            <div className="app-all-nav-container blue white">
                <div className="app-nav-bar white-text">
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
                            <span className="role grey-text">{club.name}</span>
                            {/*<span className="role grey-text">{translations[lang][user.role]}</span>*/}
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