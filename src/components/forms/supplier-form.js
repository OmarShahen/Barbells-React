import React, { useState, useEffect } from 'react'
import './form.css'
import { isDurationValid } from '../../utils/validateDuration'
import { serverRequest } from '../../API/request'
import toast from 'react-hot-toast'
import CircularLoadingButton from '../buttons/loading-button'
import M from 'materialize-css'
import translations from '../../i18n'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import { localStorageSecured } from '../../security/localStorage'
import { formatePhone } from '../../utils/phoneValidation'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined'

const ClubSupplierForm = ({ isChooseClub, reload, setReload }) => {

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const owner = localStorageSecured.get('user')
    const lang = localStorage.getItem('lang')

    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const [phone, setPhone] = useState()
    const [countryCode, setCountryCode] = useState(20)

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [nameError, setNameError] = useState()
    const [descriptionError, setDescriptionError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [countryCodeError, setCountryCodeError] = useState()

    useEffect(() => {
        M.AutoInit()
    }, [])


    const resetForm = () => {

        setName('')
        setDescription('')
        setPhone('')
        setCountryCode(20)

        setNameError()
        setDescriptionError()
        setPhoneError()
        setCountryCodeError()

        document.querySelector('#supplier-form').reset()

    }

    const submitForm = (e) => {

        e.preventDefault()

        if(!name) return setNameError(translations[lang]['Name is required'])

        if(!description) return setDescriptionError(translations[lang]['Description is required'])

        if(!countryCode) return setCountryCodeError(translations[lang]['Phone code is required'])

        if(!phone) return setPhoneError(translations[lang]['Phone is required'])
        
        const newSupplier = {
            name,
            description,
            countryCode,
            phone: formatePhone(phone)
        }

        const requestHeader = {
            params: { lang },
            headers: {
                'x-access-token': localStorageSecured.get('access-token')
            }
        }

        setIsSubmitting(true)

        serverRequest.post(`/v1/suppliers/clubs/${clubId}`, newSupplier, requestHeader)
        .then(response => {

            setIsSubmitting(false)

            const successMessage = response.data.message
            toast.success(successMessage, { duration: 5000, position: 'top-right' })
            resetForm()
            setReload(reload + 1)

        })
        .catch(errorResponse => {

            setIsSubmitting(false)
            
            try {

            const error = errorResponse.response

            if(error.data.field === 'name') return setNameError(error.data.message)

            if(error.data.field === 'description') return setDescriptionError(error.data.message)

            if(error.data.field === 'countryCode') return setCountryCodeError(error.data.message)

            if(error.data.field === 'phone') return setPhoneError(error.data.message)

            toast.error(error.data.message, { duration: 5000, position: 'top-right' })

            } catch(error) {}

        })
    }

    return (
        <div className="modal" id="supplier-form-modal">
            <div className="container-fluid white form-container">
            <div className="row modal-content" style={{ margin: 0}}>
            <div className="col s12 form-header-container" style={{ marginBottom: '0rem' }}>
                <h3 className="form-header">
                        <span>
                            {translations[lang]['Add Supplier']}
                        </span>
                        <div className="stat-icon">
                            <span>
                                <AssignmentIndOutlinedIcon />
                            </span>
                        </div>
                    </h3>
                    <div className="divider form-divider"></div>
                </div>
                <form className="row" name="supplier-form" id="supplier-form" onSubmit={submitForm} autocomplete="off">
                    <div className="col s12 row">
                                <div className="input-field input-field-container col s12 m6">

                                    <input 
                                    type="text" 
                                    onChange={ e => setName(e.target.value) } 
                                    onClick={ e => {
                                        setNameError()
                                    }}
                                    style={nameError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                                    id="supplier-name" 
                                    value={name}
                                    />

                                    { nameError ? 
                                    <label for="supplier-name" style={{ color: '#f44336' }}>{nameError}</label> 
                                    : 
                                    <label for="supplier-name">{translations[lang]['Name']}* ({translations[lang]['e.g.']}{translations[lang]['Medhat']})</label> 
                                    }

                                </div>
                                <div className="input-field input-field-container col s12 m6">
                                    <input 
                                    type="text" 
                                    onChange={ e => setDescription(e.target.value)} 
                                    onClick={ e => {
                                        setDescriptionError()
                                    }}
                                    style={descriptionError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                                    id="supplier-description" 
                                    value={description} 
                                    />

                                    { descriptionError ? 
                                    <label for="supplier-description" style={{ color: '#f44336' }}>{descriptionError}</label> 
                                    : 
                                    <label for="supplier-description">{translations[lang]['Description']}*</label>
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
                                    id="supplier-country-code" 
                                    value={countryCode} 
                                    />

                                    { countryCodeError ? 
                                    <label for="supplier-country-code" style={{ color: '#f44336' }}>{countryCodeError}</label> 
                                    : 
                                    <label for="supplier-country-code">{translations[lang]['Phone Code']}*</label>
                                    }

                                </div>
                                <div className="input-field input-field-container col s12 m6">
                                    <input 
                                    type="number" 
                                    onChange={ e => setPhone(e.target.value)} 
                                    onClick={ e => {
                                        setPhoneError()
                                    } }
                                    style={phoneError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                                    id="supplier-phone" 
                                    value={phone} 
                                    />

                                    { phoneError ? 
                                    <label for="supplier-phone" style={{ color: '#f44336' }}>{phoneError}</label> 
                                    : 
                                    <label for="supplier-phone">{translations[lang]['Phone']}*</label>
                                    }

                                </div>
                                
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
                                <button className="btn grey modal-close" onClick={e => {
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

export default ClubSupplierForm