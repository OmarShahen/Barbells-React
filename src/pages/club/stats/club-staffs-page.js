import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import SideBar from '../../../components/navigation/club-admin-side-bar'
import ClubStaffsTable from '../../../components/tables/club/club-staffs'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormsButton from '../../../components/buttons/forms-floating-button'



const ClubStaffsPage = () => {

    const headers = { 'x-access-token': localStorage.getItem('access-token') }
    const pagePath = window.location.pathname
    const clubName = pagePath.split('/')[2]
    const clubId = pagePath.split('/')[3]

    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [statQuery, setStatQuery] = useState({})


    const [staffs, setStaffs] = useState([])



    useEffect(() => {

        setIsLoading(true)

        serverRequest.get(`staffs/clubs/${clubId}`, {
            headers
        })
        .then(response => {

            setIsLoading(false)

            const data = response.data

            console.log(data)


            setStaffs(data.staffs)

            toast.success('staff data loaded successfully', { duration: 5000, position: 'top-right' })
        })
        .catch(errorResponse => {

            setIsLoading(false)

            console.log(errorResponse)  

            toast.error(errorResponse.message, { duration: 5000, position: 'top-right' })
        })

    }, [reload])



    return (
        <div className="blue-grey lighten-5">
            <SideBar />
            <Toaster />
            <FloatingFormsButton modalId={'staff-form-modal'}/>
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar />
                        <div className="page-main">
                            <div className="row">
                                <div className="col s12">
                                    <ClubStaffsTable 
                                    data={staffs} 
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
    )
}

export default ClubStaffsPage