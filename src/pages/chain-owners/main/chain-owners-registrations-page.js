import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/chain-owner-nav-bar'
import SideBar from '../../../components/navigation/chain-owner-side-bar'
import ClubRegistrationsTable from '../../../components/tables/club/club-registrations'
import { serverRequest } from '../../../API/request'
import { format } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/forms-floating-button'
import translations from '../../../i18n'
import { config } from '../../../config/config'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'


const MainChainOwnersRegistrationsPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const ownerId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    const user = JSON.parse(localStorage.getItem('user'))
    const accessToken = JSON.parse(localStorage.getItem('access-token'))

    const [authorized, setAuthorized] = useState(false)
    const [registrations, setRegistrations] = useState([])
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

        setIsLoading(true)

        serverRequest.get(`/registrations/chain-owners/${ownerId}`, {
            headers: {
                'x-access-token': accessToken
            }
        })
        .then(response => {

            setIsLoading(false)

            const registrations = response.data.registrations
            
            registrations.forEach(registration => {
                registration.registrationDate = format(new Date(registration.createdAt), 'dd MMM yyyy')
            })

            setRegistrations(registrations)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(translations[lang]['user-error'], { position: 'top-right', duration: config.TOAST_ERROR_TIME })

        })

    }, [reload])

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])
      

    return (
        <>
        {
            authorized
            &&
            <div className="blue-grey lighten-5">
            <SideBar />
            <Toaster />
            <div className="row page">
                <div className="col s12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <NavBar pageName={translations[lang]["Registrations"]} />
                    <div className="page-main">
                        <ClubRegistrationsTable 
                        data={registrations} 
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

export default MainChainOwnersRegistrationsPage