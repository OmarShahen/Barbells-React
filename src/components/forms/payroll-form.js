import React, { useState, useEffect } from 'react'
import './form.css'
import { serverRequest } from '../../API/request'
import toast from 'react-hot-toast'
import CircularLoadingButton from '../buttons/loading-button'
import M from 'materialize-css'
import translations from '../../i18n'
import { localStorageSecured } from '../../security/localStorage'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'

const ClubPayrollForm = ({ staff }) => {

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const user = localStorageSecured.get('user')
    const lang = localStorage.getItem('lang')

    const [price, setPrice] = useState()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [priceError, setPriceError] = useState()


    useEffect(() => {
        M.AutoInit()
    }, [])


    const resetForm = () => {

        setPrice('')
        setPriceError()

        document.querySelector('#package-form').reset()

    }

    const submitForm = (e) => {

        e.preventDefault()

        if(!price || !Number.parseFloat(price)) return setPriceError('Payroll amount is required')
        
        const newPayment = {
            staffId: user._id,
            staffIdPayroll: staff._id,
            paid: Number.parseFloat(price), 
        }

        const requestHeader = {
            params: { lang },
            headers: {
                'x-access-token': localStorageSecured.get('access-token')
            }
        }

        setIsSubmitting(true)

        serverRequest.post(`/v1/payments/clubs/${clubId}/payrolls`, newPayment, requestHeader)
        .then(response => {

            setIsSubmitting(false)

            const successMessage = response.data.message
            toast.success(successMessage, { duration: 5000, position: 'top-right' })
            resetForm()

        })
        .catch(errorResponse => {

            setIsSubmitting(false)
            
            try {

            const error = errorResponse.response

            if(error.data.field === 'price') return setPriceError(error.data.message)

            toast.error(error.data.message, { duration: 5000, position: 'top-right' })

            } catch(error) {}

        })
    }

    return (
        <div className="modal" id="payroll-form-modal">
            <div className="container-fluid white form-container">
            <div className="row modal-content" style={{ margin: 0}}>
            <div className="col s12 form-header-container" style={{ marginBottom: '0rem' }}>
                <h3 className="form-header">
                        <span>
                            {translations[lang]['Payroll']}
                        </span>
                        <div className="stat-icon">
                            <span>
                                <PaymentsOutlinedIcon />
                            </span>
                        </div>
                    </h3>
                    <div className="divider form-divider"></div>
                </div>
                <form className="row modal-form" name="package-form" id="package-form" onSubmit={submitForm} autocomplete="off">
                    <div className="col s12 row">
                                
                        <div className="input-field input-field-container col s10 table-form-input">
                            <input 
                            type="text" 
                            onChange={ e => setPrice(e.target.value)} 
                            onClick={ e => {
                                setPriceError()
                            } }
                            style={priceError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                            id="package-price" 
                            value={price} 
                            min="1"
                            />

                            { priceError ? 
                            <label for="package-price" style={{ color: '#f44336' }}>{priceError}</label> 
                            : 
                            <label for="package-price">{translations[lang]['Price']}* ({translations[lang]['e.g.']} 500)</label>
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

export default ClubPayrollForm