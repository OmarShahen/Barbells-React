import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import StatDatePicker from '../../../components/forms/stats-date-picker-form'
import { config } from '../../../config/config'
import { format } from 'date-fns'
import translations from '../../../i18n'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'
import ClubPayrollForm from '../../../components/forms/payroll-form'
import ClubPayrollsTable from '../../../components/tables/club/club-payrolls'
import FloatingFormButton from '../../../components/buttons/floating-button'
import { useSelector } from 'react-redux'
import PageHeader from '../../../components/sections/headers/page-header'


const MainClubPayrollsPage = ({ roles }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }
    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]
    const category = pagePath.split('/')[5]

    const lang = localStorage.getItem('lang')
    const user = useSelector(state => state.user.user)
    const accessToken = localStorageSecured.get('access-token')
    
    const [authorized, setAuthorized] = useState(false)
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const todayDate = new Date()
    const monthDate = new Date()
    monthDate.setDate(monthDate.getDate() - 30)
    todayDate.setDate(todayDate.getDate() + 1)

    const [statsQuery, setStatsQuery] = useState({ 
        from: format(monthDate, 'yyyy-MM-dd'), 
        to: format(todayDate, 'yyyy-MM-dd'),
    })

    const [payrolls, setPayrolls] = useState([])

    useEffect(() => {

        if(!isUserValid(accessToken, user, roles)) {
            setAuthorized(false)
            navigate('/clubs-admins/login')
        } else {
            setAuthorized(true)
        }
    }, [])

    useEffect(() => {

        setIsLoading(true)

        statsQuery.category = category.toUpperCase()

        serverRequest.get(`/v1/payments/clubs/${clubId}/payrolls`, {
            params: statsQuery,
            headers
        })
        .then(response => {
            setIsLoading(false)

            const data = response.data
            setPayrolls(data.payrolls) 
            
        })
        .catch(errorResponse => {
            setIsLoading(false)

            toast.error(translations[lang]['user-error'], { position: 'top-right', duration: config.TOAST_ERROR_TIME })
        })

    }, [reload, statsQuery, category])



    return (
        <>
        {
            authorized
            &&
            <div className="blue-grey lighten-5">
            <Toaster />
            <ClubPayrollForm reload={reload} setReload={setReload} />
            <StatDatePicker setStatQuery={setStatsQuery} />
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar pageName={translations[lang]['Payrolls']} statsQuery={statsQuery} />
                        <div className="page-main">
                        <PageHeader pageName="Payrolls" reload={reload} setReload={setReload} />
                            <div className="row">
                                <div className="col s12">
                                    <ClubPayrollsTable 
                                    data={payrolls} 
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
        }
        </>
    )
}

export default MainClubPayrollsPage