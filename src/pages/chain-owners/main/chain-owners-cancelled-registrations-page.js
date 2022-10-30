import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/chain-owner-nav-bar'
import SideBar from '../../../components/navigation/chain-owner-side-bar'
import ClubCancelledRegistrationsTable from '../../../components/tables/club/club-cancelled-registrations'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import translations from '../../../i18n'
import { config } from '../../../config/config'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'


const MainChainOwnersCancelledRegistrationsPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const ownerId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    const user = localStorageSecured.get('user')
    const accessToken = localStorageSecured.get('access-token')

    const [authorized, setAuthorized] = useState(false)
    const [cancelledRegistrations, setCancelledRegistrations] = useState([])
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

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

        serverRequest.get(`/cancelled-registrations/chain-owners/${ownerId}`, {
            headers: {
                'x-access-token': accessToken
            }
        })
        .then(response => {

            setIsLoading(false)
            const cancelledRegistrations = response.data.cancelledRegistrations
            setCancelledRegistrations(cancelledRegistrations)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(translations[lang]['user-error'], { position: 'top-right', duration: config.TOAST_ERROR_TIME })

        })


    }, [reload])

    return (
        <>
        {
            authorized
            &&
            <div className="blue-grey lighten-5">
            <SideBar />
            <Toaster />
            <div className="page">
                <div className="col s12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <NavBar pageName={translations[lang]["Cancelled Registrations"]} />
                    <div className="page-main">
                        <ClubCancelledRegistrationsTable 
                        data={cancelledRegistrations} 
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

export default MainChainOwnersCancelledRegistrationsPage