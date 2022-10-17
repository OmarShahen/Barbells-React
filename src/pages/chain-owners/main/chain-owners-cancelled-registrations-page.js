import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/chain-owner-nav-bar'
import SideBar from '../../../components/navigation/chain-owner-side-bar'
import ClubCancelledRegistrationsTable from '../../../components/tables/club/club-cancelled-registrations'
import { serverRequest } from '../../../API/request'
import { format } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/forms-floating-button'
import translations from '../../../i18n'
import { config } from '../../../config/config'


const MainChainOwnersCancelledRegistrationsPage = () => {

    const pagePath = window.location.pathname
    const ownerId = pagePath.split('/')[3]
    const lang = localStorage.getItem('lang')


    const [cancelledRegistrations, setCancelledRegistrations] = useState([])
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])
      
    useEffect(() => {

        setIsLoading(true)

        serverRequest.get(`/cancelled-registrations/chain-owners/${ownerId}`, {
            headers: {
                'x-access-token': localStorage.getItem('access-token')
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
        <div className="blue-grey lighten-5">
            <SideBar />
            <Toaster />
            <div className="row page">
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
    )
}

export default MainChainOwnersCancelledRegistrationsPage