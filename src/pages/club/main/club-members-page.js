import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import ClubAdminSideBar from '../../../components/navigation/club-admin-side-bar'
import ClubMembersTable from '../../../components/tables/club/club-members'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import { config } from '../../../config/config'
import translations from '../../../i18n'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'

const MainClubMembersPage = ({ roles }) => {

    const navigate = useNavigate()
    const headers = { 'x-access-token': JSON.parse(localStorage.getItem('access-token')) }
    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    const user = JSON.parse(localStorage.getItem('user'))
    const accessToken = localStorage.getItem('access-token')

    const [authorized, setAuthorized] = useState(false)
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [members, setMembers] = useState([])

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

        serverRequest.get(`/members/clubs/${clubId}`, {
            headers
        })
        .then(response => {
            
            setIsLoading(false)

            const data = response.data
            setMembers(data.members)    
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
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar pageName={translations[lang]["Members"]} pageRoles={roles}/>
                        <div className="page-main">
                            <div className="row">
                                <div className="col s12">
                                    <ClubMembersTable 
                                    data={members} 
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

export default MainClubMembersPage