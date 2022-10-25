import React, { useState } from 'react'
import './login.css'
import { serverRequest } from '../../API/request'
import CircularLoadingButton from '../buttons/loading-button'
import { useNavigate } from 'react-router-dom'
import translations from '../../i18n'
import Logo from '../../images/form-img.png'

const ChainOwnerLoginForm = () => {

    const navigate = useNavigate()

    const lang = localStorage.getItem('lang')

    const [countryCode, setCountryCode] = useState('20')
    const [phone, setPhone] = useState()
    const [password, setPassword] = useState()

    const [phoneError, setPhoneError] = useState()
    const [passwordError, setPasswordError] = useState()

    const [isLoading, setIsLoading] = useState(false)


    const submit = (e) => {

        e.preventDefault()

        if(!phone) {
            return setPhoneError(translations[lang]['Phone is required'])
        }

        if(!password) {
            return setPasswordError(translations[lang]['Password is required'])
        }

        let cleanPhone = phone
        if(phone[0] === '0') {
            cleanPhone = ''
            for(let i=1;i<phone.length;i++) {
                cleanPhone += phone[i]
            }
        }

        const loginData = { countryCode, phone: cleanPhone, password }

        const clubsAdminsURL = `/auth/chains-owners/login`

        setIsLoading(true)
        serverRequest.post(clubsAdminsURL, loginData, { params: { lang }})
        .then(response => {

            setIsLoading(false)

            const data = response.data

            const token = data.token

            localStorage.setItem('access-token', JSON.stringify(token))

            const user = data.chainOwner

            user.role = 'OWNER'

            localStorage.setItem('user', JSON.stringify(user))

            navigate(`/app/chain-owners/${user._id}/dashboard`)

        })
        .catch(error => {

            console.log(error)

            setIsLoading(false)

            const errorData = error.response.data

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
            {/*<img 
                src={Logo} 
                style={{ width: '10rem', height: '8rem', borderRadius: '.25rem' }} 
                alt="club avatar" 
                />*/}
                        <h4>{translations[lang]['Welcome Back']}</h4>
                        <span>{translations[lang]['Sign in to your account as chain owner']}</span>
                    </div>
                <div className="login-form-wrapper white card-effect">
                    <div className="center">
                    </div>
                    <form className="row" onSubmit={submit}>
                        <div className="input-field input-field-container col s12">
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
                               <span style={{ cursor: 'pointer' }} onClick={e => navigate('/forgot-password?role=OWNER')}>{translations[lang]['Forgot Password']}?</span>
                               </div>
                        </div>
                        
                    </form>
                </div>
            </div>
        </>
    )
}

export default ChainOwnerLoginForm