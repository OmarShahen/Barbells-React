import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import Card from '../../../components/cards/card'
import LineChart from '../../../components/charts/line-chart'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/floating-button'
import StatDatePicker from '../../../components/forms/stats-date-picker-form'
import ChartModal from '../../../components/modals/chart-modal'
import { config } from '../../../config/config'
import { format } from 'date-fns'
import translations from '../../../i18n/index'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import ClubInventoryTable from '../../../components/tables/club/club-inventory'
import DropdownSuppliersTable from '../../../components/tables/club/dropdown/suppliers'
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined'
import MoneyOffCsredOutlinedIcon from '@mui/icons-material/MoneyOffCsredOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import PageHeader from '../../../components/sections/headers/page-header'
import { useSelector } from 'react-redux'



const ClubItemPage = ({ roles }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }
    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]
    const itemId = pagePath.split('/')[5]

    const lang = localStorage.getItem('lang')

    const user = useSelector(state => state.user.user)
    const accessToken = localStorageSecured.get('access-token')

    const [authorized, setAuthorized] = useState(false)
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    
    const todayDate = new Date()
    const monthDate = new Date()
    monthDate.setDate(monthDate.getDate() - 30)
    todayDate.setDate(todayDate.getDate() + 1)

    const [statsQuery, setStatsQuery] = useState({ 
        from: format(monthDate, 'yyyy-MM-dd'), 
        to: format(todayDate, 'yyyy-MM-dd') 
    })

    const [item, setItem] = useState({})
    const [inStock, setInStock] = useState(0)
    const [totalEarnings, setTotalEarnings] = useState(0)
    const [totalDeductions, setTotalDeductions] = useState(0)
    const [netProfit, setNetProfit] = useState(0)
    const [totalAmountSold, setTotalAmountSold] = useState(0)
    const [totalAmountReceived, setTotalAmountReceived] = useState(0)
    const [payments, setPayments] = useState([])
    const [suppliers, setSuppliers] = useState([])

    const [growthLabels, setGrowthLabels] = useState([])
    const [growthData, setGrowthData] = useState([])


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
            serverRequest.get(`/v1/items/${itemId}/stats`, {
                params: statsQuery,
                headers
            })
            .then(response => {
                setIsLoading(false)
    
                const data = response.data
    
                setItem(data.item)
                setInStock(data.inStock)
                setTotalEarnings(data.totalEarningsMoney)
                setTotalDeductions(data.totalDeductionsMoney)
                setNetProfit(data.netProfit)
                setTotalAmountSold(data.totalAmountSold)
                setTotalAmountReceived(data.totalAmountReceived)
                setPayments(data.payments)
                setSuppliers(data.suppliers)
    
                const growthStats = data.itemAmountSalesGrowthStats
                
                let growthLabels = growthStats.map(stat => stat._id)
                let growthData = growthStats.map(stat => stat.count)
    
                setGrowthLabels(growthLabels)
                setGrowthData(growthData)
    
            })
            .catch(errorResponse => {
                setIsLoading(false)  
                throw errorResponse
            }),
            {
                loading: <strong>{translations[lang]['dashboard-loading']}</strong>,
                success: <strong>{translations[lang]['dashboard-success']}</strong>,
                error: <strong>{translations[lang]['dashboard-error']}</strong>
            },
            {
                position: 'top-right',
                duration: config.TOAST_SUCCESS_TIME
            }
        )
        

    }, [statsQuery, reload])

    return (
        <>
        { authorized
        &&
        <div className="blue-grey lighten-5">
            <Toaster />
            <StatDatePicker setStatQuery={setStatsQuery} loading={isLoading} />
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar pageName={translations[lang]['Item Stats']} statsQuery={statsQuery} />
                        <div className="page-main">
                            <PageHeader pageName={'Items'} reload={reload} setReload={setReload} statsQuery={statsQuery} />

                                <div className="row">
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]['In Stock']} icon={<Inventory2OutlinedIcon />} number={inStock} color={config.color.blue} />
                                    </div> 
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]['Amount Sold']} icon={<LogoutIcon />} number={totalAmountSold} color={config.color.cyan} />
                                    </div>
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]['Amount Received']} icon={<LoginIcon />} number={totalAmountReceived} color={config.color.purple} />
                                    </div>
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]['Net Profit']} icon={<PaidOutlinedIcon />} isMoney={true} currency={lang} number={netProfit} color={config.color.cyan} />
                                    </div>
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]['Sold']} icon={<AttachMoneyOutlinedIcon />} currency={lang} isMoney={true}  number={totalEarnings} color={config.color.cyan} />
                                    </div>
                                    <div className="col s12 m4">
                                        <Card title={translations[lang]['Deductions']} icon={<MoneyOffCsredOutlinedIcon />} isMoney={true} currency={lang} number={totalDeductions} color={config.color.cyan} />
                                    </div>
                                </div>
                                <div className="row">
                                <div className="col s12 m7">
                                    <div className="white my-container-padding card-effect">
                                        <h5 className="left">
                                        {translations[lang]['Sales Growth']}
                                        </h5>
                                        <div className="row">
                                            <div className="col s12">
                                            <a className="modal-trigger" href="#month-line-chart-modal">
                                                <LineChart title={translations[lang]['Sales Growth']} labels={growthLabels} data={growthData} color={'dodgerblue'} />
                                            </a>
                                            <ChartModal id="month-line-chart-modal">
                                                <LineChart 
                                                title={translations[lang]['Sales Growth']}
                                                labels={growthLabels} 
                                                data={growthData} 
                                                color={'dodgerblue'} 
                                                />
                                            </ChartModal>
                                            </div>
                                        </div>
                                </div>
                                </div>
                                <div className="col s12 m5">
                                    <div className="white mini-table-container">
                                        <h5>{translations[lang]['Suppliers']}</h5>
                                        <div className="mini-table">
                                        <DropdownSuppliersTable suppliers={suppliers} />
                                        </div>
                                    </div>
                                </div>
                                </div>
                            <div className="row">
                                <div className="col s12">
                                <ClubInventoryTable
                                data={payments} 
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

export default ClubItemPage