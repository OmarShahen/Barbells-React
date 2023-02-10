import React, { useState, useEffect } from 'react'
import ClubAdminNavbar from '../../../components/navigation/nav-bar'
import ChainOwnerNavbar from '../../../components/navigation/chain-owner-nav-bar'
import ChainOwnerSideBar from '../../../components/navigation/chain-owner-side-bar'
import Card from '../../../components/cards/card'
import ClubRegistrationsTable from '../../../components/tables/club/club-registrations'
import LineChart from '../../../components/charts/line-chart'
import BarChart from '../../../components/charts/bar-chart'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/floating-button'
import StatDatePicker from '../../../components/forms/stats-date-picker-form'
import ChartModal from '../../../components/modals/chart-modal'
import { config } from '../../../config/config'
import { format } from 'date-fns'
import translations from '../../../i18n'
import { iconPicker } from '../../../utils/icon-finder'
import PercentagesCard from '../../../components/cards/percentages-card'
import BasicStatTable from '../../../components/tables/basic-stat'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'
import PageHeader from '../../../components/sections/headers/page-header'
import { useSelector } from 'react-redux'



const ClubPackagePage = ({ roles }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }
    const pagePath = window.location.pathname
    const packageId = pagePath.split('/')[5]
    const user = useSelector(state => state.user.user)
    const accessToken = localStorageSecured.get('access-token')

    const lang = localStorage.getItem('lang')

    const todayDate = new Date()
    const monthDate = new Date()
    monthDate.setDate(monthDate.getDate() - 30)
    todayDate.setDate(todayDate.getDate() + 1)

    const [statQuery, setStatQuery] = useState({ 
        from: format(monthDate, 'yyyy-MM-dd'), 
        to: format(todayDate, 'yyyy-MM-dd') 
    })

    const [authorized, setAuthorized] = useState(false)
    const [reload, setReload] = useState(0)

    const [clubPackage, setClubPackage] = useState({ title: '' })

    const [totalPackageRegistrations, setTotalPackageRegistrations] = useState(0)
    const [totalActiveRegistrations, setTotalActiveRegistrations] = useState(0)
    const [totalExpiredRegistrations, setTotalExpiredRegistrations] = useState(0)

    const [packageRegistrations, setPackageRegistrations] = useState([])

    const [completedPackageAttendancePercentage, setCompletedPackageAttendancePercentage] = useState(0)
    const [incompletedPackageAttendancePercentage, setIncompletedPackageAttendancePercentage] = useState(0)
    const [completedPackageAttendance, setCompletedPackageAttendance] = useState(0)
    const [incompletedPackageAttendance, setIncompletedPackageAttendance] = useState(0)

    const [totalRegistrations, setTotalRegistrations] = useState(0)
    const [totalMembers, setTotalMembers] = useState(0)

    const [packagesLabels, setPackagesLabels] = useState([])
    const [packagesData, setPackagesData] = useState([])

    const [ageLabels, setAgeLabels] = useState([])
    const [ageData, setAgeData] = useState([])

    const [genderLabels, setGenderLabels] = useState([])
    const [genderData, setGenderData] = useState([])

    const [packageGrowthLabels, setPackageGrowthLabels] = useState([])
    const [packageGrowthData, setPackageGrowthData] = useState([])

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
            serverRequest.get(`/v1/packages/${packageId}/stats`, {
                params: statQuery,
                headers
            })
            .then(response => {
    
                const data = response.data
    
                setClubPackage(data.package)
    
                setTotalPackageRegistrations(data.totalPackageRegistrations)
                setTotalActiveRegistrations(data.totalActiveRegistrations)
                setTotalExpiredRegistrations(data.totalExpiredRegistrations)
                setPackageRegistrations(data.packageRegistrations)
    
                setCompletedPackageAttendancePercentage(data.packageCompletionStat.completedPackageAttendancePercentage)
                setIncompletedPackageAttendancePercentage(data.packageCompletionStat.incompletedPackageAttendancePercentage)
                setCompletedPackageAttendance(data.packageCompletionStat.completedPackageAttendance)
                setIncompletedPackageAttendance(data.packageCompletionStat.incompletedPackageAttendance)
    
                const packageStats = data.packageStats
                
                let packagesLabels = [data.package.title, translations[lang]['other packages']]
                let packagesData = [packageStats.packageTotal, packageStats.othersTotal]            

                let totalRegistrations = 0
                packagesData.map(registration => totalRegistrations += registration)

                setTotalRegistrations(totalRegistrations)
    
                setPackagesLabels(packagesLabels)
                setPackagesData(packagesData)
    
                let ageStats = data.packageAgeStats
                let ageLabels = ageStats.map(stat => stat._id || 0)
                let ageData = ageStats.map(stat => stat.count)
    
                setAgeLabels(ageLabels)
                setAgeData(ageData)
    
                let genderStats = data.packageGenderStats
                let genderLabels = genderStats.map(stat => translations[lang][stat._id])
                let genderData = genderStats.map(stat => stat.count)

                let totalMembers = 0
                genderData.map(member => totalMembers += member)

                setTotalMembers(totalMembers)
    
                setGenderLabels(genderLabels)
                setGenderData(genderData)
    
                let growthStats = data.packageRegistrationsStatsGrowth
                let growthLabels = growthStats.map(stat => stat._id)
                let growthData = growthStats.map(stat => stat.count)
    
    
                setPackageGrowthLabels(growthLabels)
                setPackageGrowthData(growthData)
    
            })
            .catch(errorResponse => {
                throw errorResponse
            }),
            {
                loading: <strong>{translations[lang]['package-loading']}</strong>,
                success: <strong>{translations[lang]['package-success']}</strong>,
                error: <strong>{translations[lang]['package-error']}</strong>
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
        <>
        {
            authorized
            &&
            <div className="blue-grey lighten-5">
            <Toaster />
            <StatDatePicker setStatQuery={setStatQuery} />
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    { user.role === 'OWNER' ? 
                        <ChainOwnerNavbar pageName={translations[lang]["Package Stats"]} statsQuery={statQuery} />
                        :
                        <ClubAdminNavbar pageName={translations[lang]["Package Stats"]} statsQuery={statQuery} />
                    }
                        <div className="page-main">
                        <PageHeader pageName={clubPackage.title} reload={reload} setReload={setReload} statsQuery={statQuery} />
                                <div className="row">
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]["Registrations"]} icon={iconPicker('registrations')} number={totalPackageRegistrations} color={'dodgerblue'}/>
                                    </div>
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]["Active"]} icon={iconPicker('active')} number={totalActiveRegistrations} color={'#00e676'}/>
                                    </div>
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]["Expired"]} icon={iconPicker('expired')} number={totalExpiredRegistrations} color={'#aa00ff'}/>
                                    </div>
                                </div>
                            <div className="white my-container card-effect">
                                    <h5>
                                        {translations[lang]['Package Registrations Growth']}
                                    </h5>
                                    <a className="modal-trigger" href="#month-line-chart-modal">
                                            <LineChart title={translations[lang]['Package Registrations Growth']} labels={packageGrowthLabels} data={packageGrowthData} color={'dodgerblue'} />
                                        </a>
                                        <ChartModal id="month-line-chart-modal">
                                            <LineChart 
                                            title={translations[lang]['Package Registrations Growth']} 
                                            labels={packageGrowthLabels} 
                                            data={packageGrowthData} 
                                            color={'dodgerblue'} 
                                            />
                                        </ChartModal>
                            </div>

                            <div className="card-effect white my-container">
                                    <h5>
                                        {translations[lang]['Package Registrations']}
                                    </h5>
                                    <div className="row">
                                        <div className="col s12 m6">
                                            <PercentagesCard 
                                            category={translations[lang]['Packages']} 
                                            dataOf={translations[lang]['Registrations']}
                                            percentOf={'Registration'}
                                            percentages={collectMemberData(packagesLabels, packagesData, config.colors)}
                                            total={totalRegistrations}
                                            
                                            />
                                        </div>
                                        <div className="col s12 m6">
                                            <BarChart 
                                            title={''}
                                            labels={packagesLabels}
                                            data={packagesData}
                                            color={'dodgerblue'}
                                            />
                                        </div>
                                    </div>
                                <div>

                                </div>
                            </div>
                            <div className="white card-effect my-container">
                                <h5>
                                    {translations[lang]['Package Registrations Completion']}
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
                                                number: completedPackageAttendance,
                                                percentage: completedPackageAttendancePercentage 
                                            },
                                            {
                                                title: translations[lang]['Incomplete'],
                                                number: incompletedPackageAttendance,
                                                percentage: incompletedPackageAttendancePercentage
                                            }
                                        ]}
                                        />
                                    </div>
                                    <div className="col s12 m6">
                                        <BarChart 
                                        labels={[
                                            translations[lang]['Complete'], 
                                            translations[lang]['Incomplete']
                                        ]}
                                        data={[completedPackageAttendance, incompletedPackageAttendance]}
                                        color={'dodgerblue'}
                                        />
                                    </div>
                                </div>
                                
                            </div>
                            <div className="card-effect white my-container">
                                    <h5>
                                        {translations[lang]['Package Member Gender']}
                                    </h5>
                                    <div className="row">
                                        <div className="col s12 m6">
                                            <PercentagesCard 
                                            category={translations[lang]['Packages']} 
                                            dataOf={translations[lang]['Members']}
                                            percentOf={'Member'}
                                            percentages={collectMemberData(genderLabels, genderData, config.colors)}
                                            total={totalMembers}
                                            
                                            />
                                        </div>
                                        <div className="col s12 m6">
                                            <BarChart 
                                            title={''}
                                            labels={genderLabels}
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
                                        {translations[lang]['Package Members Age']}
                                    </h5>
                                    <div className="row">
                                        <div className="col s12 m6">
                                            <PercentagesCard 
                                            category={translations[lang]['Ages']} 
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
                                    <ClubRegistrationsTable data={packageRegistrations} /> 
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

export default ClubPackagePage