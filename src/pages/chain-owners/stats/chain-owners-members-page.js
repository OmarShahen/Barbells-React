import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/chain-owner-nav-bar'
import SideBar from '../../../components/navigation/chain-owner-side-bar'
import Card from '../../../components/cards/card'
import MembersTable from '../../../components/tables/club/club-members'
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
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'



const ChainOwnersMembersPage = ({ roles }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }
    const pagePath = window.location.pathname
    const ownerId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    const user = localStorageSecured.get('user')
    const accessToken = localStorageSecured.get('access-token')

    let todayDate = new Date()

    const [statQuery, setStatQuery] = useState({ until: format(todayDate, 'yyyy-MM-dd') })
    const [authorized, setAuthorized] = useState(false)
    const [reload, setReload] = useState(0)

    const [totalMembers, setTotalMembers] = useState(0)
    const [totalActiveMembers, setTotalActiveMembers] = useState(0)
    const [totalBlockedMembers, setTotalBlockedMembers] = useState(0)
    const [members, setMembers] = useState([])


    const [growthLabels, setGrowthLabels] = useState([])
    const [growthData, setGrowthData] = useState([])

    const [clubsLabels, setClubsLabels] = useState([])
    const [clubsData, setClubsData] = useState([])

    const [genderLables, setGenderLabels] = useState([])
    const [genderData, setGenderData] = useState([])

    const [ageLabels, setAgeLabels] = useState([])
    const [ageData, setAgeData] = useState([])

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

        toast.promise(serverRequest.get(`/members/chain-owners/${ownerId}/stats`, {
            params: statQuery,
            headers
        })
        .then(response => {

            const data = response.data

            setTotalMembers(data.totalMembers)
            setTotalActiveMembers(data.totalActiveMembers)
            setTotalBlockedMembers(data.totalBlockedMembers)
            setMembers(data.members)

            const growthStats = data.membersStatsGrowth
            let growthLabels = growthStats.map(stat => stat._id)
            let growthData = growthStats.map(stat => stat.count)

            const clubsStats = data.clubsMembersStats
            let clubsLabels = clubsStats.map(stat => stat.club.clubCode)
            let clubsData = clubsStats.map(stat => stat.count)

            const genderStats = data.membersGenderStats
            let genderLabels = genderStats.map(stat => translations[lang][stat._id])
            let genderData = genderStats.map(stat => stat.count)

            const ageStats = data.membersAgeStats
            let ageLabels = ageStats.map(stat => stat._id)
            let ageData = ageStats.map(stat => stat.count)


            setGrowthLabels(growthLabels)
            setGrowthData(growthData)

            setClubsLabels(clubsLabels)
            setClubsData(clubsData)

            setGenderLabels(genderLabels)
            setGenderData(genderData)

            setAgeLabels(ageLabels)
            setAgeData(ageData)
        })
        .catch(errorResponse => {
            throw errorResponse
        })
        ,{
            loading: <strong>{translations[lang]['members-loading']}</strong>,
            success: <strong>{translations[lang]['members-success']}</strong>,
            error: <strong>{translations[lang]['members-error']}</strong>
        },
        {
            position: 'top-right',
            duration: config.TOAST_SUCCESS_TIME
        })

    }, [statQuery, reload])

    const collectMemberData = (labels, data, colors) => {

        const allMembersData = []
        for(let i=0;i<labels.length;i++) {
            allMembersData.push({ label: labels[i], data: data[i], color: colors[i] })
        }

        allMembersData.sort((member1, member2) => member2.data - member1.data)

        return allMembersData
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
                        <NavBar pageName={translations[lang]['Members Stats']} statsQuery={statQuery} />
                        <div className="page-main">
                            <div className="page-body-header">
                                <h5>
                                    {translations[lang]['Members']}
                                </h5>
                                <div className="reload-icon" onClick={e => setReload(reload + 1)}>
                                   <CachedIcon /> 
                                </div>
                            </div>
                            <div className="row">
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]["Members"]} number={totalMembers} icon={iconPicker('members')} color={'dodgerblue'}/>
                                    </div>
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]["Active"]} number={totalActiveMembers} icon={iconPicker('active')} color={'red'}/>
                                    </div>
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]["Blocked"]} number={totalBlockedMembers} icon={iconPicker('blocked')} color={'#aa00ff'}/>
                                    </div>
                            </div>
                            <div className="white my-container card-effect">
                                    <h5>
                                        {translations[lang]['Members Growth']}
                                    </h5>
                                    <div className="row">
                                        <div className="col s12">
                                        <a className="modal-trigger" href="#month-line-chart-modal">
                                            <LineChart title={translations[lang]['Members Growth']} labels={growthLabels} data={growthData} color={'dodgerblue'} />
                                        </a>
                                        <ChartModal id="month-line-chart-modal">
                                            <LineChart 
                                            title={translations[lang]['Members Growth']} 
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
                                        {translations[lang]['Clubs Members']}
                                    </h5>
                                    <div className="row">
                                        <div className="col s12 m6 chart-table-container">
                                            <PercentagesCard
                                            category={translations[lang]['Clubs']} 
                                            dataOf={translations[lang]['Members']}
                                            percentOf={'Member'}
                                            percentages={collectMemberData(clubsLabels, clubsData, config.colors)}
                                            total={totalMembers}
                                            
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
                                        {translations[lang]['Members Gender']}
                                    </h5>
                                    <div className="row">
                                        <div className="col s12 m6">
                                            <PercentagesCard 
                                            category={translations[lang]['Gender']} 
                                            dataOf={translations[lang]['Members']}
                                            percentOf={'Member'}
                                            percentages={collectMemberData(genderLables, genderData, config.colors)}
                                            total={totalMembers}
                                            
                                            />
                                        </div>
                                        <div className="col s12 m6">
                                            <BarChart 
                                            title={''}
                                            labels={genderLables}
                                            data={genderData}
                                            color={'dodgerblue'}
                                            />
                                        </div>
                                    </div>
                                <div>

                                </div>
                            </div>
                            <div className="card-effect white my-container">
                                    <h5>
                                        {translations[lang]['Members Age']}
                                    </h5>
                                    <div className="row">
                                        <div className="col s12 m6 chart-table-container">
                                            <PercentagesCard 
                                            category={translations[lang]['Age']} 
                                            dataOf={translations[lang]['Members']}
                                            percentOf={'Member'}
                                            percentages={collectMemberData(ageLabels, ageData, config.colors)}
                                            total={totalMembers}
                                            
                                            />
                                        </div>
                                        <div className="col s12 m6">
                                            <BarChart 
                                            title={''}
                                            labels={ageLabels}
                                            data={ageData}
                                            color={'dodgerblue'}
                                            />
                                        </div>
                                    </div>
                                <div>

                                </div>
                            </div>

                            <div className="row">
                                <div className="col s12">
                                    <MembersTable data={members} isClub={true} />
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

export default ChainOwnersMembersPage