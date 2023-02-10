import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import Card from '../../../components/cards/card'
import BarChart from '../../../components/charts/bar-chart'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/floating-button'
import StatDatePicker from '../../../components/forms/stats-date-picker-form'
import { config } from '../../../config/config'
import { format } from 'date-fns'
import translations from '../../../i18n'
import PercentagesCard from '../../../components/cards/percentages-card'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'
import ClubPaymentsTable from '../../../components/tables/club/club-payments'
import PaymentIcon from '@mui/icons-material/Payment'
import ReceiptIcon from '@mui/icons-material/Receipt'
import CallSplitIcon from '@mui/icons-material/CallSplit'
import PageHeader from '../../../components/sections/headers/page-header'
import { useSelector } from 'react-redux'




const ClubPaymentsCategoryPage = ({ roles }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }
    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]
    const category = pagePath.split('/')[5]

    const lang = localStorage.getItem('lang')
    const user = useSelector(state => state.user.user)
    const accessToken = localStorageSecured.get('access-token')

    const todayDate = new Date()
    const monthDate = new Date()
    monthDate.setDate(monthDate.getDate() - 30)
    todayDate.setDate(todayDate.getDate() + 1)

    const [statsQuery, setStatsQuery] = useState({ 
        from: format(monthDate, 'yyyy-MM-dd'), 
        to: format(todayDate, 'yyyy-MM-dd') 
    })

    const [authorized, setAuthorized] = useState(false)
    const [reload ,setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const [totalPayments, setTotalPayments] = useState(0)
    const [totalOperations, setTotalOperations] = useState(0)
    const [totalWays, setTotalWays] = useState(0)
    const [totalEarnings, setTotalEarnings] = useState(0)
    const [totalDeductions, setTotalDeductions] = useState(0)
    const [netProfit, setNetProfit] = useState(0)
    const [earningsPayments, setEarningsPayments] = useState([])
    const [deductionPayments, setDeductionPayments] = useState([])
    const [payments, setPayments] = useState([])


    const [deductionsLabels, setDeductionsLabels] = useState([])
    const [deductionsData, setDeductionsData] = useState([])

    const [earningsLabels, setEarningsLabels] = useState([])
    const [earningsData, setEarningsData] = useState([])


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
            serverRequest.get(`/v1/payments/clubs/${clubId}/categories/${category}`, {
                params: statsQuery,
                headers
            })
            .then(response => {

                setIsLoading(false)
    
                const data = response.data
    
                setTotalWays(data.totalWays)
                setTotalOperations(data.totalOperations)
                setTotalPayments(data.totalPayments)
                setTotalEarnings(data.totalEarnings ? data.totalEarnings : 0)
                setTotalDeductions(data.totalDeductions ? data.totalDeductions : 0)
                setNetProfit(data.netProfit ? data.netProfit : 0)
                setPayments(data.payments)
                setDeductionPayments(data.payments.filter(payment => payment.type === 'DEDUCT'))
                setEarningsPayments(data.payments.filter(payment => payment.type === 'EARN'))

                setDeductionsLabels(data.deductionsStats.map(stat => stat._id))
                setDeductionsData(data.deductionsStats.map(stat => stat.count))

                if(category === 'inventory') {
                    setEarningsLabels(data.earningsStats.map(stat => stat._id))
                    setEarningsData(data.earningsStats.map(stat => stat.count))
                }
    
            })
            .catch(errorResponse => {
                
                setIsLoading(false)
                console.log(errorResponse)
                throw errorResponse
            }),
            {
                loading: <strong>{translations[lang]['payments-loading']}</strong>,
                success: <strong>{translations[lang]['payments-success']}</strong>,
                error: <strong>{translations[lang]['payments-error']}</strong>
            },
            {
                position: 'top-right',
                duration: config.TOAST_SUCCESS_TIME
            }
        )

    }, [statsQuery, reload, category])

    const collectPackagesData = (labels, data, colors) => {

        const allPackagesData = []
        for(let i=0;i<labels.length;i++) {
            allPackagesData.push({ label: labels[i], data: data[i], color: colors[i] })
        }

        allPackagesData.sort((package1, package2) => package2.data - package1.data)

        return allPackagesData
    }

    const getPageName = (category) => {

        if(category === 'inventory') {
            return 'Inventory'
        } else if(category === 'payroll') {
            return 'Payrolls'
        } else if(category === 'maintenance') {
            return 'Maintenance'
        } else if(category === 'bill') {
            return 'Bills'
        }
    }



    return (
        <>
        {
            authorized
            &&
            <div className="blue-grey lighten-5">
            <Toaster />
            <StatDatePicker setStatQuery={setStatsQuery} />
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar pageName={translations[lang][`${category} stats`]} statsQuery={statsQuery} pageRoles={roles} />
                        <div className="page-main">
                        <PageHeader pageName={getPageName(category)} reload={reload} setReload={setReload} statsQuery={statsQuery} />
                            <div className="row">
                                <div className="col s12 m4">
                                    <Card 
                                    title={translations[lang]['Payments']} 
                                    number={totalPayments} 
                                    icon={<PaymentIcon />} 
                                    color={'dodgerblue'}
                                    isMoney={true}
                                    currency={lang}
                                    />
                                </div> 
                                <div className="col s12 m4">
                                    <Card title={category === 'bill' ? translations[lang]['Bills Types'] : translations[lang]['Maintenance Types']} number={totalWays} icon={<CallSplitIcon />} color={'dodgerblue'}/>
                                </div>
                                <div className="col s12 m4">
                                    <Card title={translations[lang]['Operation']} number={totalOperations} icon={<ReceiptIcon />} color={'dodgerblue'}/>
                                </div>
                                {
                                    category === 'inventory' ? <div className="col s12 m4">
                                    <Card 
                                    title={translations[lang]['Earnings']} 
                                    number={totalEarnings} 
                                    icon={<ReceiptIcon />} 
                                    color={'dodgerblue'}
                                    isMoney={true}
                                    currency={lang}
                                    />
                                </div> : null
                                }
                                {
                                    category === 'inventory' ? <div className="col s12 m4">
                                    <Card 
                                    title={translations[lang]['Deductions']} 
                                    number={totalDeductions} 
                                    icon={<ReceiptIcon />} 
                                    color={'dodgerblue'}
                                    isMoney={true}
                                    currency={lang}
                                    />
                                </div> : null
                                }
                            </div>
                            <div className="card-effect white my-container">
                                    <h5>
                                        {translations[lang]['Deductions Distribution']}
                                    </h5>
                                    <div className="row">
                                        <div className="col s12 m6 chart-table-container">
                                            <PercentagesCard 
                                            category={translations[lang]['Description']}
                                            dataOf={translations[lang]['Total Payment']}
                                            percentages={collectPackagesData(deductionsLabels, deductionsData, config.colors)}
                                            total={category === 'inventory' ? totalDeductions : totalPayments}
                                            
                                            />
                                        </div>
                                        <div className="col s12 m6">
                                            <BarChart 
                                            title={''}
                                            labels={deductionsLabels}
                                            data={deductionsData}
                                            color={'dodgerblue'}
                                            />
                                        </div>
                                    </div>
                            </div>
                            {
                                category === 'inventory' ?
                                <div className="card-effect white my-container">
                                    <h5>
                                        {translations[lang]['Earnings Distribution']}
                                    </h5>
                                    <div className="row">
                                        <div className="col s12 m6 chart-table-container">
                                            <PercentagesCard 
                                            category={translations[lang]['Description']}
                                            dataOf={translations[lang]['Total Payment']}
                                            percentages={collectPackagesData(earningsLabels, earningsData, config.colors)}
                                            total={category === 'inventory' ? totalEarnings : totalPayments}
                                            
                                            />
                                        </div>
                                        <div className="col s12 m6">
                                            <BarChart 
                                            title={''}
                                            labels={earningsLabels}
                                            data={earningsData}
                                            color={'dodgerblue'}
                                            />
                                        </div>
                                    </div>
                            </div>
                            :
                            null
                            }
                            <div className="row">
                                <div className="col s12">
                                <ClubPaymentsTable 
                                    data={payments} 
                                    category={category}
                                    deductionPayments={deductionPayments}
                                    earningsPayments={earningsPayments}
                                    statsQuery={statsQuery}
                                    currency={translations[lang]['EGP']}
                                    isRegistrationAdded={true}
                                    reload={reload}
                                    setReload={setReload}
                                    isLoading={isLoading} 
                                    isRefreshAdded={true}
                                    />
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

export default ClubPaymentsCategoryPage