import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import ClubAdminSideBar from '../../../components/navigation/club-admin-side-bar'
import ClubOffersMessagesTable from '../../../components/tables/club/club-offers-messages'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import { config } from '../../../config/config'
import translations from '../../../i18n'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'
import FloatingFormButton from '../../../components/buttons/forms-floating-button'
import ClubOfferMessageForm from '../../../components/forms/offers-messages-form'
import ClubOffersMessagesMembersTable from '../../../components/tables/club/offers-messages/members'
import SendOfferMessage from '../../../components/loading/offers-messages'

const MainClubOffersMessagesPage = ({ roles }) => {

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
    const [offersMessages, setOffersMessages] = useState([])
    const [offeredMembers, setOfferedMembers] = useState([])
    const [mode, setMode] = useState('VIEW')


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

        serverRequest.get(`/offers-messages/clubs/${clubId}`, {
            headers,
        })
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setOffersMessages(data.offersMessages)    
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
            <ClubAdminSideBar />
            <Toaster />
            { mode === 'VIEW' && <FloatingFormButton modalId={'offer-message-form-modal'} /> }
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar pageName={'Offers Messages'} />
                        <div className="page-main">
                            <div className="row">
                                <div className="col s12">
                                    {
                                        mode === 'VIEW' &&
                                        <ClubOffersMessagesTable 
                                        data={offersMessages} 
                                        reload={reload}
                                        setReload={setReload}
                                        isLoading={isLoading} 
                                        isRefreshAdded={true}
                                        setMode={setMode}
                                        />
                                    }
                                    { mode === 'PICK' && 
                                    <ClubOffersMessagesMembersTable 
                                    updatedMembers={offeredMembers} 
                                    setUpdatedMembers={setOfferedMembers} 
                                    setMode={setMode}
                                    />
                                    }
                                    {
                                        mode === 'SEND' &&
                                        <SendOfferMessage members={offeredMembers} />
                                    }
                                    
                                    <ClubOfferMessageForm reload={reload} setReload={setReload} />
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

export default MainClubOffersMessagesPage