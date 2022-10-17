import React from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import ClubCancelledAttendancesTable from '../../../components/tables/club/club-cancelled-attendances'
import SideBar from '../../../components/navigation/club-admin-side-bar'

const ClubCancelledAttendancesPage = () => {

    return (
        <div>
            <NavBar />
            <div className="container app-table">
                <ClubCancelledAttendancesTable />
            </div>
        </div>
    )
}

export default ClubCancelledAttendancesPage