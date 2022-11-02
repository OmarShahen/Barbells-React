import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/chain-owner-nav-bar'
import SideBar from '../../../components/navigation/chain-owner-side-bar'
import ChainOwnersStaffsTable from '../../../components/tables/club/club-staffs'
import { serverRequest } from '../../../API/request'
import { format } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'
import StaffForm from '../../../components/forms/staff-form'
import FloatingFormButton from '../../../components/buttons/forms-floating-button'
import translations from '../../../i18n'
import { config } from '../../../config/config'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'



const MainChainOwnersClubAdminsPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const ownerId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    const user = localStorageSecured.get('user')
    const accessToken = localStorageSecured.get('access-token')

    const [authorized, setAuthorized] = useState(false)
    const [staffs, setStaffs] = useState([])
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

        serverRequest.get(`/staffs/chain-owners/${ownerId}/role/club-admin`, {
            headers: {
                'x-access-token': accessToken
            }
        })
        .then(response => {

            setIsLoading(false)

            const staffs = response.data.staffs
            
            staffs.forEach(staff => {
                staff.registrationDate = format(new Date(staff.createdAt), 'dd MMM yyyy')
            })

            setStaffs(staffs)
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
            <FloatingFormButton modalId={"staff-form-modal"}/>
            <div className="page">
                <div className="col s12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <NavBar pageName={translations[lang]["Clubs Admins"]} />
                    <div className="page-main">
                        <ChainOwnersStaffsTable 
                        title={'Clubs Admins'}
                        data={staffs}
                        isClub={true}
                        staffRole={'CLUB-ADMIN'}
                        reload={reload}
                        setReload={setReload}
                        isLoading={isLoading} 
                        isRefreshAdded={true} 
                        />
                        <StaffForm 
                        isChooseClub={true} 
                        setReload={setReload} 
                        reload={reload}
                        addedStaffRole={'club-admin'}
                        />
                    </div>
                </div>
            </div>
        </div>
        }
        </>
    )
}

export default MainChainOwnersClubAdminsPage