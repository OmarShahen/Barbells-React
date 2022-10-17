import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import SideBar from '../../../components/navigation/club-admin-side-bar'
import Card from '../../../components/cards/card'
import MembersTable from '../../../components/tables/club/club-members'
import BarChart from '../../../components/charts/bar-chart'
import LineChart from '../../../components/charts/line-chart'
import PieChart from '../../../components/charts/pie-chart'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/floating-button'
import StatDatePicker from '../../../components/forms/stats-date-picker-form'
import ChartModal from '../../../components/modals/chart-modal'
import { config } from '../../../config/config'
import { format } from 'date-fns'
import translations from '../../../i18n'
import { iconPicker } from '../../../utils/icon-finder'
import CachedIcon from '@mui/icons-material/Cached'
import PercentagesCard from '../../../components/cards/percentages-card'


const ClubMembersPage = () => {

    const headers = { 'x-access-token': localStorage.getItem('access-token') }
    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')

    let todayDate = new Date()
    let monthDate = new Date(todayDate.setDate(todayDate.getDate() - 30))
    todayDate = new Date()

    const [statQuery, setStatQuery] = useState({
        from: format(monthDate, 'yyyy-MM-dd'), 
        to: format(todayDate, 'yyyy-MM-dd') 
    })

    const [reload, setReload] = useState(0)


    const [totalMembers, setTotalMembers] = useState(0)
    const [totalActiveMembers, setTotalActiveMembers] = useState(0)
    const [totalBlockedMembers, setTotalBlockedMembers] = useState(0)
    const [members, setMembers] = useState([])

    const [membersGenderPercentageStat, setMemberGenderPercentageStat] = useState({
        totalMembers: 0,
        totalMales: 0,
        totalFemales: 0,
        malePercentage: 0,
        femalePercentage: 0
    })


    const [growthLabels, setGrowthLabels] = useState([])
    const [growthData, setGrowthData] = useState([])

    const [genderLables, setGenderLabels] = useState([])
    const [genderData, setGenderData] = useState([])

    const [ageLabels, setAgeLabels] = useState([])
    const [ageData, setAgeData] = useState([])


    useEffect(() => {

        toast.promise(
            serverRequest.get(`/members/clubs/${clubId}/stats`, {
                params: statQuery,
                headers
            })
            .then(response => {
    
                const data = response.data
    
                setTotalMembers(data.totalMembers)
                setTotalActiveMembers(data.totalActiveMembers)
                setTotalBlockedMembers(data.totalBlockedMembers)
                setMembers(data.members)
    
                setMemberGenderPercentageStat(data.membersGenderPercentageStat)
    
                const growthStats = data.membersStatsGrowth
                let growthLabels = growthStats.map(stat => stat._id)
                let growthData = growthStats.map(stat => stat.count)
    
                const genderStats = data.membersGenderStats
                let genderLabels = genderStats.map(stat => translations[lang][stat._id])
                let genderData = genderStats.map(stat => stat.count)
    
                const ageStats = data.membersAgeStats
                let ageLabels = ageStats.map(stat => stat._id)
                let ageData = ageStats.map(stat => stat.count)
    
    
                setGrowthLabels(growthLabels)
                setGrowthData(growthData)
    
                setGenderLabels(genderLabels)
                setGenderData(genderData)
    
                setAgeLabels(ageLabels)
                setAgeData(ageData)
    
            })
            .catch(errorResponse => {
    
                throw errorResponse
            }),
            {
                loading: <strong>{translations[lang]['members-loading']}</strong>,
                success: <strong>{translations[lang]['members-success']}</strong>,
                error: <strong>{translations[lang]['members-error']}</strong>
            },
            {
                position: 'top-right',
                duration: config.TOAST_SUCCESS_TIME
            }

        )

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
                                    <h5 className="center">
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
                                    <MembersTable data={members} />
                                </div>
                            </div>
                        </div>
                        </div>                        
                    </div>
                </div>
            </div>
    )
}

export default ClubMembersPage