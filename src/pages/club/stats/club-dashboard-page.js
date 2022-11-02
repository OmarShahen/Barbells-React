import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import SideBar from '../../../components/navigation/club-admin-side-bar'
import Card from '../../../components/cards/card'
import ClubRegistrationTable from '../../../components/tables/club/club-registrations'
import BarChart from '../../../components/charts/bar-chart'
import LineChart from '../../../components/charts/line-chart'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/floating-button'
import StatDatePicker from '../../../components/forms/stats-date-picker-form'
import ChartModal from '../../../components/modals/chart-modal'
import { config } from '../../../config/config'
import { format } from 'date-fns'
import translation from '../../../i18n/index'
import { iconPicker } from '../../../utils/icon-finder'
import { to12 } from '../../../utils/hours'
import CachedIcon from '@mui/icons-material/Cached'
import PercentagesCard from '../../../components/cards/percentages-card'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'

const ClubDashboardPage = ({ roles }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }
    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')

    const todayDate = new Date()

    const user = localStorageSecured.get('user')
    const accessToken = localStorageSecured.get('access-token')

    const [authorized, setAuthorized] = useState(false)
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [statQuery, setStatQuery] = useState({ specific: format(todayDate, 'yyyy-MM-dd') })

    const [totalRegistrations, setTotalRegistrations] = useState(0)
    const [totalEarnings, setTotalEarnings] = useState(0)
    const [totalAttendances, setTotalAttendances] = useState(0)
    const [totalMembers, setTotalMembers] = useState(0)
    const [registrations, setRegistrations] = useState([])

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
            serverRequest.get(`clubs/${clubId}/stats`, {
                params: statQuery,
                headers
            })
            .then(response => {
                setIsLoading(false)
    
                const data = response.data
    
                setTotalRegistrations(data.totalRegistrations)
                setTotalEarnings(data.totalEarnings)
                setTotalAttendances(data.totalAttendances)
                setRegistrations(data.registrations)
                setTotalMembers(data.totalMembers)
    
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
                loading: <strong>{translation[lang]['dashboard-loading']}</strong>,
                success: <strong>{translation[lang]['dashboard-success']}</strong>,
                error: <strong>{translation[lang]['dashboard-error']}</strong>
            },
            {
                position: 'top-right',
                duration: config.TOAST_SUCCESS_TIME
            }
        )
        

    }, [statQuery, reload])

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
            <SideBar />
            <Toaster />
            <FloatingFormButton />
            <StatDatePicker setStatQuery={setStatQuery} loading={isLoading} />
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar pageName={translation[lang]["Dashboard"]} statsQuery={statQuery} />
                        <div className="page-main">
                        <div className="page-body-header">
                                <h5>
                                    {translation[lang]['Dashboard']}
                                </h5>
                                <div className="header-icon-container">
                                    
                                    <div className="reload-icon" onClick={e => setReload(reload + 1)}>
                                        <CachedIcon /> 
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col s12 m3">
                                    <Card title={translation[lang]["Registrations"]} icon={iconPicker('registrations')} number={totalRegistrations} color={config.color.blue} />
                                </div>
                                <div className="col s12 m3">
                                    <Card title={translation[lang]["Earnings"]} icon={iconPicker('earnings')} number={totalEarnings} color={config.color.purple} />
                                </div>
                                <div className="col s12 m3">
                                    <Card title={translation[lang]["Attendances"]} icon={iconPicker('attendances')} number={totalAttendances} color={config.color.cyan} />
                                </div>
                                <div className="col s12 m3">
                                    <Card title={translation[lang]["Members"]} icon={iconPicker('members')} number={totalMembers} color={config.color.cyan} />
                                </div>
                            </div>
                            <div className="white my-container card-effect">
                                    <h5 className="left">
                                    {translation[lang]['Registrations Growth']}
                                    </h5>
                                    <div className="row">
                                        <div className="col s12">
                                        <a className="modal-trigger" href="#month-line-chart-modal">
                                            <LineChart title={translation[lang]['Registrations Growth']} labels={growthLabels} data={growthData} color={'dodgerblue'} />
                                        </a>
                                        <ChartModal id="month-line-chart-modal">
                                            <LineChart 
                                            title={translation[lang]['Registrations Growth']}
                                            labels={growthLabels} 
                                            data={growthData} 
                                            color={'dodgerblue'} 
                                            />
                                        </ChartModal>
                                        </div>
                                    </div>
                                    </div>

                                    <div className="card-effect white my-container">
                                    <h5>
                                        {translation[lang]['Attendances']} {translation[lang]['Times']} 
                                    </h5>
                                    <div className="row">
                                        <div className="col s12 m6 chart-table-container">
                                            <PercentagesCard 
                                            category={translation[lang]['Times']}
                                            dataOf={translation[lang]['Attendances']}
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
                                    <ClubRegistrationTable data={registrations} />
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