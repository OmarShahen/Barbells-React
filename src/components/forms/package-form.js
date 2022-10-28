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

const ClubPackageForm = ({ isChooseClub, reload, setReload }) => {

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const owner = localStorageSecured.get('user')
    const lang = localStorage.getItem('lang')

    const [title, setTitle] = useState()
    const [attendance, setAttendance] = useState()
    const [price, setPrice] = useState()
    const [duration, setDuration] = useState()
    const [targetClub, setTargetClub] = useState(
        isChooseClub && owner.clubs.length !== 0 ? owner.clubs[0]._id : clubId 
    )

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [titleError, setTitleError] = useState()
    const [attendanceError, setAttendanceError] = useState()
    const [priceError, setPriceError] = useState()
    const [durationError, setDurationError] = useState()

    useEffect(() => {
        M.AutoInit()
    }, [])


    const resetForm = () => {

        setTitle('')
        setAttendance('')
        setPrice('')
        setDuration('')

        setTitleError()
        setAttendanceError()
        setPriceError()
        setDurationError()

        document.querySelector('#package-form').reset()

    }

    const submitForm = (e) => {

        e.preventDefault()

        if(!title) return setTitleError('package title is required')

        if(!attendance || !Number.parseInt(attendance)) return setAttendanceError('package attendance is required to be a number')

        if(!price || !Number.parseFloat(price)) return setPriceError('package price is required to be a number')

        if(!duration) return setDurationError('package duration is required to be a number')

        const validateDuration = isDurationValid(duration)

        if(!validateDuration.isAccepted) return setDurationError(validateDuration.message)

        const newPackage = {
            clubId: targetClub,
            title,
            attendance: Number.parseInt(attendance),
            price: Number.parseFloat(price),
            expiresIn: duration
        }

        const requestHeader = {
            headers: {
                'x-access-token': localStorageSecured.get('access-token')
            }
        }

        setIsSubmitting(true)

        serverRequest.post('/packages', newPackage, requestHeader)
        .then(response => {

            setIsSubmitting(false)

            const successMessage = response.data.message

            toast.success(successMessage, { duration: 5000, position: 'top-right' })

            document.querySelector('.modal').M_Modal.close()

            setReload(reload + 1)

            return resetForm()


        })
        .catch(errorResponse => {

            setIsSubmitting(false)
            
            try {

            const error = errorResponse.response

            if(error.data.field === 'title') return setTitleError(error.data.message)

            if(error.data.field === 'attendance') return setAttendanceError(error.data.message)

            if(error.data.field === 'price') return setPriceError(error.data.message)

            if(error.data.field === 'expiresIn') return setDurationError(error.data.message)


            toast.error(error.data.message, { duration: 5000, position: 'top-right' })

            } catch(error) {
                console.error(error)
                toast.error('internal server error, please contact customer support', { duration: 5000, position: 'top-right' })
            }
        })
    }




    return (
        <div className="modal" id="package-form-modal">
            <div className="container-fluid white form-container">
            <div className="row modal-content" style={{ margin: 0}}>
            <div className="col s12 form-header-container" style={{ marginBottom: '0rem' }}>
                <h3 className="form-header">
                        <span>
                            {translations[lang]['Add']} {translations[lang]['Package']}
                        </span>
                        <div className="stat-icon">
                            <span>
                                <AppsOutlinedIcon />
                            </span>
                        </div>
                    </h3>
                    <div className="divider form-divider"></div>
                </div>
                <form className="row" name="package-form" id="package-form" onSubmit={submitForm} autocomplete="off">
                    <div className="col s12 row">
                                <div className="input-field input-field-container col s12 m6">

                                    <input 
                                    type="text" 
                                    onChange={ e => setTitle(e.target.value) } 
                                    onClick={ e => {
                                        setTitleError()
                                    }}
                                    style={titleError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                                    id="package-title" 
                                    value={title}
                                    />

                                    { titleError ? 
                                    <label for="package-title" style={{ color: '#f44336' }}>{titleError}</label> 
                                    : 
                                    <label for="package-title">{translations[lang]['Title']}* ({translations[lang]['e.g.']}{translations[lang]['Monthly']})</label> 
                                    }

                                </div>
                                <div className="input-field input-field-container col s12 m6">
                                    <input 
                                    type="number" 
                                    onChange={ e => setAttendance(e.target.value)} 
                                    onClick={ e => {
                                        setAttendanceError()
                                    }}
                                    style={attendanceError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null } 
                                    id="package-attendance" 
                                    value={attendance} 
                                    min="1"
                                    />

                                    { attendanceError ? 
                                    <label for="package-attendance" style={{ color: '#f44336' }}>{attendanceError}</label> 
                                    : 
                                    <label for="package-attendance">{translations[lang]['Attendance']}* ({translations[lang]['e.g.']}30)</label>
                                    }

                                </div>
                                <div className="input-field input-field-container col s12 m6">
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
                                <div className="input-field input-field-container col s12 m6">
                                    <input 
                                    type="text" 
                                    onChange={ e => setDuration(e.target.value)}
                                    onClick={ e => {
                                        setDurationError()
                                    }}
                                    style={durationError ? { borderBottom: '1px solid #f44336 ', boxShadow: '0 1px 0 0 #f44336 ' } : null }  
                                    id="package-duration" 
                                    value={duration} 
                                    />

                                    { durationError ? 
                                    <label for="package-duration" style={{ color: '#f44336' }}>{durationError}</label> 
                                    : 
                                    <label for="package-duration">{translations[lang]['Duration']}* ({translations[lang]['e.g.']} 1 {translations[lang]['month']})</label>
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

export default ClubPackageForm