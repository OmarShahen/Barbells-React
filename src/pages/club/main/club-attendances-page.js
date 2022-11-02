import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import ClubAdminSideBar from '../../../components/navigation/club-admin-side-bar'
import ClubAttendancesTable from '../../../components/tables/club/club-attendances'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import { config } from '../../../config/config'
import translations from '../../../i18n'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'
import StatDatePicker from '../../../components/forms/stats-date-picker-form'
import { format } from 'date-fns'
import FloatingFormButton from '../../../components/buttons/floating-button'

const MainClubAttendancesPage = ({ roles }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }
    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    const user = localStorageSecured.get('user')
    const accessToken = localStorageSecured.get('access-token')

    const [authorized, setAuthorized] = useState(false)
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [attendances, setAttendances] = useState([])

    const todayDate = new Date()
    const monthDate = new Date()
    monthDate.setDate(monthDate.getDate() - 30)
    todayDate.setDate(todayDate.getDate() + 1)

    const [statsQuery, setStatsQuery] = useState({ 
        from: format(monthDate, 'yyyy-MM-dd'), 
        to: format(todayDate, 'yyyy-MM-dd') 
    })

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

        serverRequest.get(`/attendances/clubs/${clubId}`, {
            headers,
            params: statsQuery
        })
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setAttendances(data.attendances)    
        })
        .catch(errorResponse => {
            setIsLoading(false)
            toast.error(translations[lang]['user-error'], { position: 'top-right', duration: config.TOAST_ERROR_TIME })
        })         

    }, [reload, statsQuery])



    return (
        <>
        {
            authorized
            &&
            <div className="blue-grey lighten-5">
            <ClubAdminSideBar />
            <Toaster />
            <FloatingFormButton />
            <StatDatePicker setStatQuery={setStatsQuery}/>
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar pageName={translations[lang]["Attendances"]} statsQuery={statsQuery} />
                        <div className="page-main">
                            <div className="row">
                                <div className="col s12">
                                    <ClubAttendancesTable 
                                    data={attendances} 
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

export default MainClubAttendancesPage