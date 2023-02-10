import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import ClubOffersMessagesTable from '../../../components/tables/club/club-offers-messages'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import { config } from '../../../config/config'
import translations from '../../../i18n'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'
import FloatingFormButton from '../../../components/buttons/forms-floating-button'
import ClubOfferTemplateForm from '../../../components/forms/offer-message-template-form'
import ClubOffersMessagesMembersTable from '../../../components/tables/club/offers-messages/members'
import SendOfferMessage from '../../../components/loading/offers-messages'
import { SettingsInputCompositeRounded } from '@material-ui/icons'
import { useSelector } from 'react-redux'
import PageHeader from '../../../components/sections/headers/page-header'


const MainClubOffersMessagesPage = ({ roles }) => {

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

        if(mode === 'VIEW') {

            serverRequest.get(`/v1/offers-messages/clubs/${clubId}`, {
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
        }         

    }, [reload, mode])



    return (
        <>
        {
            authorized
            &&
            <div className="page-main-body blue-grey lighten-5">
            <Toaster />
            { mode === 'VIEW' && <FloatingFormButton modalId={'template-message-form-modal'} /> }
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar pageName={translations[lang]['Offers Messages']} />
                        <div className="page-main">
                        <PageHeader pageName="Offers Messages" reload={reload} setReload={setReload} />
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
                                        <SendOfferMessage 
                                        members={offeredMembers}
                                        setMembers={setOfferedMembers}
                                        setMode={setMode}
                                        />
                                    }
                                    
                                    <ClubOfferTemplateForm reload={reload} setReload={setReload} />
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