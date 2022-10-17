import React, { useState } from 'react'
import './login.css'
import { serverRequest } from '../../API/request'
import CircularLoadingButton from '../buttons/loading-button'
import { useNavigate } from 'react-router-dom'
import translations from '../../i18n'

const LoginForm = () => {

    const navigate = useNavigate()

    const lang = localStorage.getItem('lang') || 'en'

    const [countryCode, setCountryCode] = useState()
    const [phone, setPhone] = useState()
    const [password, setPassword] = useState()

    const [countryCodeError, setCountryCodeError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [passwordError, setPasswordError] = useState()

    const [isLoading, setIsLoading] = useState(false)


    const submit = (e) => {

        e.preventDefault()

        if(!countryCode) {
            return setCountryCodeError(translations[lang]['Country code is required'])
        }

        if(!phone) {
            return setPhoneError(translations[lang]['Phone is required'])
        }

        if(!password) {
            return setPasswordError(translations[lang]['Password is required'])
        }

        const loginData = { countryCode, phone, password }

        const clubsAdminsURL = `/auth/clubs-admins/login`

        setIsLoading(true)
        serverRequest.post(clubsAdminsURL, loginData, { params: { lang }})
        .then(response => {

            setIsLoading(false)

            const data = response.data

            const token = data.token

            localStorage.setItem('access-token', JSON.stringify(token))

            const user = data.clubAdmin
            const club = data.club

            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('club', JSON.stringify(club))

            navigate(`/app/clubs/${club._id}/dashboard`)

        })
        .catch(error => {

            console.log(error)

            setIsLoading(false)

            const errorData = error.response.data

            console.log(errorData)

            if(errorData.field === 'countryCode') {
                return setCountryCodeError(errorData.message)
            }

            if(errorData.field === 'phone') {
                return setPhoneError(errorData.message)
            }

            if(errorData.field === 'password') {
                return setPasswordError(errorData.message)
            }
        })
    }
    

    return (
        <>
            <div className="login-form-container container center">
            <div className="center login-form-header">
                        <h4>{translations[lang]['Welcome Back']}</h4>
                        <span>{translations[lang]['Sign in to your account as club admin']}</span>
                    </div>
                <div className="login-form-wrapper white card-effect">
                    <form className="row" onSubmit={submit}>
                    <div className="input-field input-field-container col s5 m4">
                            <input 
                            type="text" 
                            onChange={ e => setCountryCode(e.target.value)}
                            onClick={ e => {
                                setCountryCodeError()
                            }}
                            style={countryCodeError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null }  
                            id="login-country-code" 
                            value={countryCode} 
                            />

                            { countryCodeError ? 
                            <label for="login-country-code" style={{ color: '#f44336' }}>{countryCodeError}</label> 
                            : 
                            <label for="login-country-code">{translations[lang]['Country Code']}</label>
                            }
                        </div>
                        <div className="input-field input-field-container col s7 m8">
                            <input 
                            type="text" 
                            onChange={ e => setPhone(e.target.value)}
                            onClick={ e => {
                                setPhoneError()
                            }}
                            style={phoneError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null }  
                            id="login-phone" 
                            value={phone} 
                            />

                            { phoneError ? 
                            <label for="login-phone" style={{ color: '#f44336' }}>{phoneError}</label> 
                            : 
                            <label for="login-phone">{translations[lang]['Phone']}</label>
                            }
                        </div>
                        <div className="input-field input-field-container col s12 m12">
                            <input 
                            type="password" 
                            onChange={ e => setPassword(e.target.value)}
                            onClick={ e => {
                                setPasswordError()
                            }}
                            style={passwordError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null }  
                            id="login-password" 
                            value={password} 
                            />

                            { passwordError ? 
                            <label for="login-password" style={{ color: '#f44336' }}>{passwordError}</label> 
                            : 
                            <label for="login-password">{translations[lang]['Password']}</label>
                            }
                        </div>
                        <div className="col s12 login-form-btn-container center">
                            { 
                            isLoading ?
                             <CircularLoadingButton />
                              :
                              <button className="btn blue login-submit-btn">{translations[lang]['LOGIN']}</button>
                               }
                        </div>
                        <div className="col s12">
                               <div className="left">
                               <span>{translations[lang]['Forgot Password']}?</span>
                               </div>
                        </div>
                        
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoginForm