import React, { useState, useEffect } from 'react'
import './form.css'
import { serverRequest } from '../../API/request'
import toast from 'react-hot-toast'
import CircularLoadingButton from '../buttons/loading-button'
import M from 'materialize-css'
import translations from '../../i18n'
import { localStorageSecured } from '../../security/localStorage'
import { config } from '../../config/config'
import SendIcon from '@mui/icons-material/Send'

const ClubOfferMessageTemplateForm = ({ setReload, reload }) => {
    
    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]
    const lang = localStorage.getItem('lang')

    const [templateName, setTemplateName] = useState()
    const [message, setMessage] = useState()
    const [language, setLanguage] = useState('ar')

    const [templateNameError, setTemplateNameError] = useState()
    const [messageError, setMessageError] = useState()

    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        M.AutoInit()
    }, [])

    const resetForm = () => {

        setTemplateName('')
        setMessage('')

        setTemplateNameError()
        setMessageError()

        document.querySelector('#template-message-form').reset()

    }

    const submitForm = (e) => {

        e.preventDefault()

        if(!templateName) return setTemplateNameError(translations[lang]['Offer name is required'])

        if(!message) return setMessageError(translations[lang]['Message is required'])

        const newOfferTemplate = {
            name: templateName,
            message,
            languageCode: language
        }

        const requestHeader = {
            params: { lang },
            headers: {
                'x-access-token': localStorageSecured.get('access-token')
            }
        }

        setIsSubmitting(true)
        serverRequest.post(`/v1/offers-messages/clubs/${clubId}`, newOfferTemplate, requestHeader)
        .then(response => {
            setIsSubmitting(false)
            resetForm()
            setReload(reload + 1)
            toast.success(response.data.message, { position: 'top-right', duration: config.TOAST_SUCCESS_TIME })
        })
        .catch(error => {
            setIsSubmitting(false)

            const errorResponse = error.response.data

            if(errorResponse.field === 'name') return setTemplateNameError(errorResponse.message)

            if(errorResponse.field === 'message') return setMessageError(errorResponse.message)

            toast.error(errorResponse.message, { position: 'top-right', duration: config.TOAST_ERROR_TIME})
        })
    }

    return (
        <div className="modal" id="template-message-form-modal">
            <div className="container-fluid white form-container">
            <div className="row modal-content" style={{ margin: 0}}>
            <div className="col s12 form-header-container" style={{ marginBottom: '0rem' }}>
                <h3 className="form-header">
                        <span>
                            {translations[lang]['Add Offer Message']}
                        </span>
                        <div className="stat-icon">
                            <span>
                                <SendIcon />
                            </span>
                        </div>
                    </h3>
                    <div className="divider form-divider"></div>
                </div>
                <form className="row" name="template-message-form" onSubmit={submitForm} id="template-message-form" autocomplete="off">
                    <div className="col s12 row">
                        <div className="input-field input-field-container col s12 m10">
                            <input
                            type="text"
                            onChange={e => setTemplateName(e.target.value)}
                            onClick={e => setTemplateNameError()}
                            id="offer-template-name"
                            style={templateNameError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                            />

                            { templateNameError ? 
                            <label for="offer-template-name" style={{ color: '#f44336' }}>{templateNameError}</label> 
                            : 
                            <label for="offer-template-name">{translations[lang]['Offer Name']}*</label>
                            }
                        </div>
                        <div className="input-field input-field-container col s12 m2">
                            <select onChange={e => setLanguage(e.target.value)}>
                                <option value="ar" selected>عربي</option>
                                <option value="en">English</option>
                            </select>
                            <label>{translations[lang]['Choose Language']}</label>
                    </div>
                        <div className="input-field input-field-container col s12">
                            <input
                            type="text"
                            onChange={e => setMessage(e.target.value)}
                            onClick={e => setMessageError()}
                            id="offer-template-message"
                            style={messageError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                            />

                            { messageError ? 
                            <label for="offer-template-message" style={{ color: '#f44336' }}>{messageError}</label> 
                            : 
                            <label for="offer-template-message">{translations[lang]['Message']}*</label>
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
                            <div className="col s12 m3">
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

export default ClubOfferMessageTemplateForm