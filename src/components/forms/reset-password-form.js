import React, { useState, useEffect  } from 'react'
import './login.css'
import { serverRequest } from '../../API/request'
import CircularLoadingButton from '../buttons/loading-button'
import { useNavigate } from 'react-router-dom'
import translations from '../../i18n'
import { checkPasswordStrength } from '../../utils/passwords'
import { CheckmarkIcon } from 'react-hot-toast'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const ResetPasswordForm = () => {

    const navigate = useNavigate()

    const lang = localStorage.getItem('lang') || 'en'

    const pagePath = window.location.pathname.split('/')

    const token = pagePath[2]

    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()

    const [passwordError, setPasswordError] = useState()
    const [confirmPasswordError, setConfirmPasswordError] = useState()

    const [isLoading, setIsLoading] = useState(false)
    const [done, setDone] = useState(false)


    useEffect(() => {

        serverRequest.post('/v1/auth/verify-token', { token })
        .then(response => {
            return
        })
        .catch(error => {
            navigate('/404')
        })
    }, [])


    const submit = (e) => {

        e.preventDefault()

        if(!password) {
            return setPasswordError(translations[lang]['Password is required'])
        }

        let checkMixed = true
        if(lang !== 'en') {
            checkMixed = false
        }
        
        const passwordValidation = checkPasswordStrength(password, checkMixed)

        if(!passwordValidation.isAccepted) {
            return setPasswordError(translations[lang][passwordValidation.message])
        }

        if(!confirmPassword) {
            return setConfirmPasswordError(translations[lang]['Confirm password is required'])
        }

        if(password !== confirmPassword) {
            return setConfirmPasswordError(translations[lang]['Confirm password is not the same as password'])
        }

        setIsLoading(true)

        const headers = { 'x-access-token': token }
        serverRequest.patch('/v1/auth/reset-password', { password }, { headers, params: { lang } })
        .then(response => {
            setIsLoading(false)

            const data = response.data

            if(data.role === 'CLUB-ADMIN') {
                setDone(true)
                setTimeout(() => navigate('/clubs-admins/login'), 3000)
            } else if(data.role === 'OWNER') {
                setDone(true)
                setTimeout(() => navigate('/chains-owners/login'), 3000)
            } else if(data.role === 'STAFF') {
                setDone(true)
            }

        })
        .catch(error => {

            setIsLoading(false)

            if(error.response.data.field === 'password') {
                return setPasswordError(error.response.data.message)
            }
        })


    }
    

    return (
        <>
            <div className="login-form-container container center">
            <div className="center login-form-header">
                        <h4>{translations[lang]['Reset Password']}</h4>
                    </div>
                <div className="login-form-wrapper white card-effect">
                    {
                        done ?
                        <div>
                            <CheckCircleIcon style={{ fontSize: '5rem' }} className="green-text" />
                            <p>{translations[lang]['Your account password is updated successfully, login with it now']}</p>
                        </div>
                        :
                        <form className="row" onSubmit={submit}>
                        <div className="input-field input-field-container col s12 m12">
                            <input 
                            type="password" 
                            onChange={ e => { 
                                setPassword(e.target.value)

                                let checkMixed = true
                                if(lang !== 'en') {
                                    checkMixed = false
                                }

                                const passwordValidation = checkPasswordStrength(e.target.value, checkMixed)
                                if(!passwordValidation.isAccepted) {
                                    return setPasswordError(translations[lang][passwordValidation.message])
                                } else {
                                    setPasswordError()
                                }

                             }}
                            onClick={ e => {
                                setPasswordError()
                            }}
                            style={passwordError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null }  
                            id="password" 
                            value={password} 
                            />

                            { passwordError ? 
                            <label for="password" style={{ color: '#f44336' }}>{passwordError}</label> 
                            : 
                            <label for="password">{translations[lang]['Password']}</label>
                            }
                        </div>
                        <div className="input-field input-field-container col s12 m12">
                            <input 
                            type="password" 
                            onChange={ e => setConfirmPassword(e.target.value)}
                            onClick={ e => {
                                setConfirmPasswordError()
                            }}
                            style={confirmPasswordError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null }  
                            id="confirm-password" 
                            value={confirmPassword} 
                            />

                            { confirmPasswordError ? 
                            <label for="confirm-password" style={{ color: '#f44336' }}>{confirmPasswordError}</label> 
                            : 
                            <label for="confirm-password">{translations[lang]['Confirm Password']}</label>
                            }
                        </div>
                        <div className="col s12 login-form-btn-container center">
                            { 
                            isLoading ?
                             <CircularLoadingButton />
                              :
                              <button className="btn blue login-submit-btn">{translations[lang]['RESET']}</button>
                               }
                        </div>
                        
                    </form>
                    }
                    
                </div>
            </div>
        </>
    )
}

export default ResetPasswordForm