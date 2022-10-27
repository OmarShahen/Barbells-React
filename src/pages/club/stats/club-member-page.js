import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import ClubSideBar from '../../../components/navigation/club-admin-side-bar'
import ChainOwnerSideBar from '../../../components/navigation/chain-owner-side-bar'
import Card from '../../../components/cards/card'
import ClubRegistrationTable from '../../../components/tables/club/club-registrations'
import BarChart from '../../../components/charts/bar-chart'
import LineChart from '../../../components/charts/line-chart'
import { config } from '../../../config/config'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/floating-button'
import StatDatePicker from '../../../components/forms/stats-date-picker-form'
import ChartModal from '../../../components/modals/chart-modal'
import { format } from 'date-fns'
import translations from '../../../i18n'
import { iconPicker } from '../../../utils/icon-finder'
import { to12 } from '../../../utils/hours'
import PercentagesCard from '../../../components/cards/percentages-card'
import BasicStatTable from '../../../components/tables/basic-stat'
import CachedIcon from '@mui/icons-material/Cached'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'


const ClubMemberPage = ({ roles }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': JSON.parse(localStorage.getItem('access-token')) }
    const pagePath = window.location.pathname
    const memberId = pagePath.split('/')[5]

    const user = JSON.parse(localStorage.getItem('user'))
    const accessToken = localStorage.getItem('access-token')
    const lang = localStorage.getItem('lang')

    const [authorized, setAuthorized] = useState(false)
    const [reload, setReload] = useState(0)
    const [statQuery, setStatQuery] = useState({ until: format(new Date(), 'yyyy-MM-dd') })


    const [member, setMember] = useState({})
    const [totalRegistrations, setTotalRegistrations] = useState(0)
    const [totalAttendances, setTotalAttendances] = useState(0)

    const [registrations, setRegistrations] = useState([])

    const [registrationCompletionStat, setRegistrationCompletionStat] = useState({
        completedRegistrationAttendancePercentage: 0,
        completedRegistrationAttendance: 0,
        incompletedRegistrationAttendancePercentage: 0,
        incompletedRegistrationAttendance: 0,
    })

    const [hoursLabels, setHoursLabels] = useState([])
    const [hoursData, setHoursData] = useState([])

    const [daysLabels, setDaysLabels] = useState([])
    const [daysData, setDaysData] = useState([])

    const [growthLabels, setGrowthLabels] = useState([])
    const [growthData, setGrowthData] = useState([])

    const [completionLabel, setCompletionLabel] = useState([])
    const [completionData, setCompletionData] = useState([])

    const [totalPackagesRegistrations, setTotalPackagesRegistrations] = useState(0)
    const [packagesRegistrationsLabels, setPackagesRegistrationsLabels] = useState([])
    const [packagesRegistrationsData, setPackagesRegistrationsData] = useState([])

    const collectPackagesData = (labels, data, colors) => {

        const allPackagesData = []
        for(let i=0;i<labels.length;i++) {
            allPackagesData.push({ label: labels[i], data: data[i], color: colors[i] })
        }

        allPackagesData.sort((package1, package2) => package2.data - package1.data)

        return allPackagesData
    }

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
            serverRequest.get(`members/${memberId}/stats`, {
                params: statQuery,
                headers
            })
            .then(response => {
    
                const data = response.data
    
                setMember(data.member)
    
                setTotalRegistrations(data.totalRegistrations)
                setTotalAttendances(data.totalAttendances)
    
                setRegistrations(data.registrations)
    
                const hoursStat = data.attendancesStatsHour
                const growthStat = data.attendancesGrowthStats
                const daysStat = data.attendancesStatsDay
                const packagesRegistrationsStats = data.packagesRegistrationsStats
                
                let hoursLabels = hoursStat.map(stat => stat._id)
                let hoursData = hoursStat.map(stat => stat.count)
    
                let growthLabels = growthStat.map(stat => stat._id)
                let growthData = growthStat.map(stat => stat.count)
    
                let daysLabels = daysStat.map(stat => translations[lang][stat.dayName])
                let daysData = daysStat.map(stat => stat.count)
    
                let packagesRegistrationsLabels = packagesRegistrationsStats.map(stat => stat.package.title)
                let packagesRegistrationsData = packagesRegistrationsStats.map(stat => stat.count)
    
                let totalPackagesRegistrations = 0
                packagesRegistrationsStats.forEach(stat => totalPackagesRegistrations += stat.count)
    
                setTotalPackagesRegistrations(totalPackagesRegistrations)
    
                setRegistrationCompletionStat(data.registrationCompletionStat)
    
                setCompletionLabel([translations[lang]['Complete'], translations[lang]['Incomplete']])
                setCompletionData([
                    data.registrationCompletionStat.completedRegistrationAttendancePercentage,
                    data.registrationCompletionStat.incompletedRegistrationAttendancePercentage
                ])
    
                setHoursLabels(to12(hoursLabels))
                setHoursData(hoursData)
    
                setDaysLabels(daysLabels)
                setDaysData(daysData)
    
                setGrowthLabels(growthLabels)
                setGrowthData(growthData)
    
                setPackagesRegistrationsLabels(packagesRegistrationsLabels)
                setPackagesRegistrationsData(packagesRegistrationsData)
    
            })
            .catch(errorResponse => {
                throw errorResponse
            }),
            {
                loading: <strong>{translations[lang]['member-loading']}</strong>,
                success: <strong>{translations[lang]['member-success']}</strong>,
                error: <strong>{translations[lang]['member-error']}</strong>
            },
            {
                position: 'top-right',
                duration: config.TOAST_SUCCESS_TIME
            }

        )

    }, [statQuery, reload])



    return (
        <>
        {
            authorized
            &&
            <div className="blue-grey lighten-5">
            { user.role === 'OWNER' ? <ChainOwnerSideBar /> : <ClubSideBar /> }
            <Toaster />
            <FloatingFormButton />
            <StatDatePicker setStatQuery={setStatQuery} />
            <div className="page">
                <div className="row">
                <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <NavBar pageName={translations[lang]["Member Stats"]} statsQuery={statQuery} pageRoles={roles} />
                    <div className="page-main">
                    <div className="page-body-header">
                            <h5>
                                {member.name}
                            </h5>
                            <div className="reload-icon" onClick={e => setReload(reload + 1)}>
                                <CachedIcon /> 
                            </div>
                        </div>
                            <div className="row">
                                    <div className="col s12 m6">
                                        <Card title={translations[lang]["Registrations"]} icon={iconPicker('registrations')} number={totalRegistrations} color={'dodgerblue'}/>
                                    </div>
                                    <div className="col s12 m6">
                                        <Card title={translations[lang]["Attendances"]} icon={iconPicker('attendances')} number={totalAttendances} color={'#00e676'}/>
                                    </div>
                            </div>  
                        <div className="white my-container card-effect">
                                <h5 className="center">
                                    {translations[lang]['Registrations Growth']}
                                </h5>
                                
                                    <a className="modal-trigger" href="#month-line-chart-modal">
                                        <LineChart title={translations[lang]['Registrations Growth']} labels={growthLabels} data={growthData} color={'dodgerblue'} />
                                    </a>
                                    <ChartModal id="month-line-chart-modal">
                                        <LineChart 
                                        title={translations[lang]['Registrations Growth']} 
                                        labels={growthData} 
                                        data={growthLabels} 
                                        color={'dodgerblue'} 
                                        />
                                    </ChartModal>
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
                                        percentages={collectPackagesData(daysLabels, daysData, config.colors)}
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
                                    {translations[lang]['Attendances Hours']}
                                </h5>
                                <div className="row">
                                    <div className="col s12 m6 chart-table-container">
                                        <PercentagesCard 
                                        category={translations[lang]['Times']}
                                        dataOf={translations[lang]['Attendances']}
                                        percentOf={'Attendance'}
                                        percentages={collectPackagesData(hoursLabels, hoursData, config.colors)}
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
                                <div className="white card-effect my-container">
                            <h5>
                                {translations[lang]['Registrations Completion']}
                            </h5>
                            <div className="row chart-graph-container">
                                <div className="col s12 m6">
                                    <BasicStatTable 
                                    headers={[
                                        translations[lang]['Completion'], 
                                        `${translations[lang]['Total']} #`, 
                                        `${translations[lang]['Percentages']} %`
                                    ]}
                                    data={[
                                        {
                                            title: translations[lang]['Complete'],
                                            number: registrationCompletionStat.completedRegistrationAttendance,
                                            percentage: registrationCompletionStat.completedRegistrationAttendancePercentage
                                        },
                                        {
                                            title: translations[lang]['Incomplete'],
                                            number: registrationCompletionStat.incompletedRegistrationAttendance,
                                            percentage: registrationCompletionStat.incompletedRegistrationAttendancePercentage
                                        }
                                    ]}
                                    />
                                </div>
                                <div className="col s12 m6">
                                    <BarChart 
                                    labels={completionLabel}
                                    data={completionData}
                                    color={'dodgerblue'}
                                    />
                                </div>
                            </div>
                            
                                </div>
                                <div className="card-effect white my-container">
                                <h5>
                                    {translations[lang]['Member Packages']}
                                </h5>
                                <div className="row">
                                    <div className="col s12 m6 chart-table-container">
                                        <PercentagesCard 
                                        category={translations[lang]['Packages']}
                                        dataOf={translations[lang]['Registrations']}
                                        percentOf={'Registration'}
                                        percentages={collectPackagesData(packagesRegistrationsLabels, packagesRegistrationsData, config.colors)}
                                        total={totalPackagesRegistrations}
                                        
                                        />
                                    </div>
                                    <div className="col s12 m6">
                                        <BarChart 
                                        title={''}
                                        labels={packagesRegistrationsLabels}
                                        data={packagesRegistrationsData}
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

export default ClubMemberPage