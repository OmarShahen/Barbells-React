import React from 'react'
import './dropdown.css'
import { useNavigate } from 'react-router-dom'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import translations from '../../i18n'

const UserNavIcon = ({ user }) => {

    const navigate = useNavigate()

    const lang = localStorage.getItem('lang')

    return (
        <ul id='user-info' className='dropdown-content user-info-dropdown'>
            <li className="user-name disabled">
                {user.name}
                <div className="">
                    <span className="grey-text user-role">{user.role.toLowerCase()}</span>
                </div>
            </li>
            <li className="divider"></li>
            <li className="lang-container">
                <span className="lang-header grey-text">{translations[lang]['Language']}</span>
                <span 
                className={ lang === 'ar' ? "lang blue-text" : "lang black-text" } 
                onClick={ e => {
                    localStorage.setItem('lang', 'ar')
                    window.location.reload()
                    }}>عربي</span>
                <span 
                className={ lang === 'en' ? "lang blue-text" : "lang black-text" } 
                onClick={ e => {
                    localStorage.setItem('lang', 'en')
                    window.location.reload()
                }}>English</span>
            </li>
            <li className="divider" tabindex="-1"></li>
            <li className="logout" onClick={ e => {
                    localStorage.setItem('user', null)
                    localStorage.setItem('access-token', null)
                    localStorage.setItem('club', null)

                    user.role !== 'owner' ? navigate('/clubs-admins/login') : navigate('/chains-owners/login')
                }}>
                {translations[lang]['Logout']}
            </li>
        </ul>
    )
}

export default UserNavIcon