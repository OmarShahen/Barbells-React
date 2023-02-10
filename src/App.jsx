import React, { useEffect, useState, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, redirect } from "react-router-dom"
import LoadingPage from './components/loading/loading-page'
import LoginForm from "./components/forms/club-admin-login"
import ChainOwnerLoginForm from "./components/forms/chain-owner-login"
import ForgotPasswordForm from './components/forms/forgot-password'
import ResetPasswordForm from './components/forms/reset-password-form'


import MainClubMembersPage from "./pages/club/main/club-members-page"
import MainClubOffersMessagesPage from './pages/club/main/club-offers-messages-page'
import MainClubStaffsPage from "./pages/club/main/club-staffs-page"
import MainClubPackagesPage from "./pages/club/main/club-packages-page"
import MainClubRegistrationsPage from "./pages/club/main/club-registrations-page"
import MainClubAttendancesPage from "./pages/club/main/club-attendances-page"
import MainClubCancelledAttendancesPage from "./pages/club/main/club-cancelled-attendances-page"
import MainClubCancelledRegistrationsPage from "./pages/club/main/club-cancelled-registrations-page"
import MainClubFreezedRegistrationsPage from "./pages/club/main/club-freezed-registrations-page"
import MainClubStaffPaymentsPage from './pages/club/main/club-staffs-payments-page'
import MainClubPaymentsPage from "./pages/club/main/club-payments-page"
import MainClubAdminsPage from "./pages/club/main/club-admins-page"
import MainClubPayrollsPage from "./pages/club/main/club-payrolls-page"
import MainClubInstallmentsPage from './pages/club/main/club-installments-page'
import MainClubItemsPage from './pages/club/main/club-items-page'
import MainClubSuppliersPage from './pages/club/main/club-suppliers-page'

import ChainOwnerClubsPage from "./pages/chain-owners/main/chain-owner-clubs-page"

import ClubDashboardPage from "./pages/club/stats/club-dashboard-page"
import ClubMembersPage from "./pages/club/stats/club-members-page"
import ClubMemberPage from "./pages/club/stats/club-member-page"
import ClubPackagesPage from "./pages/club/stats/club-packages-page"
import ClubPackagePage from "./pages/club/stats/club-package-page"
import ClubRegistrationsPage from "./pages/club/stats/club-registrations-page"
import ClubAttendancesPage from "./pages/club/stats/club-attendances-page"
import ClubPaymentsPage from './pages/club/stats/club-payments-page'
import ClubPaymentsCategoryPage from "./pages/club/stats/club-payments-category-page"
import ClubItemPage from './pages/club/stats/club-item-page'
import ClubInventoryPage from './pages/club/stats/club-inventory-page'

import ClubAdminSideBar from './components/navigation/club-admin-side-bar'

import { useSelector } from 'react-redux'
import { localStorageSecured } from './security/localStorage'


/*const MainChainOwnersStaffsPage = React.lazy(() => import( './pages/chain-owners/main/chain-owners-staffs-page'))
const MainChainOwnersClubsPaymentsPage = React.lazy(() => import( "./pages/chain-owners/main/chain-owners-clubs-payments-page"))
const MainChainOwnersClubAdminsPage = React.lazy(() => import( './pages/chain-owners/main/chain-owners-club-admins-page'))
const MainChainOwnersMembersPage = React.lazy(() => import( "./pages/chain-owners/main/chain-owners-members-page"))
const MainChainOwnersRegistrationsPage = React.lazy(() => import( "./pages/chain-owners/main/chain-owners-registrations-page"))
const MainChainOwnersAttendancesPage = React.lazy(() => import( "./pages/chain-owners/main/chain-owners-attendances-page"))
const MainChainOwnersPackagesPage = React.lazy(() => import( "./pages/chain-owners/main/chain-owners-packages-page"))
const MainChainOwnersCancelledRegistrationsPage = React.lazy(() => import( "./pages/chain-owners/main/chain-owners-cancelled-registrations-page"))
const MainChainOwnersCancelledAttendancesPage = React.lazy(() => import( "./pages/chain-owners/main/chain-owners-cancelled-attendances-page"))
const MainChainOwnersFreezedRegistrationsPage = React.lazy(() => import( "./pages/chain-owners/main/chain-owners-freezed-registrations-page"))

const ChainOwnersDashboardPage = React.lazy(() => import( "./pages/chain-owners/stats/chain-owner-dashboard-page"))
const ChainOwnersRegistrationsPage = React.lazy(() => import( "./pages/chain-owners/stats/chain-owners-registartions-page"))
const ChainOwnersAttendancesPage = React.lazy(() => import( "./pages/chain-owners/stats/chain-owners-attendances-page"))
const ChainOwnersPackagesPage = React.lazy(() => import( "./pages/chain-owners/stats/chain-owners-packages-page"))
const ChainOwnersMembersPage = React.lazy(() => import( "./pages/chain-owners/stats/chain-owners-members-page"))*/


const App = () => {

  const user = useSelector(state => state.user.user)

  useEffect(() => {
    const lang = localStorage.getItem('lang')
    localStorage.setItem('lang', lang ? lang : 'en')

  }, [])

  /*if(!user.isLogged) {
    return <LoginForm />
  }*/

  return <div>
    <Router>
      { user.isLogged ? <ClubAdminSideBar /> : null }
      
      <Routes>
        {/** Clubs Pages Section */}
        <Route
        path="/app/clubs/:clubId/dashboard" 
        element={
          user.isLogged ?
            <ClubDashboardPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
            :
            <LoginForm />
        }/>

        <Route 
        path="/app/clubs/:clubId/members/stats" 
        element={
            <ClubMembersPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        }/>

        <Route 
        path="/app/clubs/:clubId/offers-messages" 
        element={
          <MainClubOffersMessagesPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        } 
        />

        <Route exact path="/app/clubs/:clubId/members/:memberId/stats" 
        element={
            <ClubMemberPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        } />

      <Route exact path="/app/clubs/:clubId/packages/:packageId/stats"  
        element={
            <ClubPackagePage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']}/>
        } />

        <Route exact path="/app/clubs/:clubId/packages/stats" 
        element={
            <ClubPackagesPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']}/>
        } />

        <Route exact path="/app/clubs/:clubId/registrations/stats" 
        element={
            <ClubRegistrationsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']}/>
        } />

        <Route exact path="/app/clubs/:clubId/attendances/stats"   
        element={
            <ClubAttendancesPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
          } />

        <Route exact path="/app/clubs/:clubId/payments/stats"   
        element={
            <ClubPaymentsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
          } />

        <Route exact path="/app/clubs/:clubId/payments/:category/stats"   
        element={
            <ClubPaymentsCategoryPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
          } />

        <Route exact path="/app/clubs/:clubId/items/:itemId/stats"   
            element={
              <ClubItemPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
            } />

          <Route exact path="/app/clubs/:clubId/inventory/stats"   
            element={
              <ClubInventoryPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
            } />

        {/** Main Club Pages Section */}
        <Route exact path="/app/clubs/:clubId/members/main" 
        element={
        <MainClubMembersPage roles={['ADMIN','CLUB-ADMIN', 'OWNER']} />
        } />

        <Route path="/app/clubs/:clubId/payments/:category/main" 
        element={<MainClubPaymentsPage roles={['ADMIN','CLUB-ADMIN', 'OWNER']} />
        }/>

        <Route 
        path="/app/clubs/:clubId/offers-messages/main" 
        element={<MainClubOffersMessagesPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />} 
        />
 
        <Route exact path="/app/clubs/:clubId/staffs/main" 
        element={
          <MainClubStaffsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        } />
 
        <Route exact path="/app/clubs/:clubId/packages/main" 
        element={
        <MainClubPackagesPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        } />

        <Route exact path="/app/clubs/:clubId/registrations/main" 
        element={
        <MainClubRegistrationsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        } />

        <Route exact path="/app/clubs/:clubId/attendances/main" 
        element={
        <MainClubAttendancesPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        } />

        <Route path="/app/clubs/:clubId/cancelled-attendances/main" 
        element={
        <MainClubCancelledAttendancesPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        } />

        <Route exact path="/app/clubs/:clubId/cancelled-registrations/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainClubCancelledRegistrationsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        </Suspense> 
        } />
        <Route exact path="/app/clubs/:clubId/freezed-registrations/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainClubFreezedRegistrationsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        </Suspense> 
        } />
        <Route exact path="/app/clubs/:clubId/clubs-admins/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainClubAdminsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        </Suspense> 
        } />
 
        <Route exact path="/app/clubs/:clubId/staff-payments/main" 
        element={
        <MainClubStaffPaymentsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        } />

        <Route exact path="/app/clubs/:clubId/payrolls/main" 
        element={
        <MainClubPayrollsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        } />

        <Route exact path="/app/clubs/:clubId/installments/main" 
        element={
        <MainClubInstallmentsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        } />

        <Route exact path="/app/clubs/:clubId/items/main" 
        element={
        <MainClubItemsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        } />

      <Route exact path="/app/clubs/:clubId/suppliers/main" 
        element={
        <MainClubSuppliersPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        } />
        

        {/** Main Chain Owners Pages Section */}
        {/*<Route exact path="/app/chain-owners/:ownerId/clubs/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <ChainOwnerClubsPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />
        <Route
        exact
         path="/app/chain-owners/:ownerId/payments/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersClubsPaymentsPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />
 
        <Route exact path="/app/chain-owners/:ownerId/staffs/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersStaffsPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />
        
        <Route exact path="/app/chain-owners/:ownerId/club-admins/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersClubAdminsPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />
    
        <Route exact path="/app/chain-owners/:ownerId/members/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersMembersPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />
       
        <Route exact path="/app/chain-owners/:ownerId/registrations/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersRegistrationsPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />
 
        <Route exact path="/app/chain-owners/:ownerId/attendances/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersAttendancesPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />
   
        <Route exact path="/app/chain-owners/:ownerId/packages/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersPackagesPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />
      
        <Route exact path="/app/chain-owners/:ownerId/cancelled-registrations/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersCancelledRegistrationsPage roles={['ADMIN', 'OWNER']} />
         </Suspense> 
        } />

        <Route exact path="/app/chain-owners/:ownerId/cancelled-attendances/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersCancelledAttendancesPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />

        <Route exact path="/app/chain-owners/:ownerId/freezed-registrations/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersFreezedRegistrationsPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />

        <Route exact path="/app/chain-owners/:ownerId/dashboard" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <ChainOwnersDashboardPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />

        <Route exact path="/app/chain-owners/:ownerId/registrations/stats" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <ChainOwnersRegistrationsPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />
     
        <Route exact path="/app/chain-owners/:ownerId/attendances/stats" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <ChainOwnersAttendancesPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />

        <Route path="/app/chain-owners/:ownerId/packages/stats" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <ChainOwnersPackagesPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />

        <Route exact path="/app/chain-owners/:ownerId/members/stats" 
        element={
          <Suspense fallback={<LoadingPage />}>
            <ChainOwnersMembersPage roles={['ADMIN', 'OWNER']} />
          </Suspense> 
        } />*/}

        <Route exact path="/clubs-admins/login" element={<LoginForm /> }/>

        <Route exact path="/" element={<LoginForm />} />

        {/*<Route exact path="/chains-owners/login" 
        element={
          <Suspense fallback={<LoadingPage />}>
            <ChainOwnerLoginForm />
          </Suspense>
        }/>*/}

        <Route exact path="/forgot-password" element={<ForgotPasswordForm /> }/>

        <Route exact path="/reset-password/:token" element={<ResetPasswordForm />} />

      </Routes>
    </Router>
  </div>
}

export default App;