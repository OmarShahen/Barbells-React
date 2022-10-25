import React, { useState, useEffect  } from 'react'
import './login.css'
import { serverRequest } from '../../API/request'
import CircularLoadingButton from '../buttons/loading-button'
import { useNavigate } from 'react-router-dom'
import translations from '../../i18n'


const ForgotPasswordForm = () => {

    const lang = localStorage.getItem('lang') || 'en'

    const [email, setEmail] = useState()
    const [emailSuccess, setEmailSuccess] = useState(false)
    const [emailError, setEmailError] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const params = window.location.search.split('=')


    const submit = (e) => {

        e.preventDefault()

        if(!email) {
            return setEmailError(translations[lang]['Email is required'])
        }

        setIsLoading(true)

        let url = params[1] === 'STAFF' ? '/auth/reset-password/mail/staff' : '/auth/reset-password/mail/chain-owner'
        serverRequest.post(url, { email }, { params: { lang }})
        .then(response => {
            setIsLoading(false)
            setEmailSuccess(true)
            setEmailSuccess(response.data.message)
        })
        .catch(error => {
            setIsLoading(false)
            setEmailError(error.response.data.message)
        })

    }
    

    return (
        <>
            <div className="login-form-container container center">
            <div className="center login-form-header">
                        <h4>{translations[lang]['Forgot Password']}</h4>
                        { emailSuccess ? 
                            <span>{translations[lang]['Open your email now to reset your account password']}</span>
                            :
                            <span>{translations[lang]['Enter your email to reset your password through it']}</span>
                        }
                    </div>
                <div className="login-form-wrapper white card-effect">
                { emailSuccess && <span className="green-text" style={{ fontWeight: 'bold' }}>{emailSuccess}</span> }
                    <form className="row" onSubmit={submit}>
                        <div className="input-field input-field-container col s12">
                            <input 
                            type="text" 
                            onChange={ e => setEmail(e.target.value)}
                            onClick={ e => {
                                setEmailError()
                            }}
                            style={emailError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null }  
                            id="login-phone" 
                            value={email} 
                            />

                            { emailError ? 
                            <label for="login-phone" style={{ color: '#f44336' }}>{emailError}</label> 
                            : 
                            <label for="login-phone">{translations[lang]['Email']}</label>
                            }
                        </div>
                        <div className="col s12 login-form-btn-container center">
                            { 
                            isLoading ?
                             <CircularLoadingButton />
                              :
                              <button className="btn blue login-submit-btn">{translations[lang]['SEND']}</button>
                               }
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ForgotPasswordForm