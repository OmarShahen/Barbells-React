import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/chain-owner-nav-bar'
import SideBar from '../../../components/navigation/chain-owner-side-bar'
import ClubAttendancesTable from '../../../components/tables/club/club-attendances'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import translations from '../../../i18n'
import { config } from '../../../config/config'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'
import StatDatePicker from '../../../components/forms/stats-date-picker-form'
import FloatingFormButton from '../../../components/buttons/floating-button'
import { format } from 'date-fns'



const MainChainOwnersAttendancesPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const ownerId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    const user = localStorageSecured.get('user')
    const accessToken = localStorageSecured.get('access-token')

    const [authorized, setAuthorized] = useState(false)
    const [attendances, setAttendances] = useState([])
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

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
            navigate('/chains-owners/login')
        } else {
            setAuthorized(true)
        }
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])
      
    useEffect(() => {

        setIsLoading(true)

        serverRequest.get(`/attendances/chain-owners/${ownerId}`, {
            headers: {
                'x-access-token': accessToken
            },
            params: statsQuery
        })
        .then(response => {

            setIsLoading(false)

            const attendances = response.data.attendances
            setAttendances(attendances)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(translations[lang]['user-error'], { position: 'top-right', duration: config.TOAST_ERROR_TIME })

        })


    }, [reload, statsQuery])

    return (
        <>
        {
            authorized
            &&
            <div className="blue-grey lighten-5">
            <SideBar />
            <Toaster />
            <FloatingFormButton />
            <StatDatePicker setStatQuery={setStatsQuery} />
            <div className="page">
                <div className="col s12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <NavBar pageName={translations[lang]['Attendances']} statsQuery={statsQuery} />
                    <div className="page-main">
                        <ClubAttendancesTable 
                        data={attendances} 
                        isClub={true} 
                        reload={reload}
                        setReload={setReload}
                        isLoading={isLoading} 
                        isRefreshAdded={true}
                        />
                    </div>
                </div>
            </div>
        </div>
        }
        </>
    )
}

export default MainChainOwnersAttendancesPage