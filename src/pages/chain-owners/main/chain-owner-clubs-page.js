import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/chain-owner-nav-bar'
import SideBar from '../../../components/navigation/chain-owner-side-bar'
import ClubsTable from '../../../components/tables/chain-owner/chain-owners-clubs-table'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/forms-floating-button'
import { serverRequest } from '../../../API/request'
import { format } from 'date-fns'
import ClubForm from '../../../components/forms/club-form'
import translations from '../../../i18n'
import { config } from '../../../config/config'


const ChainOwnerClubsPage = () => {

    const headers = { 'x-access-token': localStorage.getItem('access-token') }

    const pagePath = window.location.pathname
    const ownerId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')

    const [clubs, setClubs] = useState([])
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])
      
    useEffect(() => {

        setIsLoading(true)

        serverRequest.get(`/clubs/chain-owners/${ownerId}`, { headers })
        .then(response => {

            setIsLoading(false)

            const clubs = response.data.clubs
        
            clubs.forEach(club => {
                club.createdAt = format(new Date(club.createdAt), 'd MMM yyyy')
            })

            setClubs(clubs)
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
            <FloatingFormButton modalId={'club-form-modal'}/>
            <div className="row page">
                <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <NavBar pageName={translations[lang]['Clubs']}/>
                    <div className="page-main">
                        <ClubsTable 
                        data={clubs} 
                        reload={reload}
                        setReload={setReload}
                        isLoading={isLoading} 
                        isRefreshAdded={true}
                        />
                        <ClubForm />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChainOwnerClubsPage