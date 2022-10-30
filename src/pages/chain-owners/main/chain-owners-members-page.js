import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/chain-owner-nav-bar'
import SideBar from '../../../components/navigation/chain-owner-side-bar'
import ClubMembersTable from '../../../components/tables/club/club-members'
import { serverRequest } from '../../../API/request'
import { format } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'
import translations from '../../../i18n'
import { config } from '../../../config/config'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'
import StatDatePicker from '../../../components/forms/stats-date-picker-form'
import FloatingFormButton from '../../../components/buttons/floating-button'

const MainChainOwnersMembersPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const ownerId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    const user = localStorageSecured.get('user')
    const accessToken = localStorageSecured.get('access-token')

    const [authorized, setAuthorized] = useState(false)
    const [members, setMembers] = useState([])
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const todayDate = new Date()
    const [statsQuery, setStatsQuery] = useState({ until: format(todayDate, 'yyyy-MM-dd') })

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

        serverRequest.get(`/members/chain-owners/${ownerId}`, {
            headers: {
                'x-access-token': accessToken
            },
            params: statsQuery
        })
        .then(response => {

            setIsLoading(false)

            const members = response.data.members
            members.forEach(member => {
                member.registrationDate = format(new Date(member.createdAt), 'dd MMM yyyy')
            })
            setMembers(members)
        })
        .catch(error => {
            setIsLoading(false)
            toast.error(translations[lang]['user-error'], { position: 'top-right', duration: config.TOAST_ERROR_TIME })

        })


    }, [reload, statsQuery])

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
            <StatDatePicker setStatQuery={setStatsQuery} />
            <FloatingFormButton />
            <div className="page">
                <div className="col s12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <NavBar pageName={translations[lang]["Members"]} statsQuery={statsQuery} />
                    <div className="page-main">
                        <ClubMembersTable 
                        data={members} 
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

export default MainChainOwnersMembersPage