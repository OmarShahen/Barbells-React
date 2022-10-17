import React from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import ClubFreezedRegistrationsTable from '../../../components/tables/club/club-freezed-registrations'
import SideBar from '../../../components/navigation/club-admin-side-bar'

const ClubFreezedRegistrationsPage = () => {

    return (
        <div>
            <NavBar />
            <div className="container app-table">
                <ClubFreezedRegistrationsTable />
            </div>
        </div>
    )
}

export default ClubFreezedRegistrationsPage