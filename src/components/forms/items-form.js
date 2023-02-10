import React, { useState, useEffect } from 'react'
import './form.css'
import { serverRequest } from '../../API/request'
import toast from 'react-hot-toast'
import CircularLoadingButton from '../buttons/loading-button'
import M from 'materialize-css'
import translations from '../../i18n'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import { localStorageSecured } from '../../security/localStorage'
import { formatePhone } from '../../utils/phoneValidation'
import LocalDrinkOutlinedIcon from '@mui/icons-material/LocalDrinkOutlined'

const ClubItemForm = ({ isChooseClub, reload, setReload }) => {

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')

    const [name, setName] = useState()
    const [price, setPrice] = useState()
    const [amount, setAmount] = useState('0')
    const [barcode, setBarcode] = useState()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [nameError, setNameError] = useState()
    const [priceError, setPriceError] = useState()
    const [amountError, setAmountError] = useState()
    const [barcodeError, setBarcodeError] = useState()

    useEffect(() => {
        M.AutoInit()
    }, [])


    const resetForm = () => {

        setName('')
        setPrice('')
        setAmount('0')
        setBarcode('')

        setNameError()
        setPriceError()
        setAmountError()
        setBarcodeError()

        document.querySelector('#item-form').reset()

    }

    const submitForm = (e) => {

        e.preventDefault()

        if(!name) return setNameError(translations[lang]['Name is required'])

        if(!amount) return setAmountError(translations[lang]['Amount is required'])

        if(!price) return setPriceError(translations[lang]['Price is required'])

        let validBarcode = barcode ? Number.parseInt(barcode) : undefined

        const newItem = {
            name,
            initialStock: Number.parseInt(amount),
            price: Number.parseFloat(price),
            barcode: validBarcode
        }

        const requestHeader = {
            params: { lang },
            headers: {
                'x-access-token': localStorageSecured.get('access-token')
            }
        }

        setIsSubmitting(true)

        serverRequest.post(`/v1/items/clubs/${clubId}`, newItem, requestHeader)
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

            if(error.data.field === 'amount') return setAmountError(error.data.message)

            if(error.data.field === 'price') return setPriceError(error.data.message)

            if(error.data.field === 'barcode') return setBarcodeError(error.data.message)

            toast.error(error.data.message, { duration: 5000, position: 'top-right' })

            } catch(error) {}

        })
    }

    return (
        <div className="modal" id="item-form-modal">
            <div className="container-fluid white form-container">
            <div className="row modal-content" style={{ margin: 0}}>
            <div className="col s12 form-header-container" style={{ marginBottom: '0rem' }}>
                <h3 className="form-header">
                        <span>
                            {translations[lang]['Add Item']}
                        </span>
                        <div className="stat-icon">
                            <span>
                                <LocalDrinkOutlinedIcon />
                            </span>
                        </div>
                    </h3>
                    <div className="divider form-divider"></div>
                </div>
                <form className="row" name="item-form" id="item-form" onSubmit={submitForm} autocomplete="off">
                    <div className="col s12 row">
                                <div className="input-field input-field-container col s12 m6">

                                    <input 
                                    type="text" 
                                    onChange={ e => setName(e.target.value) } 
                                    onClick={ e => {
                                        setNameError()
                                    }}
                                    style={nameError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                                    id="item-name" 
                                    value={name}
                                    />

                                    { nameError ? 
                                    <label for="item-name" style={{ color: '#f44336' }}>{nameError}</label> 
                                    : 
                                    <label for="item-name">{translations[lang]['Name']}*</label> 
                                    }

                                </div>
                                <div className="input-field input-field-container col s12 m6">
                                    <input 
                                    type="number" 
                                    onChange={ e => setAmount(e.target.value)} 
                                    onClick={ e => {
                                        setAmountError()
                                    }}
                                    style={amountError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                                    id="item-amount" 
                                    value={amount} 
                                    />

                                    { amountError ? 
                                    <label for="item-amount" style={{ color: '#f44336' }}>{amountError}</label> 
                                    : 
                                    <label for="item-amount">{translations[lang]['Amount']}*</label>
                                    }

                                </div>
                                <div className="input-field input-field-container col s12 m6">
                                    <input 
                                    type="number" 
                                    onChange={ e => setPrice(e.target.value)} 
                                    onClick={ e => {
                                        setPriceError()
                                    } }
                                    style={priceError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                                    id="item-price" 
                                    value={price} 
                                    />

                                    { priceError ? 
                                    <label for="item-price" style={{ color: '#f44336' }}>{priceError}</label> 
                                    : 
                                    <label for="item-price">{translations[lang]['Price']}*</label>
                                    }

                                </div>
                                <div className="input-field input-field-container col s12 m6">
                                    <input 
                                    type="number" 
                                    onChange={ e => setBarcode(e.target.value)} 
                                    onClick={ e => {
                                        setBarcodeError()
                                    } }
                                    style={barcodeError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                                    id="item-barcode" 
                                    value={barcode} 
                                    />

                                    { barcodeError ? 
                                    <label for="item-barcode" style={{ color: '#f44336' }}>{barcodeError}</label> 
                                    : 
                                    <label for="item-barcode">{translations[lang]['Barcode']}*</label>
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

export default ClubItemForm