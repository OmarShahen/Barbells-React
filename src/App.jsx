import React, { useEffect } from 'react'
import ClubDashboardPage from "./pages/club/stats/club-dashboard-page"
import ClubMembersPage from "./pages/club/stats/club-members-page"
import ClubMemberPage from "./pages/club/stats/club-member-page"
import ClubStaffsPage from "./pages/club/stats/club-staffs-page"
import ClubStaffPage from "./pages/club/stats/club-staff-page"
import ClubPackagesPage from "./pages/club/stats/club-packages-page"
import ClubPackagePage from "./pages/club/stats/club-package-page"
import ClubRegistrationsPage from "./pages/club/stats/club-registrations-page"
import ClubAttendancesPage from "./pages/club/stats/club-attendances-page"

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
import MainClubRegistrationAttendancesPage from './pages/club/main/club-registration-attendances'

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
import ForgotPasswordForm from './components/forms/forgot-password'
import ResetPasswordForm from './components/forms/reset-password-form'

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
        <Route path="/app/clubs/:clubId/dashboard" element={<ClubDashboardPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />} />
        <Route path="/app/clubs/:clubId/members/stats" element={<ClubMembersPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />} />
        <Route path="/app/clubs/:clubId/members/:memberId/stats" element={<ClubMemberPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />} />
        <Route path="/app/clubs/:clubId/staffs/stats" element={<ClubStaffsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']}/>} />
        <Route path="/app/clubs/:clubId/staffs/:staffName/:staffId/stats" element={<ClubStaffPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']}/>} />
        <Route path="/app/clubs/:clubId/packages/stats" element={<ClubPackagesPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']}/>} />
        <Route path="/app/clubs/:clubId/packages/:packageId/stats" element={<ClubPackagePage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']}/>} />
        <Route path="/app/clubs/:clubId/registrations/stats" element={<ClubRegistrationsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']}/>} />
        <Route path="/app/clubs/:clubId/attendances/stats" element={<ClubAttendancesPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />} />


        {/** Main Club Pages Section */}
        <Route path="/app/clubs/:clubId/members/main" element={<MainClubMembersPage roles={['ADMIN','CLUB-ADMIN', 'OWNER']} />} />
        <Route path="/app/clubs/:clubId/staffs/main" element={<MainClubStaffsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />} />
        <Route path="/app/clubs/:clubId/packages/main" element={<MainClubPackagesPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />} />
        <Route path="/app/clubs/:clubId/registrations/main" element={<MainClubRegistrationsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />} />
        <Route path="/app/clubs/:clubId/attendances/main" element={<MainClubAttendancesPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />} />
        <Route path="/app/clubs/:clubId/cancelled-attendances/main" element={<MainClubCancelledAttendancesPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />} />
        <Route path="/app/clubs/:clubId/cancelled-registrations/main" element={<MainClubCancelledRegistrationsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />} />
        <Route path="/app/clubs/:clubId/freezed-registrations/main" element={<MainClubFreezedRegistrationsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />} />
        <Route path="/app/clubs/:clubId/clubs-admins/main" element={<MainClubAdminsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />} />
        <Route path="/app/clubs/:clubId/payments/main" element={<MainClubPaymentsPagePage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />} />
        <Route path="/app/clubs/:clubId/registrations/:registrationId/attendances/main" element={<MainClubRegistrationAttendancesPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />} />

        {/** Main Chain Owners Pages Section */}
        <Route path="/app/chain-owners/:ownerId/clubs/main" element={<ChainOwnerClubsPage roles={['ADMIN', 'OWNER']} />} />
        <Route path="/app/chain-owners/:ownerId/payments/main" element={<MainChainOwnersClubsPaymentsPage roles={['ADMIN', 'OWNER']} />} />
        <Route path="/app/chain-owners/:ownerId/staffs/main" element={<MainChainOwnersStaffsPage roles={['ADMIN', 'OWNER']} />} />
        <Route path="/app/chain-owners/:ownerId/club-admins/main" element={<MainChainOwnersClubAdminsPage roles={['ADMIN', 'OWNER']} />} />
        <Route path="/app/chain-owners/:ownerId/members/main" element={<MainChainOwnersMembersPage roles={['ADMIN', 'OWNER']} />} />
        <Route path="/app/chain-owners/:ownerId/registrations/main" element={<MainChainOwnersRegistrationsPage roles={['ADMIN', 'OWNER']} />} />
        <Route path="/app/chain-owners/:ownerId/attendances/main" element={<MainChainOwnersAttendancesPage roles={['ADMIN', 'OWNER']} />} />
        <Route path="/app/chain-owners/:ownerId/packages/main" element={<MainChainOwnersPackagesPage roles={['ADMIN', 'OWNER']} />} />
        <Route path="/app/chain-owners/:ownerId/cancelled-registrations/main" element={<MainChainOwnersCancelledRegistrationsPage roles={['ADMIN', 'OWNER']} />} />
        <Route path="/app/chain-owners/:ownerId/cancelled-attendances/main" element={<MainChainOwnersCancelledAttendancesPage roles={['ADMIN', 'OWNER']} />} />
        <Route path="/app/chain-owners/:ownerId/freezed-registrations/main" element={<MainChainOwnersFreezedRegistrationsPage roles={['ADMIN', 'OWNER']} />} />

        <Route path="/app/chain-owners/:ownerId/dashboard" element={<ChainOwnersDashboardPage roles={['ADMIN', 'OWNER']} />} />
        <Route path="/app/chain-owners/:ownerId/registrations/stats" element={<ChainOwnersRegistrationsPage roles={['ADMIN', 'OWNER']} />} />
        <Route path="/app/chain-owners/:ownerId/attendances/stats" element={<ChainOwnersAttendancesPage roles={['ADMIN', 'OWNER']} />} />
        <Route path="/app/chain-owners/:ownerId/packages/stats" element={<ChainOwnersPackagesPage roles={['ADMIN', 'OWNER']} />} />
        <Route path="/app/chain-owners/:ownerId/members/stats" element={<ChainOwnersMembersPage roles={['ADMIN', 'OWNER']} />} />

        <Route path="/clubs-admins/login" element={<LoginForm />}/>
        <Route path="/chains-owners/login" element={<ChainOwnerLoginForm />}/>
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
        
      </Routes>
    </Router>
  </div>
}

export default App;