import React from 'react'
import './dropdown.css'
import { useNavigate } from 'react-router-dom'
import translations from '../../i18n'
import { useDispatch } from 'react-redux'
import { setIsLogged } from '../../redux/slices/userSlice'
import { localStorageSecured } from '../../security/localStorage'

const UserNavIcon = ({ user }) => {

    const navigate = useNavigate()

    const lang = localStorage.getItem('lang')
    const dispatch = useDispatch()

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
                    sessionStorage.setItem('user', null)
                    sessionStorage.setItem('access-token', null)
                    sessionStorage.setItem('club', null)

                    dispatch(setIsLogged(false))

                }}>
                {translations[lang]['Logout']}
            </li>
        </ul>
    )
}

export default UserNavIcon