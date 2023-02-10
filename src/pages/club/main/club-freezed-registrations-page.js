import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import ClubFreezedRegistrationsTable from '../../../components/tables/club/club-freezed-registrations'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import { config } from '../../../config/config'
import translations from '../../../i18n'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'
import { useSelector } from 'react-redux'
import PageHeader from '../../../components/sections/headers/page-header'




const MainClubFreezedRegistrationsPage = ({ roles }) => {

    const navigate = useNavigate()
    const headers = { 'x-access-token': localStorageSecured.get('access-token') }
    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    const user = useSelector(state => state.user.user)
    const accessToken = localStorageSecured.get('access-token')

    const [authorized, setAuthorized] = useState(false)
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [freezedRegistrations, setFreezedRegistrations] = useState([])

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

        serverRequest.get(`/v1/freeze-registrations/clubs/${clubId}`, {
            headers
        })
        .then(response => {

            setIsLoading(false)

            const data = response.data
            setFreezedRegistrations(data.freezedRegistrations)
            
        })
        .catch(errorResponse => {

            setIsLoading(false)

            toast.error(translations[lang]['user-error'], { position: 'top-right', duration: config.TOAST_ERROR_TIME })
        })
            

    }, [reload])



    return (
        <>
        {
            authorized
            &&
            <div className="blue-grey lighten-5">
            <Toaster />
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar pageName={translations[lang]["Freezed Registrations"]} />
                        <div className="page-main">
                            <PageHeader pageName="Freezed Registrations" reload={reload} setReload={setReload} />
                            <div className="row">
                                <div className="col s12">
                                    <ClubFreezedRegistrationsTable 
                                    data={freezedRegistrations} 
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

export default MainClubFreezedRegistrationsPage