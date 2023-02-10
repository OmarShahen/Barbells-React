import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import ClubInstallmentsTable from '../../../components/tables/club/installments-registrations'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import { config } from '../../../config/config'
import translations from '../../../i18n'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'
import StatDatePicker from '../../../components/forms/stats-date-picker-form'
import { format } from 'date-fns'
import FloatingFormButton from '../../../components/buttons/floating-button'
import Card from '../../../components/cards/card'
import { iconPicker } from '../../../utils/icon-finder'
import CachedIcon from '@mui/icons-material/Cached'
import CreditCardOffOutlinedIcon from '@mui/icons-material/CreditCardOffOutlined'
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined'
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined'
import MoneyOffCsredOutlinedIcon from '@mui/icons-material/MoneyOffCsredOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import { useSelector } from 'react-redux'
import PageHeader from '../../../components/sections/headers/page-header'



const MainClubInstallmentsPage = ({ roles }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }
    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]
    const lang = localStorage.getItem('lang')
    const user = useSelector(state => state.user.user)
    const accessToken = localStorageSecured.get('access-token')

    const [authorized, setAuthorized] = useState(false)
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [registrations, setRegistrations] = useState([])
    const [totalRegistrations, setTotalRegistrations] = useState(0)
    const [totalRegistrationsOriginalPrice, setTotalRegistrationsOriginalPrice] = useState(0)
    const [totalPaidRegistrations, setTotalPaidRegistrations] = useState(0)
    const [totalUnpaidRegistrations, setTotalUnpaidRegistrations] = useState(0)
    const [totalPaidRegistrationsMoney, setTotalPaidRegistrationsMoney] = useState(0)
    const [totalUnpaidRegistrationsMoney, setTotalUnpaidRegistrationsMoney] = useState(0)

    const todayDate = new Date()
    const monthDate = new Date()
    monthDate.setDate(monthDate.getDate() - 30)
    todayDate.setDate(todayDate.getDate() + 1)

    const [statsQuery, setStatsQuery] = useState({ 
        from: format(monthDate, 'yyyy-MM-dd'), 
        to: format(todayDate, 'yyyy-MM-dd') 
    })

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

        toast.promise(
            serverRequest.get(`/v1/registrations/clubs/${clubId}/installments`, {
                headers,
                params: statsQuery
            })
            .then(response => {
    
                setIsLoading(false)
    
                const data = response.data
                setRegistrations(data.registrations)    
                setTotalRegistrations(data.totalRegistrations)
                setTotalPaidRegistrations(data.totalPaidRegistrations)
                setTotalUnpaidRegistrations(data.totalUnpaidRegistrations)
                setTotalPaidRegistrationsMoney(data.totalPaidRegistrationsMoney)
                setTotalUnpaidRegistrationsMoney(data.totalUnpaidRegistrationsMoney)
                setTotalRegistrationsOriginalPrice(data.totalRegistrationsOriginalPrice)
            })
            .catch(errorResponse => {
                setIsLoading(false)
                throw errorResponse
            }),
            {
                loading: <strong>{translations[lang]['installments-loading']}</strong>,
                success: <strong>{translations[lang]['installments-success']}</strong>,
                error: <strong>{translations[lang]['installments-error']}</strong>
            },
            {
                position: 'top-right',
                duration: config.TOAST_SUCCESS_TIME
            }
        )

    }, [reload, statsQuery])



    return (
        <>
        {
            authorized
            &&
            <div className="blue-grey lighten-5">
            <Toaster />
            <StatDatePicker setStatQuery={setStatsQuery} />
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar pageName={translations[lang]['Installments']} statsQuery={statsQuery} />
                        <div className="page-main">
                        <PageHeader pageName="Installments" reload={reload} setReload={setReload} />
                        
                            <div className="row">
                                <div className="col s12 m4">
                                    <Card title={translations[lang]['Expected Total']} isMoney={true} currency={lang} icon={<PaidOutlinedIcon />} number={totalRegistrationsOriginalPrice} color={config.color.cyan} />
                                </div>
                                <div className="col s12 m4">
                                    <Card title={translations[lang]['Total Paid']} isMoney={true} currency={lang} icon={<AttachMoneyOutlinedIcon />} number={totalPaidRegistrationsMoney} color={config.color.cyan} />
                                </div>
                                <div className="col s12 m4">
                                    <Card title={translations[lang]['Total Unpaid']} isMoney={true} currency={lang} icon={<MoneyOffCsredOutlinedIcon />} number={totalUnpaidRegistrationsMoney} color={config.color.purple} />
                                </div>
                                <div className="col s12 m4">
                                    <Card title={translations[lang]['Total Registrations']} icon={iconPicker('registrations')} number={totalRegistrations} color={config.color.blue} />
                                </div> 
                                <div className="col s12 m4">
                                    <Card title={translations[lang]['Paid Registrations']} icon={<CreditScoreOutlinedIcon />} number={totalPaidRegistrations} color={config.color.cyan} />
                                </div>
                                <div className="col s12 m4">
                                    <Card title={translations[lang]['Unpaid Registrations']} icon={<CreditCardOffOutlinedIcon />} number={totalUnpaidRegistrations} color={config.color.purple} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col s12">
                                    <ClubInstallmentsTable 
                                    statsQuery={statsQuery}
                                    isAttendance={true}
                                    data={registrations} 
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

export default MainClubInstallmentsPage