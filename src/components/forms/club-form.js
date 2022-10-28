import React, { useState, useEffect } from 'react'
import './form.css'
import { serverRequest } from '../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import CircularLoadingButton from '../buttons/loading-button'
import M from 'materialize-css'
import { localStorageSecured } from '../../security/localStorage'

const ClubForm = () => {

    const pagePath = window.location.pathname
    const ownerName = pagePath.split('/')[2]
    const ownerId = pagePath.split('/')[3]

    

    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const [phone, setPhone] = useState()
    const [countryCode, setCountryCode] = useState()
    const [country, setCountry] = useState()
    const [city, setCity] = useState()
    const [address, setAddress] = useState()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [nameError, setNameError] = useState()
    const [descriptionError, setDescriptionError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [countryCodeError, setCountryCodeError] = useState()
    const [countryError, setCountryError] = useState()
    const [cityError, setCityError] = useState()
    const [addressError, setAddressError] = useState()

    useEffect(() => {
        M.AutoInit()
    }, [])


    const resetForm = () => {

        setName('')
        setDescription('')
        setPhone('')
        setCountryCode('')
        setCountry('')
        setCity('')
        setAddress('')

        setNameError()
        setDescriptionError()
        setPhoneError()
        setCountryCodeError()
        setCountryError()
        setCityError()
        setAddressError()


        document.querySelector('#club-form').reset()
        document.querySelector('.modal').M_Modal.close()

    }

    const submitForm = (e) => {

        e.preventDefault()

        if(!name) return setNameError('club name is required')

        if(!description) return setDescriptionError('club description is required')

        if(!phone || !Number.parseInt(phone)) return setPhoneError('club phone is required to be a number')

        if(!Number.parseInt(countryCode)) return setCountryCodeError('club country code is required to be a number')

        if(!country) return setCountryError('club country is required')

        if(!city) return setCityError('club city is required')

        if(!address) return setAddressError('club address is required')


        const newClub = {
            ownerId,
            name,
            description,
            phone: Number.parseInt(phone),
            countryCode: Number.parseInt(countryCode),
            location: { country, city, address }
        }

        const requestHeader = {
            headers: {
                'x-access-token': localStorageSecured.get('access-token')
            }
        }

        setIsSubmitting(true)

        serverRequest.post('/clubs', newClub, requestHeader)
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

                if(error.data.field === 'description') return setDescriptionError(error.data.message)

                if(error.data.field === 'phone') return setPhoneError(error.data.message)

                if(error.data.field === 'countryCode') return setCountryCodeError(error.data.message)

                if(error.data.field === 'country') return setCountryError(error.data.message)

                if(error.data.field === 'city') return setCityError(error.data.message)

                if(error.data.field === 'address') return setAddressError(error.data.message)


                toast.error(error.data.message, { duration: 5000, position: 'top-right' })

            } catch(error) {
                console.error(error)
                toast.error('internal server error, please contact customer support', { duration: 5000, position: 'top-right' })

            }
            
        })
    }

    return (
        <div id="club-form-modal" className="container white form-container modal">
            <div className="modal-content">
                <div className="col s12" style={{ marginBottom: '0rem' }}>
                    <h3>
                        Club Form
                    </h3>
                </div>
                <form className="row" name="club-form" id="club-form" onSubmit={submitForm} autoComplete="off">
                        <div className="input-field input-field-container col s12 m6">
                            <input 
                            type="text" 
                            onChange={ e => setName(e.target.value) } 
                            onClick={ e => {
                                setNameError()
                            }}
                            style={nameError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                            id="club-name" 
                            value={name} 
                            required
                            />

                            { nameError ? 
                            <label for="club-name" style={{ color: '#f44336' }}>{nameError}</label> 
                            : 
                            <label for="club-name">Club Name* (e.g. Mr.Olympia)</label> 
                            }

                        </div>
                        <div className="input-field input-field-container col s12 m6">
                            <input 
                            type="text" 
                            onChange={ e => setDescription(e.target.value)} 
                            onClick={ e => {
                                setDescriptionError()
                            } }
                            style={descriptionError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                            id="owner-email" 
                            value={description} 
                            required
                            />

                            { descriptionError ? 
                            <label for="club-description" style={{ color: '#f44336' }}>{descriptionError}</label> 
                            : 
                            <label for="club-description">Club Description* (e.g. Alexandria Branch)</label>
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
                            id="club-phone" 
                            value={phone}
                            required
                            />

                            { phoneError ? 
                            <label for="club-phone" style={{ color: '#f44336' }}>{phoneError}</label> 
                            : 
                            <label for="club-phone">Club Phone* (e.g. 20)</label>
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
                            id="club-countryCode" 
                            value={countryCode} 
                            required
                            />

                            { countryCodeError ? 
                            <label for="club-countryCode" style={{ color: '#f44336' }}>{countryCodeError}</label> 
                            : 
                            <label for="club-countryCode">Club Country Code* (e.g. 20)</label>
                            }
                        </div>
                        <div className="input-field input-field-container col s12 m6">
                            <input 
                            type="text" 
                            onChange={ e => setCountry(e.target.value)}
                            onClick={ e => {
                                setCountryError()
                            } }
                            style={countryError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null }  
                            id="club-country" 
                            value={country} 
                            required
                            />

                            { countryError ? 
                            <label for="club-country" style={{ color: '#f44336' }}>{countryError}</label> 
                            : 
                            <label for="club-country">Club Country* (e.g. Egypt)</label>
                            }
                        </div>
                        <div className="input-field input-field-container col s12 m6">
                            <input 
                            type="text" 
                            onChange={ e => setCity(e.target.value)}
                            onClick={ e => {
                                setCityError()
                            } }
                            style={cityError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null }  
                            id="club-city" 
                            value={city} 
                            required
                            />

                            { cityError ? 
                            <label for="club-city" style={{ color: '#f44336' }}>{cityError}</label> 
                            : 
                            <label for="club-city">Club City* (e.g. Alexandria)</label>
                            }
                        </div>
                        <div className="input-field input-field-container col s12 m6">
                            <input 
                            type="text" 
                            onChange={ e => setAddress(e.target.value)}
                            onClick={ e => {
                                setAddressError()
                            } }
                            style={addressError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null }  
                            id="club-address" 
                            value={address} 
                            required
                            />

                            { addressError ? 
                            <label for="club-address" style={{ color: '#f44336' }}>{addressError}</label> 
                            : 
                            <label for="club-address">Club Address* (e.g. 19, mostafa kamel)</label>
                            }
                        </div>
                        <div className="col s12">
                            <div className="row">
                                    { isSubmitting ?
                                        <div className="col s12 m6 center">
                                            <CircularLoadingButton />
                                        </div> 
                                        :
                                        <div className="col s12 m6" style={{ paddingLeft: '0' }}>
                                            <button class="btn waves-effect blue waves-light">
                                                SUBMIT
                                            </button>
                                        </div>
                                    }
                                <div className="col s12 m6" style={{ paddingLeft: '0' }}>
                                    <button class="btn waves-effect grey waves-light" type="reset" onClick={resetForm}>CANCEL</button>
                                </div>
                            </div>
                        </div>
                </form>
            </div>
        </div>
    )
}

export default ClubForm