import React, { useState, useEffect } from 'react'
import NavBar from '../components/navigation/nav-bar'
import SideBar from '../components/navigation/chain-owner-side-bar'
import ClubsTable from '../components/tables/chain-owner/chain-owners-clubs-table'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../components/buttons/forms-floating-button'
import { serverRequest } from '../API/request'
import { format } from 'date-fns'
import ClubForm from '../components/forms/club-form'
import Modal from '../components/modals/modal'


const ClubsPage = () => {

    const [clubs, setClubs] = useState([])

    useEffect(() => {

        toast.promise(
            serverRequest.get(`/clubs`)
            .then(response => {
                const clubs = response.data.clubs
            
                clubs.forEach(club => {
                    club.createdAt = format(new Date(club.createdAt), 'd MMM yyyy')
                })

                setClubs(clubs)
            })
            .catch(error => {
            console.error(error)
            })
            ,
            {
                loading: <strong>Getting your data from the cloud</strong>,
                success: <strong>Clubs data loaded successfully</strong>,
                error: <strong>Error loading your clubs data</strong>
            },
            {
                position: 'top-right',
                duration: 5000
            }
        )

    }, [])

    return (
        <div className="blue-grey lighten-5">
            <SideBar />
            <Toaster />
            <FloatingFormButton modalId={'club-form-modal'}/>
            <div className="row page">
                <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <NavBar pageName={'Clubs'}/>
                    <div className="page-main">
                        <ClubsTable data={clubs} />
                        <ClubForm />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClubsPage