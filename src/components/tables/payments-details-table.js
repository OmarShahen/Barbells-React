import React, { useState, useEffect } from 'react'
import { trimPayments } from '../../utils/trimmers'
import { serverRequest } from '../../API/request'
import toast from 'react-hot-toast'
import translations from '../../i18n'
import { config } from '../../config/config'
import CircularLoadingButton from '../buttons/loading-button'
import { localStorageSecured } from '../../security/localStorage'
import { formateMoney } from '../../utils/money'

const PaymentsDetaisTable = ({ staffId, statsQuery, currency }) => {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const lang = localStorage.getItem('lang')

    useEffect(() => {

        serverRequest.get(`/v1/staffs/${staffId}/all-payments`, { 
            params: statsQuery,
            headers: {
                'x-access-token': localStorageSecured.get('access-token')
            }
        })
        .then(response => {
            setIsLoading(false)
            setData(trimPayments(response.data.payments))
        })
        .catch(error => {
            setIsLoading(false)
            toast.error(translations[lang]['user-error'], { position: 'top-right', duration: config.TOAST_ERROR_TIME })
        })
    }, [])

    return (
        <>
        {
            isLoading ?
            <div style={{ padding: '2rem 0', display: 'flex', justifyContent: 'center' }}>
                    <CircularLoadingButton />
            </div>
            :
            <table className="highlight centered">
            <thead>
                <tr>
                    <th>{translations[lang]['Category']}</th>
                    <th>{translations[lang]['Paid']}</th>
                    <th>{translations[lang]['Payment Time']}</th>
                    <th>{translations[lang]['Payment Date']}</th>
                </tr>
            </thead>
            <tbody>
                {data.map(row => <tr>
                    <td>{translations[lang][row.category]}</td>
                    <td>{formateMoney(row.total, lang)}</td>
                    <td>{row.paymentTime}</td>
                    <td>{row.registrationDate}</td>
                </tr>)}
            </tbody>
      </table>
        }
        </>
    )
}

export default PaymentsDetaisTable