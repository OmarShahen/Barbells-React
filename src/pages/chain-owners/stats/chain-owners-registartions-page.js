import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/chain-owner-nav-bar'
import SideBar from '../../../components/navigation/chain-owner-side-bar'
import Card from '../../../components/cards/card'
import RegistrationsTable from '../../../components/tables/club/club-registrations'
import BarChart from '../../../components/charts/bar-chart'
import LineChart from '../../../components/charts/line-chart'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/floating-button'
import StatDatePicker from '../../../components/forms/stats-date-picker-form'
import ChartModal from '../../../components/modals/chart-modal'
import { config } from '../../../config/config'
import format from 'date-fns/format'
import { iconPicker } from '../../../utils/icon-finder'
import PercentagesCard from '../../../components/cards/percentages-card'
import translations from '../../../i18n'
import CachedIcon from '@mui/icons-material/Cached'
import BasicStatTable from '../../../components/tables/basic-stat'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'


const ChainOwnersRegistrationsPage = ({ roles }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }
    const pagePath = window.location.pathname
    const ownerId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    const user = localStorageSecured.get('user')
    const accessToken = localStorageSecured.get('access-token')

    const todayDate = new Date()
    const monthDate = new Date()
    monthDate.setDate(monthDate.getDate() - 30)
    todayDate.setDate(todayDate.getDate() + 1)

    const [statQuery, setStatQuery] = useState({ 
        from: format(monthDate, 'yyyy-MM-dd'), 
        to: format(todayDate, 'yyyy-MM-dd') 
    })


    const [totalRegistrations, setTotalRegistrations] = useState(0)
    const [totalFreezedRegistrations, setTotalFreezedRegistrations] = useState(0)
    const [totalCancelledRegistrations, setTotalCancelledRegistrations] = useState(0)
    const [totalEarnings, setTotalEarnings] = useState(0)
    const [totalActiveRegistrations, setTotalActiveRegistrations] = useState(0)
    const [totalExpiredRegistrations, setTotalExpiredRegistrations] = useState(0)
    const [registrations, setRegistrations] = useState([])

    const [authorized, setAuthorized] = useState(false)
    const [reload, setReload] = useState(0)

    const [registrationCompletionStat, setRegistrationCompletionStat] = useState({
        completedRegistrationAttendancePercentage: 0,
        completedRegistrationAttendance: 0,
        incompleteRegistrationAttendancePercentage: 0,
        incompleteRegistrationAttendance: 0,
        total: 0
    })

    const [monthsLabels, setMonthsLabels] = useState([])
    const [monthsData, setMonthsData] = useState([])

    const [growthLabels, setGrowthLabels] = useState([])
    const [growthData, setGrowthData] = useState([])

    const [clubsLabels, setClubsLabels] = useState([])
    const [clubsData, setClubsData] = useState([])

    const [registrationExpirationLabel, setRegistrationExpirationLabel] = useState([])
    const [registrationExpirationData, setRegistrationExpirationData] = useState([])

    useEffect(() => {

        if(!isUserValid(accessToken, user, roles)) {
            setAuthorized(false)
            navigate('/chains-owners/login')
        } else {
            setAuthorized(true)
        }
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])
      

    useEffect(() => {

        toast.promise(serverRequest.get(`/registrations/chain-owners/${ownerId}/stats`, {
            params: statQuery,
            headers
        })
        .then(response => {

            const data = response.data

            setTotalRegistrations(data.totalRegistrations)
            setTotalFreezedRegistrations(data.totalFreezedRegistrations)
            setTotalCancelledRegistrations(data.totalCancelledRegistrations)
            setTotalEarnings(data.totalEarnings)
            setTotalActiveRegistrations(data.totalActiveRegistrations)
            setTotalExpiredRegistrations(data.totalExpiredRegistrations)
            setRegistrations(data.registrations)

            const growthStats = data.registrationsStatsGrowth
            let growthLabels = growthStats.map(stat => stat._id)
            let growthData = growthStats.map(stat => stat.count)

            const monthsStats = data.registrationsStatsMonths
            let monthsLabels = monthsStats.map(stat => translations[lang][stat.month])
            let monthsData = monthsStats.map(stat => stat.count)

            const clubsStats = data.clubsRegistrationsStats
            let clubsLabels = clubsStats.map(stat => stat.club.clubCode)
            let clubsData = clubsStats.map(stat => stat.count)

            const registrationCompletionStat = data.registrationCompletionStat
            
            setRegistrationCompletionStat(registrationCompletionStat)
            setRegistrationExpirationLabel([translations[lang]['Expired By Attendance'], translations[lang]['Expired By Date']])
            setRegistrationExpirationData([
                registrationCompletionStat.completedRegistrationAttendance,
                registrationCompletionStat.incompleteRegistrationAttendance
            ])


            setGrowthLabels(growthLabels)
            setGrowthData(growthData)

            setMonthsLabels(monthsLabels)
            setMonthsData(monthsData)

            setClubsLabels(clubsLabels)
            setClubsData(clubsData)

        })
        .catch(errorResponse => {
            throw errorResponse
        })
        ,{
            loading: <strong>{translations[lang]['registrations-loading']}</strong>,
            success: <strong>{translations[lang]['registrations-success']}</strong>,
            error: <strong>{translations[lang]['registrations-error']}</strong>
        },
        {
            position: 'top-right',
            duration: config.TOAST_SUCCESS_TIME
        })

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
                        <NavBar pageName={translations[lang]['Registrations Stats']} statsQuery={statQuery} />
                        <div className="page-main">
                            <div className="page-body-header">
                                <h5>
                                    {translations[lang]['Registrations']}
                                </h5>
                                <div className="reload-icon" onClick={e => setReload(reload + 1)}>
                                   <CachedIcon /> 
                                </div>
                            </div>
                            <div className="row">
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]["Registrations"]} number={totalRegistrations} icon={iconPicker('registrations')} color={'dodgerblue'}/>
                                    </div>
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]["Earnings"]} number={totalEarnings} icon={iconPicker('earnings')} color={'red'}/>
                                    </div>
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]["Active"]} number={totalActiveRegistrations} icon={iconPicker('active')} color={'#aa00ff'}/>
                                    </div>
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]["Expired"]} number={totalExpiredRegistrations} icon={iconPicker('expired')} color={'#aa00ff'}/>
                                    </div>
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]["Cancelled"]} number={totalCancelledRegistrations} icon={iconPicker('cancelled')} color={'#aa00ff'}/>
                                    </div>
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]["Freezed"]} number={totalFreezedRegistrations} icon={iconPicker('freezed')} color={'#aa00ff'}/>
                                    </div>
                            </div>
                            <div className="white card-effect my-container">
                                    <h5>
                                        {translations[lang]['Registrations Growth']}
                                    </h5>
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
                            <div className="card-effect white my-container">
                                    <h5>
                                        {translations[lang]['Clubs Registrations']}
                                    </h5>
                                    <div className="row">
                                        <div className="col s12 m6 chart-table-container">
                                            <PercentagesCard 
                                            category={translations[lang]['Clubs']}
                                            dataOf={translations[lang]['Registrations']}
                                            percentOf={'Registration'}
                                            percentages={collectClubData(clubsLabels, clubsData, config.colors)}
                                            total={totalRegistrations}
                                            
                                            />
                                        </div>
                                        <div className="col s12 m6">
                                            <BarChart 
                                            title={''}
                                            labels={clubsLabels}
                                            data={clubsData}
                                            color={'dodgerblue'}
                                            />
                                        </div>
                                    </div>
                                <div>

                                </div>
                                </div>
                                
                            <div className="card-effect white my-container">
                                    <h5>
                                        {translations[lang]['Registrations Months']}
                                    </h5>
                                    <div className="row">
                                        <div className="col s12 m6 chart-table-container">
                                            <PercentagesCard 
                                            category={translations[lang]['Months']}
                                            dataOf={translations[lang]['Registrations']}
                                            percentOf={'Registration'}
                                            percentages={collectClubData(monthsLabels, monthsData, config.colors)}
                                            total={totalRegistrations}
                                            
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
                            <div className="white card-effect my-container">
                                <h5>
                                    {translations[lang]['Registrations Expiration Method']}
                                </h5>
                                <div className="row">
                                    <div className="col s12 m6">
                                        <BasicStatTable 
                                        headers={[
                                            translations[lang]['Expiration Method'], 
                                            `${translations[lang]['Total']} #`, 
                                            `${translations[lang]['Percentages']} %`
                                        ]}
                                        data={[
                                            {
                                                title: translations[lang]['Attendance'],
                                                number: registrationCompletionStat.completedRegistrationAttendance,
                                                percentage: registrationCompletionStat.completedRegistrationAttendancePercentage
                                            },
                                            {
                                                title: translations[lang]['Date'],
                                                number: registrationCompletionStat.incompleteRegistrationAttendance,
                                                percentage: registrationCompletionStat.incompleteRegistrationAttendancePercentage
                                            }
                                        ]}
                                        />
                                    </div>
                                    <div className="col s12 m6">
                                        <BarChart 
                                        labels={registrationExpirationLabel}
                                        data={registrationExpirationData}
                                        color={'dodgerblue'}
                                        />
                                    </div>
                                </div>
                                
                            </div>
                        

                            <div className="row">
                                <div className="col s12">
                                    <RegistrationsTable data={registrations} isClub={true} />
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

export default ChainOwnersRegistrationsPage