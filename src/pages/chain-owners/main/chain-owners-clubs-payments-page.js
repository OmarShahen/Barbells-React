import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/chain-owner-nav-bar'
import SideBar from '../../../components/navigation/chain-owner-side-bar'
import ChainOwnersClubsPaymentsTable from '../../../components/tables/chain-owner/chain-owner-clubs-payments-table'
import { serverRequest } from '../../../API/request'
import { format } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/floating-button'
import translations from '../../../i18n'
import { config } from '../../../config/config'
import StatDatePicker from '../../../components/forms/stats-date-picker-form'
import FloatingFormsButton from '../../../components/buttons/forms-floating-button'

const MainChainOwnersClubsPaymentsPage = () => {

    const pagePath = window.location.pathname
    const ownerId = pagePath.split('/')[3]
    const lang = localStorage.getItem('lang')

    const todayDate = new Date()

    const [statQuery, setStatQuery] = useState({ until: format(todayDate, 'yyyy-MM-dd') })

    const [clubPayments, setClubPayments] = useState([])
    const [totalPayments, setTotalPayments] = useState([])
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])
      

    useEffect(() => {

        setIsLoading(true)

        serverRequest.get(`/registrations/chain-owners/${ownerId}/payments`, {
            headers: {
                'x-access-token': localStorage.getItem('access-token')
            },
            params: statQuery
        })
        .then(response => {

            setIsLoading(false)

            const clubPayments = response.data.payments

            setTotalPayments(response.data.totalEarnings)
            setClubPayments(clubPayments)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(translations[lang]['user-error'], { position: 'top-right', duration: config.TOAST_ERROR_TIME })

        })


    }, [statQuery, reload])

    return (
        <div className="blue-grey lighten-5">
            <SideBar />
            <Toaster />
            <FloatingFormButton />
            <StatDatePicker setStatQuery={setStatQuery} />
            <div className="row page">
                <div className="col s12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <NavBar pageName={translations[lang]["Payments"]} statsQuery={statQuery} />
                    <div className="page-main">
                        <ChainOwnersClubsPaymentsTable 
                        data={clubPayments} 
                        currency={'EGP'}
                        totalPayments={totalPayments}
                        reload={reload}
                        setReload={setReload}
                        isLoading={isLoading} 
                        isRefreshAdded={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainChainOwnersClubsPaymentsPage