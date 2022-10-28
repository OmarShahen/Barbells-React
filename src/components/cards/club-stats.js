import React, { useState, useEffect } from 'react'
import LineChart from '../charts/line-chart'
import { serverRequest } from '../../API/request'
import toast from 'react-hot-toast'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import translations from '../../i18n'
import { localStorageSecured } from '../../security/localStorage'

const ClubStatsCard = ({ clubId, statsQuery }) => {

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }
    const lang = localStorage.getItem('lang')

    const [clubName, setClubName] = useState()
    const [clubDescription, setClubDescription] = useState()
    const [totalRegistrations, setTotalRegistrations] = useState(0)
    const [totalAttendances, setTotalAttendances] = useState(0)
    const [totalEarnings, setTotalEarnings] = useState(0)

    const [growthLabels, setGrowthLabels] = useState([])
    const[growthData, setGrowthData] = useState([])

    useEffect(() => {

        serverRequest.get(`/clubs/${clubId}/stats/main`, {
            params: statsQuery,
            headers
        })
        .then(response => {

            const data = response.data

            const growthStats = data.registrationsGrowthStats
            let growthLabels = growthStats.map(stat => stat._id)
            let growthData = growthStats.map(stat => stat.count)

            setClubName(data.club.clubCode)
            setClubDescription(data.club.description)

            setTotalRegistrations(data.totalRegistrations)
            setTotalAttendances(data.totalAttendances)
            setTotalEarnings(data.totalEarnings)

            setGrowthLabels(growthLabels)
            setGrowthData(growthData)

        })
        .catch(error => {
            console.error(error)
            toast.error(error.message, { duration: 5000, position: 'top-right' })

        })

    }, [])


    return (
        <div className="club-card-container card-effect white">
            <div className="club-card-header">
                <div>
                <h5>
                    {clubName}
                </h5>
                <span className="grey-text">
                    {clubDescription}
                </span>
                </div>
                <div className="stat-icon">
                    <span>
                        <StorefrontOutlinedIcon />
                    </span>
                </div>
            </div>
            <div className="divider"></div>

            <div className="club-card-body">
                <div className="club-card-body-graph">
                    <LineChart 
                    title={translations[lang]['club registrations growth']} 
                    hideCard={true} 
                    labels={growthLabels}
                    data={growthData}
                    color={'dodgerblue'}
                    />
                </div>
                <div className="divider"></div>
                <div className="club-card-body-info">
                    <div>
                        <strong>{translations[lang]['Registrations']}</strong>
                        <span>{totalRegistrations}</span>
                    </div>
                    <div className="divider"></div>
                    <div>
                        <strong>{translations[lang]['Earnings']}</strong>
                        <span>{totalEarnings}</span>
                    </div>
                    <div className="divider"></div>
                    <div>
                        <strong>{translations[lang]['Attendances']}</strong>
                        <span>{totalAttendances}</span>
                    </div>
                    <div className="divider"></div>
                </div>
            </div>
        </div>
    )
}

export default ClubStatsCard