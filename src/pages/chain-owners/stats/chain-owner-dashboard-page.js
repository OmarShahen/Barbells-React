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
import { iconPicker } from '../../../utils/icon-finder'
import ClubStatsCard from '../../../components/cards/club-stats'
import translations from '../../../i18n'
import { format } from 'date-fns'
import { config } from '../../../config/config'
import PercentagesCard from '../../../components/cards/percentages-card'
import CachedIcon from '@mui/icons-material/Cached'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import DataDateShower from '../../../components/data-date-shower'

const ChainOwnersDashboardPage = () => {

    const headers = { 'x-access-token': localStorage.getItem('access-token') }
    const pagePath = window.location.pathname
    const ownerId = pagePath.split('/')[3]

    const chainOwner = JSON.parse(localStorage.getItem('user'))
    const ownedClubs = chainOwner.clubs

    const lang = localStorage.getItem('lang')

    const todayDate = new Date()

    const [reload, setReload] = useState(0)
    const [statQuery, setStatQuery] = useState({ until: format(todayDate, 'yyyy-MM-dd') })


    const [totalRegistrations, setTotalRegistrations] = useState(0)
    const [totalEarnings, setTotalEarnings] = useState(0)
    const [totalAttendances, setTotalAttendances] = useState(0)
    const [totalMembers, setTotalMembers] = useState(0)
    const [registrations, setRegistrations] = useState([])

    const [monthsLabels, setMonthsLabels] = useState([])
    const [monthsData, setMonthsData] = useState([])

    const [clubsLabels, setClubsLabels] = useState([])
    const [clubsData, setClubsData] = useState([])


    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])
      
    useEffect(() => {

        toast.promise(
            serverRequest.get(`chain-owners/${ownerId}/stats`, {
                params: statQuery,
                headers
            })
            .then(response => {
    
                const data = response.data
    
                setTotalRegistrations(data.totalRegistrations)
                setTotalEarnings(data.totalEarnings)
                setTotalAttendances(data.totalAttendances)
                setTotalMembers(data.totalMembers)
                setRegistrations(data.registrations)
    
                const monthsStat = data.registrationsStatsByMonths
                const clubsRegistrationsStats = data.clubsRegistrationsStats
    
                let monthsLabels = monthsStat.map(stat => stat._id)
                let monthsData = monthsStat.map(stat => stat.count)
    
                let clubsLabels = clubsRegistrationsStats.map(stat => stat.club.clubCode)
                let clubsData = clubsRegistrationsStats.map(stat => stat.count)
    
                setMonthsLabels(monthsLabels)
                setMonthsData(monthsData)
    
                setClubsLabels(clubsLabels)
                setClubsData(clubsData)    
            })
            .catch(errorResponse => {
                throw errorResponse
            })
            ,{
                loading: <strong>{translations[lang]['dashboard-loading']}</strong>,
                success: <strong>{translations[lang]['dashboard-success']}</strong>,
                error: <strong>{translations[lang]['dashboard-error']}</strong>
            },
            {
                position: 'top-right',
                duration: config.TOAST_SUCCESS_TIME
            }
        )


    }, [statQuery, reload])

    const collectRegistrationsData = (labels, data, colors) => {

        const allRegistrationsData = []
        for(let i=0;i<labels.length;i++) {
            allRegistrationsData.push({ label: labels[i], data: data[i], color: colors[i] })
        }

        allRegistrationsData.sort((package1, package2) => package2.data - package1.data)

        return allRegistrationsData
    }


    return (
        <div className="lighten-5 page-body">
            <SideBar />
            <Toaster />
            <FloatingFormButton />
            <StatDatePicker setStatQuery={setStatQuery} />

            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar pageName={translations[lang]['Dashboard']} statsQuery={statQuery} />
                        <div className="page-main">
                            <div className="page-body-header">
                                <h5>
                                    {translations[lang]['Dashboard']}
                                </h5>
                                <div className="reload-icon" onClick={e => setReload(reload + 1)}>
                                   <CachedIcon /> 
                                </div>
                            </div>
                            <div className="row">
                                    <div className="col s12 m3">
                                        <Card title={translations[lang]["Registrations"]} number={totalRegistrations} icon={iconPicker('registrations')} color={'dodgerblue'}/>
                                    </div>
                                    <div className="col s12 m3">
                                        <Card title={translations[lang]["Earnings"]} number={totalEarnings} icon={iconPicker('earnings')} color={'red'}/>
                                    </div>
                                    <div className="col s12 m3">
                                        <Card title={translations[lang]["Attendances"]} number={totalAttendances} icon={iconPicker('attendances')} color={'#aa00ff'}/>
                                    </div>
                                    <div className="col s12 m3">
                                        <Card title={translations[lang]["Members"]} number={totalMembers} icon={iconPicker('members')} color={'#aa00ff'}/>
                                    </div>
                            </div>
                                <div className="white my-container card-effect">
                                    <h5>
                                        {translations[lang]['Registrations Growth']}
                                    </h5>
                                    <a className="modal-trigger" href="#month-line-chart-modal">
                                            <LineChart title={translations[lang]['Registrations Growth']} labels={monthsLabels} data={monthsData} color={'dodgerblue'} />
                                        </a>
                                        <ChartModal id="month-line-chart-modal">
                                            <LineChart 
                                            title={translations[lang]['Registrations Growth']} 
                                            labels={monthsLabels} 
                                            data={monthsData} 
                                            color={'dodgerblue'} 
                                            />
                                        </ChartModal>
                                    </div>
                                <div className="card-effect white my-container">
                                    <h5>
                                        {translations[lang]['Clubs Registrations']}
                                    </h5>
                                    <div className="row chart-graph-container">
                                        <div className="col s12 m6 chart-table-container">
                                            <PercentagesCard 
                                            category={translations[lang]['Clubs']}
                                            dataOf={translations[lang]['Registrations']}
                                            percentOf={'Registration'}
                                            percentages={collectRegistrationsData(clubsLabels, clubsData, config.colors)}
                                            total={totalRegistrations}
                                            
                                            />
                                        </div>
                                        <div className="col s12 m6 graph-container">
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
                                <div className="row">
                                {
                                    ownedClubs.map(club => {
                                        return <div className="col s12 m4">
                                        <ClubStatsCard clubId={club._id} statsQuery={statQuery} />
                                    </div>
                                    })
                                }
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
    )
}

export default ChainOwnersDashboardPage