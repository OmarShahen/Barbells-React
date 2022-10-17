import React, { useEffect } from 'react'
import ClubsPage from "./pages/clubs-page"
import ClubDashboardPage from "./pages/club/stats/club-dashboard-page"
import ClubMembersPage from "./pages/club/stats/club-members-page"
import ClubMemberPage from "./pages/club/stats/club-member-page"
import ClubStaffsPage from "./pages/club/stats/club-staffs-page"
import ClubStaffPage from "./pages/club/stats/club-staff-page"
import ClubPackagesPage from "./pages/club/stats/club-packages-page"
import ClubPackagePage from "./pages/club/stats/club-package-page"
import ClubRegistrationsPage from "./pages/club/stats/club-registrations-page"
import ClubAttendancesPage from "./pages/club/stats/club-attendances-page"
import ClubCancelledAttendancesPage from './pages/club/stats/club-cancelled-attendances'
import ClubCancelledRegistrationsPage from './pages/club/stats/club-cancelled-registrations'
import ClubFreezedRegistrationsPage from "./pages/club/stats/club-freezed-registrations"

import ChainOwnersPage from "./pages/chain-owners/chain-owners-page"

import MainClubMembersPage from "./pages/club/main/club-members-page"
import MainClubStaffsPage from "./pages/club/main/club-staffs-page"
import MainClubPackagesPage from "./pages/club/main/club-packages-page"
import MainClubRegistrationsPage from "./pages/club/main/club-registrations-page"
import MainClubAttendancesPage from "./pages/club/main/club-attendances-page"
import MainClubCancelledAttendancesPage from "./pages/club/main/club-cancelled-attendances-page"
import MainClubCancelledRegistrationsPage from "./pages/club/main/club-cancelled-registrations-page"
import MainClubFreezedRegistrationsPage from "./pages/club/main/club-freezed-registrations-page"
import MainClubPaymentsPagePage from "./pages/club/main/club-payments-page"
import MainClubAdminsPage from "./pages/club/main/club-admins-page"
import ChainOwnerClubsPage from "./pages/chain-owners/main/chain-owner-clubs-page"
import Modal from './components/modals/modal'

import MainChainOwnersStaffsPage from './pages/chain-owners/main/chain-owners-staffs-page'
import MainChainOwnersClubsPaymentsPage from "./pages/chain-owners/main/chain-owners-clubs-payments-page"
import MainChainOwnersClubAdminsPage from './pages/chain-owners/main/chain-owners-club-admins-page'
import MainChainOwnersMembersPage from "./pages/chain-owners/main/chain-owners-members-page"
import MainChainOwnersRegistrationsPage from "./pages/chain-owners/main/chain-owners-registrations-page"
import MainChainOwnersAttendancesPage from "./pages/chain-owners/main/chain-owners-attendances-page"
import MainChainOwnersPackagesPage from "./pages/chain-owners/main/chain-owners-packages-page"
import MainChainOwnersCancelledRegistrationsPage from "./pages/chain-owners/main/chain-owners-cancelled-registrations-page"
import MainChainOwnersCancelledAttendancesPage from "./pages/chain-owners/main/chain-owners-cancelled-attendances-page"
import MainChainOwnersFreezedRegistrationsPage from "./pages/chain-owners/main/chain-owners-freezed-registrations-page"

import ChainOwnersDashboardPage from "./pages/chain-owners/stats/chain-owner-dashboard-page"
import ChainOwnersRegistrationsPage from "./pages/chain-owners/stats/chain-owners-registartions-page"
import ChainOwnersAttendancesPage from "./pages/chain-owners/stats/chain-owners-attendances-page"
import ChainOwnersPackagesPage from "./pages/chain-owners/stats/chain-owners-packages-page"
import ChainOwnersMembersPage from "./pages/chain-owners/stats/chain-owners-members-page"

import LoginForm from "./components/forms/club-admin-login"
import ChainOwnerLoginForm from "./components/forms/chain-owner-login"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

const App = () => {

  useEffect(() => {
    const lang = localStorage.getItem('lang')
    localStorage.setItem('lang', lang ? lang : 'en')
  }, [])

  return <div>
    <Router>
      <Routes>

      <Route path="/chain-owners" element={<ChainOwnersPage />} />

        {/** Clubs Pages Section */}
        <Route path="/app/clubs" element={<ClubsPage />} />
        <Route path="/app/clubs/:clubId/dashboard" element={<ClubDashboardPage />} />
        <Route path="/app/clubs/:clubId/members/stats" element={<ClubMembersPage />} />
        <Route path="/app/clubs/:clubId/members/:memberId/stats" element={<ClubMemberPage />} />
        <Route path="/app/clubs/:clubId/staffs/stats" element={<ClubStaffsPage />} />
        <Route path="/app/clubs/:clubId/staffs/:staffName/:staffId/stats" element={<ClubStaffPage />} />
        <Route path="/app/clubs/:clubId/packages/stats" element={<ClubPackagesPage />} />
        <Route path="/app/clubs/:clubId/packages/:packageId/stats" element={<ClubPackagePage />} />
        <Route path="/app/clubs/:clubId/registrations/stats" element={<ClubRegistrationsPage />} />
        <Route path="/app/clubs/:clubId/attendances/stats" element={<ClubAttendancesPage />} />



        {/** Main Club Pages Section */}
        <Route path="/app/clubs/:clubId/members/main" element={<MainClubMembersPage />} />
        <Route path="/app/clubs/:clubId/staffs/main" element={<MainClubStaffsPage />} />
        <Route path="/app/clubs/:clubId/packages/main" element={<MainClubPackagesPage />} />
        <Route path="/app/clubs/:clubId/registrations/main" element={<MainClubRegistrationsPage />} />
        <Route path="/app/clubs/:clubId/attendances/main" element={<MainClubAttendancesPage />} />
        <Route path="/app/clubs/:clubId/cancelled-attendances/main" element={<MainClubCancelledAttendancesPage />} />
        <Route path="/app/clubs/:clubId/cancelled-registrations/main" element={<MainClubCancelledRegistrationsPage />} />
        <Route path="/app/clubs/:clubId/freezed-registrations/main" element={<MainClubFreezedRegistrationsPage />} />
        <Route path="/app/clubs/:clubId/clubs-admins/main" element={<MainClubAdminsPage />} />
        <Route path="/app/clubs/:clubId/payments/main" element={<MainClubPaymentsPagePage />} />

        {/** Main Chain Owners Pages Section */}
        <Route path="/app/chain-owners/:ownerId/clubs/main" element={<ChainOwnerClubsPage />} />
        <Route path="/app/chain-owners/:ownerId/payments/main" element={<MainChainOwnersClubsPaymentsPage />} />
        <Route path="/app/chain-owners/:ownerId/staffs/main" element={<MainChainOwnersStaffsPage />} />
        <Route path="/app/chain-owners/:ownerId/club-admins/main" element={<MainChainOwnersClubAdminsPage />} />
        <Route path="/app/chain-owners/:ownerId/members/main" element={<MainChainOwnersMembersPage />} />
        <Route path="/app/chain-owners/:ownerId/registrations/main" element={<MainChainOwnersRegistrationsPage />} />
        <Route path="/app/chain-owners/:ownerId/attendances/main" element={<MainChainOwnersAttendancesPage />} />
        <Route path="/app/chain-owners/:ownerId/packages/main" element={<MainChainOwnersPackagesPage />} />
        <Route path="/app/chain-owners/:ownerId/cancelled-registrations/main" element={<MainChainOwnersCancelledRegistrationsPage />} />
        <Route path="/app/chain-owners/:ownerId/cancelled-attendances/main" element={<MainChainOwnersCancelledAttendancesPage />} />
        <Route path="/app/chain-owners/:ownerId/freezed-registrations/main" element={<MainChainOwnersFreezedRegistrationsPage />} />

        <Route path="/app/chain-owners/:ownerId/dashboard" element={<ChainOwnersDashboardPage />} />
        <Route path="/app/chain-owners/:ownerId/registrations/stats" element={<ChainOwnersRegistrationsPage />} />
        <Route path="/app/chain-owners/:ownerId/attendances/stats" element={<ChainOwnersAttendancesPage />} />
        <Route path="/app/chain-owners/:ownerId/packages/stats" element={<ChainOwnersPackagesPage />} />
        <Route path="/app/chain-owners/:ownerId/members/stats" element={<ChainOwnersMembersPage />} />

        <Route path="/clubs-admins/login" element={<LoginForm />}/>
        <Route path="/chains-owners/login" element={<ChainOwnerLoginForm />}/>
        
      </Routes>
    </Router>
  </div>
}

export default App;