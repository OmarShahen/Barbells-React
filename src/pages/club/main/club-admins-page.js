import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import ClubStaffsTable from '../../../components/tables/club/club-staffs'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/forms-floating-button'
import ClubAdminForm from '../../../components/forms/club-admin-form'


const MainClubAdminsPage = () => {

    const headers = { 'x-access-token': localStorage.getItem('access-token') }
    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const [staffs, setStaffs] = useState([])


    useEffect(() => {

        toast.promise(
            serverRequest.get(`/v1/staffs/clubs/${clubId}/roles/club-admin`, {
                headers
            })
            .then(response => {
    
                const data = response.data
                setStaffs(data.staffs)    
            })
            .catch(errorResponse => {
                console.log(errorResponse) 
                toast.error(errorResponse.message, { duration: 5000, position: 'top-right' })
            })
            ,
            {
                loading: <strong>Getting your data from the cloud</strong>,
                success: <strong>Staffs data loaded successfully</strong>,
                error: <strong>Error loading your staffs data</strong>
            },
            {
                position: 'top-right',
                duration: 5000
            }
        )

    }, [])

    



    return (
        <div className="blue-grey lighten-5">
            <Toaster />
            <FloatingFormButton modalId={"club-admin-form"}/>
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar />
                        <div className="page-main">
                            <div className="row">
                                <div className="col s12">
                                    <ClubStaffsTable data={staffs} />
                                    <ClubAdminForm />
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainClubAdminsPage