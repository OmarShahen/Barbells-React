import React, { useEffect, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoadingPage from './components/loading/loading-page'


const MainClubMembersPage = React.lazy(() => import( "./pages/club/main/club-members-page"))
const MainClubStaffsPage = React.lazy(() => import( "./pages/club/main/club-staffs-page"))
const MainClubPackagesPage = React.lazy(() => import( "./pages/club/main/club-packages-page"))
const MainClubRegistrationsPage = React.lazy(() => import( "./pages/club/main/club-registrations-page"))
const MainClubAttendancesPage = React.lazy(() => import( "./pages/club/main/club-attendances-page"))
const MainClubCancelledAttendancesPage = React.lazy(() => import( "./pages/club/main/club-cancelled-attendances-page"))
const MainClubCancelledRegistrationsPage = React.lazy(() => import( "./pages/club/main/club-cancelled-registrations-page"))
const MainClubFreezedRegistrationsPage = React.lazy(() => import( "./pages/club/main/club-freezed-registrations-page"))
const MainClubPaymentsPagePage = React.lazy(() => import( "./pages/club/main/club-payments-page"))
const MainClubAdminsPage = React.lazy(() => import( "./pages/club/main/club-admins-page"))
const ChainOwnerClubsPage = React.lazy(() => import( "./pages/chain-owners/main/chain-owner-clubs-page"))

const MainChainOwnersStaffsPage = React.lazy(() => import( './pages/chain-owners/main/chain-owners-staffs-page'))
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
const ChainOwnersMembersPage = React.lazy(() => import( "./pages/chain-owners/stats/chain-owners-members-page"))

const LoginForm = React.lazy(() => import( "./components/forms/club-admin-login"))
const ChainOwnerLoginForm = React.lazy(() => import( "./components/forms/chain-owner-login"))
const ForgotPasswordForm = React.lazy(() => import( './components/forms/forgot-password'))
const ResetPasswordForm = React.lazy(() => import( './components/forms/reset-password-form'))

const ClubDashboardPage = React.lazy(() => import("./pages/club/stats/club-dashboard-page"))
const ClubMembersPage = React.lazy(() => import("./pages/club/stats/club-members-page"))
const ClubMemberPage = React.lazy(() => import("./pages/club/stats/club-member-page"))
const ClubPackagesPage = React.lazy(() => import("./pages/club/stats/club-packages-page"))
const ClubPackagePage = React.lazy(() => import("./pages/club/stats/club-package-page"))
const ClubRegistrationsPage = React.lazy(() => import("./pages/club/stats/club-registrations-page"))
const ClubAttendancesPage = React.lazy(() => import("./pages/club/stats/club-attendances-page"))

const App = () => {

  useEffect(() => {
    const lang = localStorage.getItem('lang')
    localStorage.setItem('lang', lang ? lang : 'en')
  }, [])

  return <div>
    <Router>
      <Routes>

        {/** Clubs Pages Section */}
        <Route 
        path="/app/clubs/:clubId/dashboard" 
        
        element={
          <Suspense fallback={<LoadingPage />}>
            <ClubDashboardPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
          </Suspense>
        }
          />
        <Route path="/app/clubs/:clubId/members/stats" 
        element={
          <Suspense fallback={<LoadingPage />}>
            <ClubMembersPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
          </Suspense>
        } />

        <Route path="/app/clubs/:clubId/members/:memberId/stats" 
        element={
          <Suspense fallback={<LoadingPage />}>
            <ClubMemberPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
          </Suspense>
        } />

        <Route path="/app/clubs/:clubId/packages/stats" 
        element={
          <Suspense fallback={<LoadingPage />}>
            <ClubPackagesPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']}/>
          </Suspense>
        } />

        <Route path="/app/clubs/:clubId/packages/:packageId/stats"  
        element={
          <Suspense fallback={<LoadingPage />}>
            <ClubPackagePage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']}/>
          </Suspense>
        } />

        <Route path="/app/clubs/:clubId/registrations/stats" 
        element={
          <Suspense fallback={<LoadingPage />}>
            <ClubRegistrationsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']}/>
          </Suspense>
        } />

        <Route path="/app/clubs/:clubId/attendances/stats"   
        element={
          <Suspense fallback={<LoadingPage />}>
            <ClubAttendancesPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
          </Suspense>
          } />


        {/** Main Club Pages Section */}
        <Route path="/app/clubs/:clubId/members/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainClubMembersPage roles={['ADMIN','CLUB-ADMIN', 'OWNER']} />
        </Suspense> 
        } />
 
        <Route path="/app/clubs/:clubId/staffs/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainClubStaffsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        </Suspense> 
        } />
 
        <Route path="/app/clubs/:clubId/packages/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainClubPackagesPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        </Suspense> 
        } />

        <Route path="/app/clubs/:clubId/registrations/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainClubRegistrationsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        </Suspense> 
        } />
        <Route path="/app/clubs/:clubId/attendances/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainClubAttendancesPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        </Suspense> 
        } />

        <Route path="/app/clubs/:clubId/cancelled-attendances/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainClubCancelledAttendancesPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        </Suspense> 
        } />

        <Route path="/app/clubs/:clubId/cancelled-registrations/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainClubCancelledRegistrationsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        </Suspense> 
        } />
        <Route path="/app/clubs/:clubId/freezed-registrations/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainClubFreezedRegistrationsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        </Suspense> 
        } />
        <Route path="/app/clubs/:clubId/clubs-admins/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainClubAdminsPage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        </Suspense> 
        } />
 
        <Route path="/app/clubs/:clubId/payments/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainClubPaymentsPagePage roles={['ADMIN', 'CLUB-ADMIN', 'OWNER']} />
        </Suspense> 
        } />

        {/** Main Chain Owners Pages Section */}
        <Route path="/app/chain-owners/:ownerId/clubs/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <ChainOwnerClubsPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />
        <Route
         path="/app/chain-owners/:ownerId/payments/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersClubsPaymentsPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />
 
        <Route path="/app/chain-owners/:ownerId/staffs/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersStaffsPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />
        
        <Route path="/app/chain-owners/:ownerId/club-admins/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersClubAdminsPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />
    
        <Route path="/app/chain-owners/:ownerId/members/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersMembersPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />
       
        <Route path="/app/chain-owners/:ownerId/registrations/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersRegistrationsPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />
 
        <Route path="/app/chain-owners/:ownerId/attendances/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersAttendancesPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />
   
        <Route path="/app/chain-owners/:ownerId/packages/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersPackagesPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />
      
        <Route path="/app/chain-owners/:ownerId/cancelled-registrations/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersCancelledRegistrationsPage roles={['ADMIN', 'OWNER']} />
         </Suspense> 
        } />

        <Route path="/app/chain-owners/:ownerId/cancelled-attendances/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersCancelledAttendancesPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />

        <Route path="/app/chain-owners/:ownerId/freezed-registrations/main" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <MainChainOwnersFreezedRegistrationsPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />

        <Route path="/app/chain-owners/:ownerId/dashboard" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <ChainOwnersDashboardPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />

        <Route path="/app/chain-owners/:ownerId/registrations/stats" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <ChainOwnersRegistrationsPage roles={['ADMIN', 'OWNER']} />
        </Suspense> 
        } />
     
        <Route path="/app/chain-owners/:ownerId/attendances/stats" 
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

        <Route path="/app/chain-owners/:ownerId/members/stats" 
        element={
          <Suspense fallback={<LoadingPage />}>
            <ChainOwnersMembersPage roles={['ADMIN', 'OWNER']} />
          </Suspense> 
        } />

        <Route path="/clubs-admins/login" 
        element={
          <Suspense fallback={<LoadingPage />}>
        <LoginForm />
        </Suspense>
      }/>
        <Route path="/" 
        element={
          <Suspense fallback={<LoadingPage />}>
            <LoginForm />
          </Suspense>
      }/>

        <Route path="/chains-owners/login" 
        element={
          <Suspense fallback={<LoadingPage />}>
            <ChainOwnerLoginForm />
          </Suspense>
        }/>

        <Route path="/forgot-password" 
        element={
          <Suspense fallback={<LoadingPage />}>
            <ForgotPasswordForm />
          </Suspense>
      } />

        <Route path="/reset-password/:token" 
        element={
          <Suspense fallback={<LoadingPage />}>
            <ResetPasswordForm />
          </Suspense>}
        />

        <Route path="/test" element={<LoadingPage />} />
        
      </Routes>
    </Router>
  </div>
}

export default App;