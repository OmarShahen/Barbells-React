import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import Card from '../../../components/cards/card'
import BarChart from '../../../components/charts/bar-chart'
import LineChart from '../../../components/charts/line-chart'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/floating-button'
import StatDatePicker from '../../../components/forms/stats-date-picker-form'
import ChartModal from '../../../components/modals/chart-modal'
import { config } from '../../../config/config'
import { format } from 'date-fns'
import translations from '../../../i18n/index'
import { iconPicker } from '../../../utils/icon-finder'
import { to12 } from '../../../utils/hours'
import PercentagesCard from '../../../components/cards/percentages-card'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import ClubPaymentsTable from '../../../components/tables/club/club-payments'
import PageHeader from '../../../components/sections/headers/page-header'
import { useSelector } from 'react-redux'

const ClubDashboardPage = ({ roles }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }
    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')

    const todayDate = new Date()

    const user = useSelector(state => state.user.user)
    const accessToken = localStorageSecured.get('access-token')

    const [authorized, setAuthorized] = useState(false)
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [statsQuery, setStatsQuery] = useState({ specific: format(todayDate, 'yyyy-MM-dd') })

    const [totalRegistrations, setTotalRegistrations] = useState(0)
    const [totalEarnings, setTotalEarnings] = useState(0)
    const [totalDeductions, setTotalDeductions] = useState(0)
    const [netProfit, setNetProfit] = useState(0)
    const [totalAttendances, setTotalAttendances] = useState(0)
    const [totalMembers, setTotalMembers] = useState(0)
    const [payments, setPayments] = useState([])

    const [growthLabels, setGrowthLabels] = useState([])
    const [growthData, setGrowthData] = useState([])

    const [hoursLabels, setHoursLabels] = useState([])
    const [hoursData, setHoursData] = useState([])

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
            serverRequest.get(`/v2/clubs/${clubId}/stats`, {
                params: statsQuery,
                headers
            })
            .then(response => {
                setIsLoading(false)
    
                const data = response.data
    
                setTotalRegistrations(data.totalRegistrations)
                setTotalEarnings(data.totalEarnings)
                setTotalDeductions(data.totalDeductions)
                setNetProfit(data.netProfit)
                setTotalAttendances(data.totalAttendances)
                setTotalMembers(data.totalMembers)
                setPayments(data.payments)
    
                const growthStats = data.registrationsGrowthStats
                
                let growthLabels = growthStats.map(stat => stat._id)
                let growthData = growthStats.map(stat => stat.count)
    
                const hoursStat = data.attendancesStatsHour
    
                let hoursLabels = hoursStat.map(stat => stat._id)
                let hoursData = hoursStat.map(stat => stat.count)
    
                setGrowthLabels(growthLabels)
                setGrowthData(growthData)

                setHoursLabels(to12(hoursLabels))
                setHoursData(hoursData)
    
            })
            .catch(errorResponse => {
                setIsLoading(false)
                
                throw errorResponse
            }),
            {
                loading: <strong>{translations[lang]['dashboard-loading']}</strong>,
                success: <strong>{translations[lang]['dashboard-success']}</strong>,
                error: <strong>{translations[lang]['dashboard-error']}</strong>
            },
            {
                position: 'top-right',
                duration: config.TOAST_SUCCESS_TIME
            }
        )
        

    }, [statsQuery, reload])

    const collectClubData = (labels, data, colors) => {

        const allClubsData = []
        for(let i=0;i<labels.length;i++) {
            allClubsData.push({ label: labels[i], data: data[i], color: colors[i] })
        }

        allClubsData.sort((package1, package2) => package2.data - package1.data)

        return allClubsData
    }



    return (
        <>
        { authorized
        &&
        <div className="blue-grey lighten-5">
            <Toaster />
            <StatDatePicker setStatQuery={setStatsQuery} loading={isLoading} />
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar pageName={translations[lang]["Dashboard"]} statsQuery={statsQuery} />
                        <div className="page-main">
                            <PageHeader pageName={'Dashboard'} reload={reload} setReload={setReload} statsQuery={statsQuery} />
                            <div className="row">
                                <div className="col s12 m4">
                                    <Card 
                                    title={translations[lang]["Net Profit"]} 
                                    icon={iconPicker('earnings')} 
                                    number={netProfit} 
                                    color={config.color.purple} 
                                    isMoney={true}
                                    currency={lang}
                                    />
                                </div>
                                <div className="col s12 m4">
                                    <Card 
                                    title={translations[lang]["Earnings"]} 
                                    icon={<LoginIcon />} 
                                    number={totalEarnings} 
                                    color={config.color.cyan} 
                                    isMoney={true}
                                    currency={lang}
                                    />
                                </div>
                                <div className="col s12 m4">
                                    <Card 
                                    title={translations[lang]["Deductions"]} 
                                    icon={<LogoutIcon />} 
                                    number={totalDeductions} 
                                    color={config.color.cyan}
                                    isMoney={true}
                                    currency={lang}
                                    />
                                </div>
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]["Registrations"]} icon={iconPicker('registrations')} number={totalRegistrations} color={config.color.blue} />
                                    </div> 
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]["Attendances"]} icon={iconPicker('attendances')} number={totalAttendances} color={config.color.cyan} />
                                    </div>
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]["Members"]} icon={iconPicker('members')} number={totalMembers} color={config.color.cyan} />
                                    </div>
                                </div>
                                <div className="row">
                                <div className="col s12">
                                    <div className="white my-container-padding card-effect">
                                        <h5 className="left">
                                        {translations[lang]['Registrations Growth']}
                                        </h5>
                                        <div className="row">
                                            <div className="col s12">
                                            <a className="modal-trigger" href="#month-line-chart-modal">
                                                <LineChart title={translations[lang]['Registrations Growth']} labels={growthLabels} data={growthData} color={'dodgerblue'} />
                                            </a>
                                            <ChartModal id="month-line-chart-modal">
                                                <LineChart 
                                                title={translations[lang]['Registrations Growth']}
                                                labels={growthLabels} 
                                                data={growthData} 
                                                color={'dodgerblue'} 
                                                />
                                            </ChartModal>
                                            </div>
                                        </div>
                                </div>
                                </div>
                                </div>
                                

                                    <div className="card-effect white my-container">
                                    <h5>
                                        {translations[lang]['Attendances']} {translations[lang]['Times']} 
                                    </h5>
                                    <div className="row">
                                        <div className="col s12 m6 chart-table-container">
                                            <PercentagesCard 
                                            category={translations[lang]['Times']}
                                            dataOf={translations[lang]['Attendances']}
                                            percentOf={'Attendance'}
                                            percentages={collectClubData(hoursLabels, hoursData, config.colors)}
                                            total={totalAttendances}
                                            
                                            />
                                        </div>
                                        <div className="col s12 m6">
                                            <BarChart 
                                            title={''}
                                            labels={hoursLabels}
                                            data={hoursData}
                                            color={'dodgerblue'}
                                            />
                                        </div>
                                    </div>
                                <div>

                                </div>
                                </div>
                            <div className="row">
                                <div className="col s12">
                                <ClubPaymentsTable 
                                    data={payments} 
                                    view={'all'}
                                    statsQuery={statsQuery}
                                    currency={translations[lang]['EGP']}
                                    isRegistrationAdded={true}
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

export default ClubDashboardPage