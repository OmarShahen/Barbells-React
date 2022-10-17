import React from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import ClubCancelledRegistrationsTable from '../../../components/tables/club/club-cancelled-registrations'
import SideBar from '../../../components/navigation/club-admin-side-bar'

const ClubCancelledRegistrationsPage = () => {

    return (
        <div>
            <NavBar />
            <div className="container app-table">
                <ClubCancelledRegistrationsTable />
            </div>
        </div>
    )
}

export default ClubCancelledRegistrationsPage