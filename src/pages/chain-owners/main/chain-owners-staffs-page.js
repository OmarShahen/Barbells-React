import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/chain-owner-nav-bar'
import SideBar from '../../../components/navigation/chain-owner-side-bar'
import ClubStaffsTable from '../../../components/tables/club/club-staffs'
import { serverRequest } from '../../../API/request'
import { format } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'
import StaffForm from '../../../components/forms/staff-form'
import FloatingFormButton from '../../../components/buttons/forms-floating-button'
import translations from '../../../i18n'
import { config } from '../../../config/config'


const MainChainOwnersStaffsPage = () => {

    const pagePath = window.location.pathname
    const ownerId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')

    const [staffs, setStaffs] = useState([])
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        setIsLoading(true)

        serverRequest.get(`/staffs/chain-owners/${ownerId}/role/staff`, {
            headers: {
                'x-access-token': localStorage.getItem('access-token')
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
            toast.error(translations[lang]['user-error'], { position: 'top-right', duration: config.TOAST_ERROR_TIME })

        })
            

    }, [reload])

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])
      

    return (
        <div className="blue-grey lighten-5">
            <SideBar />
            <Toaster />
            <FloatingFormButton modalId={"staff-form-modal"}/>
            <div className="row page">
                <div className="col s12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <NavBar pageName={translations[lang]["Staffs"]} />
                    <div className="page-main">
                        <ClubStaffsTable 
                        data={staffs} 
                        isClub={true} 
                        reload={reload}
                        setReload={setReload}
                        isLoading={isLoading} 
                        isRefreshAdded={true}
                        />
                        <StaffForm 
                        isChooseClub={true} 
                        setReload={setReload} 
                        reload={reload} 
                        addedStaffRole={'staff'}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainChainOwnersStaffsPage