import React, { useState, useEffect } from 'react'
import './form.css'
import { serverRequest } from '../../API/request'
import toast from 'react-hot-toast'
import CircularLoadingButton from '../buttons/loading-button'
import M from 'materialize-css'
import { PhoneAndroidRounded } from '@mui/icons-material'
import translations from '../../i18n'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import { localStorageSecured } from '../../security/localStorage'


const ClubStaffForm = ({ isChooseClub, setReload, reload, addedStaffRole }) => {

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const owner = localStorageSecured.get('user')
    const lang = localStorage.getItem('lang')
    

    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [phone, setPhone] = useState()
    const [countryCode, setCountryCode] = useState(20)
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [targetClub, setTargetClub] = useState(
        isChooseClub && owner.clubs.length !== 0 ? owner.clubs[0]._id : clubId 
    )

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [nameError, setNameError] = useState()
    const [emailError, setEmailError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [countryCodeError, setCountryCodeError] = useState()
    const [passwordError, setPasswordError] = useState()
    const [confirmPasswordError, setConfirmPasswordError] = useState()

    useEffect(() => {
        M.AutoInit()
    }, [])


    const resetForm = () => {

        setName('')
        setEmail('')
        setPhone('')
        setCountryCode('')
        setPassword('')
        setConfirmPassword('')

        setNameError()
        setEmailError()
        setPhoneError()
        setCountryCodeError()
        setPasswordError()
        setConfirmPasswordError()
    }

    const submitForm = (e) => {

        e.preventDefault()

        if(!name) return setNameError(translations[lang]['Name is required'])

        if(!phone || !Number.parseInt(phone)) return setPhoneError(translations[lang]['Phone is required to be a number'])

        if(!countryCode || !Number.parseInt(countryCode)) return setCountryCodeError(translations[lang]['Country code is required to be a number'])

        if(!password) return setPasswordError(translations[lang]['Password is required'])

        if(password !== confirmPassword) return setConfirmPasswordError(translations[lang]['Password and confirm password are not the same']) 

        const newStaff = {
            clubId: targetClub,
            name,
            email,
            phone,
            countryCode: Number.parseInt(countryCode),
            password
        }

        const requestHeader = {
            headers: {
                'x-access-token': localStorageSecured.get('access-token')
            },
            params: { lang }
        }

        setIsSubmitting(true)

        serverRequest.post(`/staffs/${addedStaffRole}`, newStaff, requestHeader)
        .then(response => {

            setIsSubmitting(false)

            const successMessage = response.data.message

            toast.success(successMessage, { duration: 5000, position: 'top-right' })
            setReload(reload + 1)

            return resetForm()


        })
        .catch(errorResponse => {

            setIsSubmitting(false)

            try {

                const error = errorResponse.response

                if(error.data.field === 'name') return setNameError(error.data.message)

                if(error.data.field === 'email') return setEmailError(error.data.message)

                if(error.data.field === 'phone') return setPhoneError(error.data.message)

                if(error.data.field === 'countryCode') return setCountryCodeError(error.data.message)

                if(error.data.field === 'password') return setPasswordError(error.data.message)


                toast.error(error.data.message, { duration: 5000, position: 'top-right' })

            } catch(error) {
                console.error(error)
                toast.error('internal server error, please contact customer support', { duration: 5000, position: 'top-right' })

            }
            
        })
    }




    return (
        <div className="modal" id="staff-form-modal">
            <div className="container-fluid white form-container">
            <div className="row modal-content" style={{ margin: 0}}>
            <div className="col s12" style={{ marginBottom: '0rem' }}>
                    <h3 className="form-header">
                            { addedStaffRole === 'staff' ?
                            <span>
                                {translations[lang]['Add']} {translations[lang]['Staff']}
                            </span>
                            :
                            <span>
                                {translations[lang]['Add']} {translations[lang]['Club Admin']}
                            </span>
                            }
                            {
                                addedStaffRole === 'staff' ?
                                <div className="stat-icon">
                                    <span>
                                    <BadgeOutlinedIcon />
                                    </span>
                                </div>
                    
                                :
                                <div className="stat-icon">
                                    <span>
                                        <ManageAccountsOutlinedIcon />
                                    </span>
                                </div>
                            }
                    </h3>
                    <div className="divider form-divider"></div>
                </div>
                <form className="row" name="staff-form" id="staff-form" onSubmit={submitForm} autocomplete="off">
                    <div className="col s12 row">
                                <div className="input-field input-field-container col s12 m6">

                                    <input 
                                    type="text" 
                                    onChange={ e => setName(e.target.value) } 
                                    onClick={ e => {
                                        setNameError()
                                    }}
                                    style={nameError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                                    id="staff-name" 
                                    value={name}
                                    />

                                    { nameError ? 
                                    <label for="staff-name" style={{ color: '#f44336' }}>{nameError}</label> 
                                    : 
                                    <label for="staff-name">{translations[lang]['Name']}* ({translations[lang]['e.g.']} {translations[lang]['Medhat']})</label> 
                                    }

                                </div>
                                <div className="input-field input-field-container col s12 m6">
                                    <input 
                                    type="email" 
                                    onChange={ e => setEmail(e.target.value)} 
                                    onClick={ e => {
                                        setEmailError()
                                    }}
                                    style={emailError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                                    id="staff-email" 
                                    value={email} 
                                    />

                                    { emailError ? 
                                    <label for="staff-email" style={{ color: '#f44336' }}>{emailError}</label> 
                                    : 
                                    <label for="staff-email">{translations[lang]['Email']} ({translations[lang]['e.g.']} example@example.com)</label>
                                    }

                                </div>
                                <div className="input-field input-field-container col s12 m6">
                                    <input 
                                    type="text" 
                                    onChange={ e => setCountryCode(e.target.value)} 
                                    onClick={ e => {
                                        setCountryCodeError()
                                    } }
                                    style={countryCodeError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                                    id="staff-country-code" 
                                    default={countryCode}
                                    value={countryCode} 
                                    />

                                    { countryCodeError ? 
                                    <label for="staff-country-code" style={{ color: '#f44336' }}>{countryCodeError}</label> 
                                    : 
                                    <label for="staff-country-code">{translations[lang]['Phone Code']}* ({translations[lang]['e.g.']} 20)</label>
                                    }

                                </div>
                                <div className="input-field input-field-container col s12 m6">
                                    <input 
                                    type="text" 
                                    onChange={ e => setPhone(e.target.value)}
                                    onClick={ e => {
                                        setPhoneError()
                                    }}
                                    style={phoneError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null }  
                                    id="staff-phone" 
                                    value={phone} 
                                    />

                                    { phoneError ? 
                                    <label for="staff-phone" style={{ color: '#f44336' }}>{phoneError}</label> 
                                    : 
                                    <label for="staff-phone">{translations[lang]['Phone']}* ({translations[lang]['e.g.']} 1065630331)</label>
                                    }
                                </div>
                                <div className="input-field input-field-container col s12 m6">
                                    <input 
                                    type="password" 
                                    onChange={ e => setPassword(e.target.value)}
                                    onClick={ e => {
                                        setPasswordError()
                                    }}
                                    style={passwordError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null }  
                                    id="staff-password" 
                                    value={password} 
                                    />

                                    { passwordError ? 
                                    <label for="staff-password" style={{ color: '#f44336' }}>{passwordError}</label> 
                                    : 
                                    <label for="staff-password">{translations[lang]['Password']}* ({translations[lang]['e.g.']} ********)</label>
                                    }
                                </div>
                                <div className="input-field input-field-container col s12 m6">
                                    <input 
                                    type="password" 
                                    onChange={ e => setConfirmPassword(e.target.value)}
                                    onClick={ e => {
                                        setConfirmPasswordError()
                                    }}
                                    style={confirmPasswordError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null }  
                                    id="staff-confirm-password" 
                                    value={confirmPassword} 
                                    />

                                    { confirmPasswordError ? 
                                    <label for="staff-confirm-password" style={{ color: '#f44336' }}>{confirmPasswordError}</label> 
                                    : 
                                    <label for="staff-confirm-password">{translations[lang]['Confirm Password']}* ({translations[lang]['e.g.']} ********)</label>
                                    }
                                </div>
                                {
                                    isChooseClub ?
                                    <div className="input-field col s12 m6">
                                        <select onChange={e => setTargetClub(e.target.value)}>                                        
                                            { owner.clubs.map((club, index) => { 

                                                if(index === 0) {
                                                    return <option key={club._id} value={club._id} selected>
                                                        {club.clubCode} - {club.description}
                                                    </option> 
                                                } else {
                                                    return <option key={club._id} value={club._id} >
                                                                {club.clubCode} - {club.description}
                                                            </option> 
                                                }
                                                })

                                            }                                           

                                                
                                        </select>
                                        <label>{translations[lang]['Choose Club']}</label>
                                    </div>
                                :
                                null
                                }
                    </div>
                    <div className="col s12 m6">
                        <div className="row form-buttons-container" style={{ paddingLeft: '1rem' }}>
                            <div className="col s12 m4">
                                { isSubmitting ? 
                                <div className="center">
                                    <CircularLoadingButton />
                                </div> 
                                :
                                <button type="submit" className="btn blue">
                                 {translations[lang]['SUBMIT']}
                                </button> 
                                }
                            </div>
                            <div className="col s12 m4">
                                <button className="btn grey modal-close"onClick={e => {
                                    resetForm()
                                    e.preventDefault()

                                }}>
                                    {translations[lang]['CLOSE']}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        </div>
    )
}

export default ClubStaffForm