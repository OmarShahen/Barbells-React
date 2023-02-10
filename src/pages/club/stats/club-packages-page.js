import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import Card from '../../../components/cards/card'
import PackagesTable from '../../../components/tables/club/club-packages'
import BarChart from '../../../components/charts/bar-chart'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/floating-button'
import StatDatePicker from '../../../components/forms/stats-date-picker-form'
import { config } from '../../../config/config'
import { format } from 'date-fns'
import translations from '../../../i18n'
import { iconPicker } from '../../../utils/icon-finder'
import PercentagesCard from '../../../components/cards/percentages-card'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'
import PageHeader from '../../../components/sections/headers/page-header'
import { useSelector } from 'react-redux'





const ClubPackagesPage = ({ roles }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }
    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    const user = useSelector(state => state.user.user)
    const accessToken = localStorageSecured.get('access-token')

    const todayDate = new Date()
    const monthDate = new Date()
    monthDate.setDate(monthDate.getDate() - 30)
    todayDate.setDate(todayDate.getDate() + 1)

    const [statQuery, setStatQuery] = useState({ 
        from: format(monthDate, 'yyyy-MM-dd'), 
        to: format(todayDate, 'yyyy-MM-dd') 
    })

    const [authorized, setAuthorized] = useState(false)
    const [reload ,setReload] = useState(0)

    const [totalPackages, setTotalPackages] = useState(0)
    const [totalOpenedPackages, setTotalOpenedPackages] = useState(0)
    const [totalClosedPackages, setTotalClosedPackages] = useState(0)
    const [totalPackagesRegistrations, setTotalPackagesRegistrations] = useState(0)
    const [packages, setPackages] = useState([])


    const [packagesLabels, setPackagesLabels] = useState([])
    const [packagesData, setPackagesData] = useState([])


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
            serverRequest.get(`/v1/packages/clubs/${clubId}/stats`, {
                params: statQuery,
                headers
            })
            .then(response => {
    
                const data = response.data
    
                setTotalPackages(data.totalPackages)
                setTotalOpenedPackages(data.totalOpenedPackages)
                setTotalClosedPackages(data.totalClosedPackages)
                setPackages(data.packages)
    
                const packagesStats = data.packagesStats
                let packagesLabels = packagesStats.map(stat => stat._id)
                let packagesData = packagesStats.map(stat => stat.count)
    
                let totalPackagesRegistrations = 0
                packagesStats.forEach(stat => totalPackagesRegistrations += stat.count)
    
                setTotalPackagesRegistrations(totalPackagesRegistrations)
                setPackagesLabels(packagesLabels)
                setPackagesData(packagesData)
    
            })
            .catch(errorResponse => {
    
                throw errorResponse
            }),
            {
                loading: <strong>{translations[lang]['packages-loading']}</strong>,
                success: <strong>{translations[lang]['packages-success']}</strong>,
                error: <strong>{translations[lang]['packages-error']}</strong>
            },
            {
                position: 'top-right',
                duration: config.TOAST_SUCCESS_TIME
            }
        )

    }, [statQuery, reload])

    const collectPackagesData = (labels, data, colors) => {

        const allPackagesData = []
        for(let i=0;i<labels.length;i++) {
            allPackagesData.push({ label: labels[i], data: data[i], color: colors[i] })
        }

        allPackagesData.sort((package1, package2) => package2.data - package1.data)

        return allPackagesData
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
                        <NavBar pageName={translations[lang]["Packages Stats"]} statsQuery={statQuery} pageRoles={roles} />
                        <div className="page-main">
                        <PageHeader pageName={'Packages'} reload={reload} setReload={setReload} statsQuery={statQuery} />
                            <div className="row">
                                <div className="col s12 m4">
                                    <Card title={translations[lang]["Packages"]} number={totalPackages} icon={iconPicker('packages')} color={'dodgerblue'}/>
                                </div>
                                <div className="col s12 m4">
                                    <Card title={translations[lang]["Opened"]} number={totalOpenedPackages} icon={iconPicker('opened')} color={'dodgerblue'}/>
                                </div>
                                <div className="col s12 m4">
                                    <Card title={translations[lang]["Closed"]} number={totalClosedPackages} icon={iconPicker('closed')} color={'dodgerblue'}/>
                                </div>
                            </div>
                            
                            <div className="card-effect white my-container">
                                    <h5>
                                        {translations[lang]['Packages Registrations']}
                                    </h5>
                                    <div className="row">
                                        <div className="col s12 m6 chart-table-container">
                                            <PercentagesCard 
                                            category={translations[lang]['Packages']}
                                            dataOf={translations[lang]['Registrations']}
                                            percentOf={'Registration'}
                                            percentages={collectPackagesData(packagesLabels, packagesData, config.colors)}
                                            total={totalPackagesRegistrations}
                                            
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
                           
                            <div className="row">
                                <div className="col s12">
                                    <PackagesTable data={packages} />
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

export default ClubPackagesPage