import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import ClubStaffsPaymentsTable from '../../../components/tables/club/club-staffs-payments'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/floating-button'
import StatDatePicker from '../../../components/forms/stats-date-picker-form'
import { config } from '../../../config/config'
import { format } from 'date-fns'
import translations from '../../../i18n'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'
import { useSelector } from 'react-redux'
import PageHeader from '../../../components/sections/headers/page-header'



const MainClubPaymentsPage = ({ roles }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }
    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    const user = useSelector(state => state.user.user)
    const accessToken = localStorageSecured.get('access-token')
    const todayDate = new Date()

    const [authorized, setAuthorized] = useState(false)
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [statQuery, setStatQuery] = useState({ specific: format(todayDate, 'yyyy-MM-dd') })

    const [payments, setPayments] = useState([])

    useEffect(() => {

        if(!isUserValid(accessToken, user, roles)) {
            setAuthorized(false)
            navigate('/clubs-admins/login')
        } else {
            setAuthorized(true)
        }
    }, [])

    useEffect(() => {

        setIsLoading(true)

        serverRequest.get(`/v2/registrations/clubs/${clubId}/staffs/payments`, {
            params: statQuery,
            headers
        })
        .then(response => {
            setIsLoading(false)

            const data = response.data
            setPayments(data.staffPayments) 
            
        })
        .catch(errorResponse => {
            setIsLoading(false)
            toast.error(translations[lang]['user-error'], { position: 'top-right', duration: config.TOAST_ERROR_TIME })
        })

    }, [reload, statQuery])



    return (
        <>
        {
            authorized
            &&
            <div className="blue-grey lighten-5">
            <Toaster />
            <StatDatePicker setStatQuery={setStatQuery} />
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar pageName={translations[lang]["Payments Receivers"]} statsQuery={statQuery} />
                        <div className="page-main">
                        <PageHeader pageName="Payments Receivers" reload={reload} setReload={setReload} />
                            <div className="row">
                                <div className="col s12">
                                    <ClubStaffsPaymentsTable 
                                    data={payments} 
                                    statsQuery={statQuery}
                                    currency={'EGP'}
                                    isRegistrationAdded={true}
                                    reload={reload}
                                    setReload={setReload}
                                    isLoading={isLoading} 
                                    isRefreshAdded={true}
                                    />
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
        </div>
        }
        </>
    )
}

export default MainClubPaymentsPage