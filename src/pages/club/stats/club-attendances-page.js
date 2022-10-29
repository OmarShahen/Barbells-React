import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import SideBar from '../../../components/navigation/club-admin-side-bar'
import Card from '../../../components/cards/card'
import AttendancesTable from '../../../components/tables/club/club-attendances'
import BarChart from '../../../components/charts/bar-chart'
import LineChart from '../../../components/charts/line-chart'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/floating-button'
import StatDatePicker from '../../../components/forms/stats-date-picker-form'
import ChartModal from '../../../components/modals/chart-modal'
import { config } from '../../../config/config'
import { format } from 'date-fns'
import translations from '../../../i18n'
import { iconPicker } from '../../../utils/icon-finder'
import { to12 } from '../../../utils/hours'
import CachedIcon from '@mui/icons-material/Cached'
import PercentagesCard from '../../../components/cards/percentages-card'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'

const ClubsAttendancesPage = ({ roles }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }
    const pagePath = window.location.pathname
    const ownerId = pagePath.split('/')[3]

    const user = localStorageSecured.get('user')
    const accessToken = localStorageSecured.get('access-token')

    const lang = localStorage.getItem('lang')

    let todayDate = new Date()
    let monthDate = new Date(todayDate.setDate(todayDate.getDate() - 30))
    todayDate = new Date()

    const [reload, setReload] = useState(0)
    const [statQuery, setStatQuery] = useState({
        from: format(monthDate, 'yyyy-MM-dd'), 
        to: format(todayDate, 'yyyy-MM-dd') 
    })

    const [authorized, setAuthorized] = useState(false)

    const [totalAttendances, setTotalAttendances] = useState(0)
    const [totalCancelledAttendances, setTotalCancelledAttendances] = useState(0)
    const [attendances, setAttendances] = useState([])


    const [growthLabels, setGrowthLabels] = useState([])
    const [growthData, setGrowthData] = useState([])

    const [monthsLabels, setMonthsLabels] = useState([])
    const [monthsData, setMonthsData] = useState([])

    const [daysLabels, setDaysLabels] = useState([])
    const [daysData, setDaysData] = useState([])

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

        toast.promise(
            serverRequest.get(`/attendances/clubs/${ownerId}/stats`, {
                params: statQuery,
                headers
            })
            .then(response => {
    
                const data = response.data
    
                setTotalAttendances(data.totalAttendances)
                setTotalCancelledAttendances(data.totalCancelledAttendances)
                setAttendances(data.attendances)
    
                const growthStats = data.attendancesStatsGrowth
                let growthLabels = growthStats.map(stat => stat._id)
                let growthData = growthStats.map(stat => stat.count)
    
                const monthsStats = data.attendancesStatsMonth
                let monthsLabels = monthsStats.map(stat => translations[lang][stat.month])
                let monthsData = monthsStats.map(stat => stat.count)
    
                const daysStats = data.attendancesStatsDay
                let daysLabels = daysStats.map(stat => translations[lang][stat.dayName])
                let daysData = daysStats.map(stat => stat.count)
    
                const hoursStats = data.attendancesStatsHour
                let hoursLabels = hoursStats.map(stat => stat._id)
                let hoursData = hoursStats.map(stat => stat.count)
    
                setGrowthLabels(growthLabels)
                setGrowthData(growthData)
    
                setMonthsLabels(monthsLabels)
                setMonthsData(monthsData)
    
                setDaysLabels(daysLabels)
                setDaysData(daysData)
    
                setHoursLabels(to12(hoursLabels))
                setHoursData(hoursData)
    
            })
            .catch(errorResponse => {
                throw errorResponse 
            }),
            {
                loading: <strong>{translations[lang]['attendances-loading']}</strong>,
                success: <strong>{translations[lang]['attendances-success']}</strong>,
                error: <strong>{translations[lang]['attendances-error']}</strong>
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
        {
            authorized
            &&
            <div className="lighten-5 page-body">
            <SideBar />
            <Toaster />
            <FloatingFormButton />
            <StatDatePicker setStatQuery={setStatQuery} />
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar pageName={translations[lang]['Attendances Stats']} statsQuery={statQuery} pageRoles={roles} />
                        <div className="page-main">
                            <div className="page-body-header">
                                <h5>
                                    {translations[lang]['Attendances']}
                                </h5>
                                <div className="reload-icon" onClick={e => setReload(reload + 1)}>
                                   <CachedIcon /> 
                                </div>
                            </div>
                            <div className="row">
                                    <div className="col s12 m6">
                                        <Card title={translations[lang]["Attendances"]} number={totalAttendances} icon={iconPicker('attendances')} color={'#aa00ff'}/>
                                    </div>
                                    <div className="col s12 m6">
                                        <Card title={translations[lang]["Cancelled"]} number={totalCancelledAttendances} icon={iconPicker('cancelled')} color={'#aa00ff'}/>
                                    </div>
                            </div>
                            <div className="white my-container card-effect">
                                    <h5 className="left">
                                        {translations[lang]['Attendances Growth']}
                                    </h5>
                                    <a className="modal-trigger" href="#month-line-chart-modal">
                                            <LineChart title={translations[lang]['Attendances Growth']} labels={growthLabels} data={growthData} color={'dodgerblue'} />
                                        </a>
                                        <ChartModal id="month-line-chart-modal">
                                            <LineChart 
                                            title={translations[lang]['Attendances Growth']} 
                                            labels={growthData} 
                                            data={growthLabels} 
                                            color={'dodgerblue'} 
                                            />
                                        </ChartModal>
                                    </div>
                            <div className="card-effect white my-container">
                                    <h5>
                                        {translations[lang]['Attendances Months']}
                                    </h5>
                                    <div className="row">
                                        <div className="col s12 m6 chart-table-container">
                                            <PercentagesCard 
                                            category={translations[lang]['Months']}
                                            dataOf={translations[lang]['Attendances']}
                                            percentOf={'Attendance'}
                                            percentages={collectClubData(monthsLabels, monthsData, config.colors)}
                                            total={totalAttendances}
                                            
                                            />
                                        </div>
                                        <div className="col s12 m6">
                                            <BarChart 
                                            title={''}
                                            labels={monthsLabels}
                                            data={monthsData}
                                            color={'dodgerblue'}
                                            />
                                        </div>
                                    </div>
                                <div>

                                </div>
                            </div>

                            <div className="card-effect white my-container">
                                    <h5>
                                        {translations[lang]['Attendances Days']}
                                    </h5>
                                    <div className="row">
                                        <div className="col s12 m6 chart-table-container">
                                            <PercentagesCard 
                                            category={translations[lang]['Days']}
                                            dataOf={translations[lang]['Attendances']}
                                            percentOf={'Attendance'}
                                            percentages={collectClubData(daysLabels, daysData, config.colors)}
                                            total={totalAttendances}
                                            
                                            />
                                        </div>
                                        <div className="col s12 m6">
                                            <BarChart 
                                            title={''}
                                            labels={daysLabels}
                                            data={daysData}
                                            color={'dodgerblue'}
                                            />
                                        </div>
                                    </div>
                                <div>

                                </div>
                            </div>

                            <div className="card-effect white my-container">
                                    <h5>
                                        {translations[lang]['Attendances Times']}
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
                                    <AttendancesTable data={attendances} />
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

export default ClubsAttendancesPage