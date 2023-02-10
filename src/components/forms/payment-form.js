import React, { useState, useEffect } from 'react'
import './form.css'
import { serverRequest } from '../../API/request'
import toast from 'react-hot-toast'
import CircularLoadingButton from '../buttons/loading-button'
import translations from '../../i18n'
import { localStorageSecured } from '../../security/localStorage'
import { config } from '../../config/config'
import PaymentIcon from '@mui/icons-material/Payment'


const ClubPaymentForm = ({ setReload, reload, category }) => {


    const lang = localStorage.getItem('lang')
    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const [type, setType] = useState('DEDUCT')
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState(1)
    const [price, setPrice] = useState()

    const [descriptionError, setDescriptionError] = useState()
    const [amountError, setAmountError] = useState()
    const [priceError, setPriceError] = useState()

    const [isSubmitting, setIsSubmitting] = useState(false)


    const resetForm = () => {

        setDescription('')
        setPrice('')
        setAmount(1)
        setType('DEDUCT')

        setDescriptionError()
        setAmountError()
        setPriceError()

        document.querySelector('#payment-form').reset()

    }

    const getDescriptionField = () => {
        return <div className="input-field input-field-container col s12 table-form-input">
        <input
        type="text"
        onChange={e => setDescription(e.target.value)}
        onClick={e => setDescriptionError()}
        id="description"
        value={description}
        style={descriptionError ? { borderBottom: '1px solid #f44336 !important', boxShadow: '0 1px 0 0 #f44336 !important' } : null } 
        />

        { descriptionError ? 
        <label for="description" style={{ color: '#f44336' }}>{descriptionError}</label> 
        : 
        <label for="description">{translations[lang]['Description']}*</label>
        }
    </div>
    }

    const getPageName = (category) => {

        if(category === 'inventory') {
            return 'Inventory Payment'
        } else if(category === 'payroll') {
            return 'Payrolls'
        } else if(category === 'maintenance') {
            return 'Maintenance Payment'
        } else if(category === 'bill') {
            return 'Bill Payment'
        }
    }

    const submitForm = (e) => {
        e.preventDefault()

        if(!description) return setDescriptionError(translations[lang]['Description is required'])

        if(!price) return setPriceError(translations[lang]['Price is required'])

        const staffId = localStorageSecured.get('user')._id

        const payment = { 
            staffId,
            description, 
            paid: Number.parseFloat(price)
        }

        const requestHeader = {
            headers: {
                'x-access-token': localStorageSecured.get('access-token')
            },
            params: { lang }
        }

        setIsSubmitting(true)
        serverRequest.post(`/v1/payments/clubs/${clubId}/${category === 'bill' ? 'bills' : 'maintenance'}`, payment, requestHeader)
        .then(response => {
            setIsSubmitting(false)
            setReload(reload + 1)
            resetForm()
            toast.success(response.data.message, { position: 'top-right', duration: config.TOAST_SUCCESS_TIME })
        })
        .catch(error => {
            console.error(error)
            try {
                setIsSubmitting(false)
                const responseError = error.response.data

                if(responseError.field === 'description') {
                    return setDescriptionError(responseError.message)
                } else if(responseError.field === 'price') {
                    return setPriceError(responseError.message)
                }

            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: config.TOAST_ERROR_TIME })
            }
        })

    }

    return (
        <div className="modal" id="payment-form-modal">
            <div className="container-fluid white form-container">
            <div className="row modal-content" style={{ margin: 0}}>
            <div className="col s12 form-header-container" style={{ marginBottom: '0rem' }}>
                <h3 className="form-header">
                        <span>
                            {translations[lang][getPageName(category)]}
                        </span>
                        <div className="stat-icon">
                            <span>
                                <PaymentIcon />
                            </span>
                        </div>
                    </h3>
                    <div className="divider form-divider"></div>
                </div>
                <form className="row" name="payment-form" onSubmit={submitForm} id="payment-form" autocomplete="off">
                    <div className="col s12 row">
                        {
                            getDescriptionField()
                        }
                        
                        {
                            category === 'inventory' ?
                            <div className="input-field input-field-container col s12 table-form-input">  
                                    <select onChange={e => setType(e.target.value)}>  
                                        <option value="EARN" selected>{translations[lang]['Earn']}</option>    
                                        <option value="DEDUCT">{translations[lang]['Deduct']}</option>                                                                                                                       
                                    </select>
                                <label>{translations[lang]['Payment Type']}</label>
                            </div>
                            :
                            null
                        }
                            {
                                category === 'inventory' 
                                &&
                                <div className="input-field input-field-container col s12 table-form-input">
                                    <input
                                    type="number"
                                    onChange={e => setAmount(e.target.value)}
                                    onClick={e => setAmountError()}
                                    id="amount"
                                    value={amount}
                                    style={amountError ? { borderBottom: '1px solid #f44336 !important', boxShadow: '0 1px 0 0 #f44336 !important' } : null } 
                                    />

                                    { amountError ? 
                                    <label for="amount" style={{ color: '#f44336' }}>{amountError}</label> 
                                    : 
                                    <label for="amount">{translations[lang]['Amount']}*</label>
                                    }
                                </div> 
                            }
                        
                        <div className="input-field input-field-container col s12 table-form-input">
                            <input
                            type="number"
                            onChange={e => setPrice(e.target.value)}
                            onClick={e => setPriceError()}
                            id="price"
                            value={price}
                            style={priceError ? { borderBottom: '1px solid #f44336 !important', boxShadow: '0 1px 0 0 #f44336 !important' } : null } 
                            />

                            { priceError ? 
                            <label for="price" style={{ color: '#f44336' }}>{priceError}</label> 
                            : 
                            <label for="price">{translations[lang]['Price']}*</label>
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
                                 {translations[lang]['SEND']}
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

export default ClubPaymentForm