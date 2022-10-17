import React, { useState, useEffect } from 'react'
import './form.css'
import { serverRequest } from '../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import CircularLoadingButton from '../buttons/loading-button'
import M from 'materialize-css'


const ChainOwnerForm = () => {

    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [phone, setPhone] = useState()
    const [countryCode, setCountryCode] = useState()
    const [password, setPassword] = useState()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [nameError, setNameError] = useState()
    const [emailError, setEmailError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [countryCodeError, setCountryCodeError] = useState()
    const [passwordError, setPasswordError] = useState()

    useEffect(() => {
        M.AutoInit()
    }, [])


    const resetForm = () => {

        setName('')
        setEmail('')
        setPhone('')
        setCountryCode('')
        setPassword('')

        setNameError()
        setEmailError()
        setPhoneError()
        setCountryCodeError()
        setPasswordError()

        document.querySelector('.modal').M_Modal.close()


    }

    const submitForm = (e) => {

        e.preventDefault()

        if(!name) return setNameError('owner name is required')

        if(!phone || !Number.parseInt(phone)) return setPhoneError('owner phone is required to be a number')

        if(!countryCode) return setCountryCodeError('owner country code is required to be a number')

        if(!password) return setPasswordError('owner password is required')


        const newowner = {
            name,
            email,
            phone: Number.parseInt(phone),
            countryCode: Number.parseInt(countryCode),
            password
        }

        const requestHeader = {
            headers: `${localStorage.getItem('access-token')}`
        }

        setIsSubmitting(true)

        serverRequest.post('/chain-owners', newowner, requestHeader)
        .then(response => {

            setIsSubmitting(false)

            const successMessage = response.data.message

            toast.success(successMessage, { duration: 5000, position: 'top-right' })

            return resetForm()


        })
        .catch(errorResponse => {

            setIsSubmitting(false)

            console.log(errorResponse)

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
        <div id="chain-owner-form" className="container-fluid white form-container modal">
            <div className="modal-content">
                <div className="col s12 m12" style={{ marginBottom: '0rem' }}>
                    <h3>
                        Chain Owner Form
                    </h3>
                </div>
                <form name="chain-owner-form" id="chain-owner-form" onSubmit={submitForm} autoComplete="off">
                    <div className="row">
                                <div className="input-field input-field-container col s12 m6">

                                    <input 
                                    type="text" 
                                    onChange={ e => setName(e.target.value) } 
                                    onClick={ e => {
                                        setNameError()
                                    }}
                                    style={nameError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                                    id="owner-name" 
                                    value={name} 
                                    required
                                    />

                                    { nameError ? 
                                    <label for="owner-name" style={{ color: '#f44336' }}>{nameError}</label> 
                                    : 
                                    <label for="owner-name">Owner Name* (e.g. Medhat Ahmed)</label> 
                                    }

                                </div>
                                <div className="input-field input-field-container col s12 m6">
                                    <input 
                                    type="email" 
                                    onChange={ e => setEmail(e.target.value)} 
                                    onClick={ e => {
                                        setEmailError()
                                    } }
                                    style={emailError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                                    id="owner-email" 
                                    value={email} 
                                    />

                                    { emailError ? 
                                    <label for="owner-email" style={{ color: '#f44336' }}>{emailError}</label> 
                                    : 
                                    <label for="owner-email">Owner Email (e.g. example@example.com)</label>
                                    }

                                </div>
                                <div className="input-field input-field-container col s12 m6">
                                    <input 
                                    type="number" 
                                    onChange={ e => setPhone(e.target.value)} 
                                    onClick={ e => {
                                        setPhoneError()
                                    } }
                                    style={ phoneError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                                    id="owner-phone" 
                                    value={phone}
                                    required
                                    />

                                    { phoneError ? 
                                    <label for="owner-phone" style={{ color: '#f44336' }}>{phoneError}</label> 
                                    : 
                                    <label for="owner-phone">Owner Phone* (e.g. 1065630331)</label>
                                    }

                                </div>
                                <div className="input-field input-field-container col s12 m6">
                                    <input 
                                    type="number" 
                                    onChange={ e => setCountryCode(e.target.value)}
                                    onClick={ e => {
                                        setCountryCodeError()
                                    } }
                                    style={countryCodeError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null }  
                                    id="owner-countryCode" 
                                    value={countryCode} 
                                    required
                                    />

                                    { countryCodeError ? 
                                    <label for="owner-countryCode" style={{ color: '#f44336' }}>{countryCodeError}</label> 
                                    : 
                                    <label for="owner-countryCode">Owner Country Code* (e.g. 20)</label>
                                    }
                                </div>
                                <div className="input-field input-field-container col s12 m6">
                                    <input 
                                    type="password" 
                                    onChange={ e => setPassword(e.target.value)}
                                    onClick={ e => {
                                        setPasswordError()
                                    } }
                                    style={passwordError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null }  
                                    id="owner-password" 
                                    value={password} 
                                    required
                                    />

                                    { passwordError ? 
                                    <label for="owner-password" style={{ color: '#f44336' }}>{passwordError}</label> 
                                    : 
                                    <label for="owner-password">Owner Password*</label>
                                    }
                                </div>
                                <div className="input-field col s12 m7">
                                    <div className="row">
                                            { isSubmitting ?
                                                <div className="col s12 m6 center">
                                                    <CircularLoadingButton />
                                                </div> 
                                                :
                                                <div className="col s12 m6" style={{ paddingLeft: '0' }}>
                                                    <button class="btn waves-effect blue waves-light" type="submit" name="chain-owner-form">
                                                        Submit
                                                    </button>
                                                </div>
                                            }
                                            <div className="col s12 hide-on-med-and-up" style={{ marginTop: '1rem' }}></div>
                                        <div className="col s12 m6" style={{ paddingLeft: '0' }}>
                                            <button class="btn waves-effect grey waves-light" type="reset" onClick={resetForm}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChainOwnerForm