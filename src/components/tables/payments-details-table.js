import React, { useState, useEffect } from 'react'
import { trimPaymentsDetails } from '../../utils/trimmers'
import { serverRequest } from '../../API/request'
import toast from 'react-hot-toast'
import translations from '../../i18n'
import { config } from '../../config/config'
import CircularLoadingButton from '../buttons/loading-button'

const PaymentsDetaisTable = ({ staffId, statsQuery, currency }) => {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const lang = localStorage.getItem('lang')

    useEffect(() => {

        serverRequest.get(`/registrations/staffs/${staffId}`, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setData(trimPaymentsDetails(response.data.registrations))
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
                    <th>Member</th>
                    <th>Paid</th>
                    <th>Membership</th>
                    <th>Package</th>
                    <th>Payment Time</th>
                    <th>Payment Date</th>
                </tr>
            </thead>
            <tbody>
                {data.map(row => <tr>
                    <td>{row.member.name}</td>
                    <td>{`${row.paid} ${currency}`}</td>
                    <td>{row.member.membership}</td>
                    <td>{row.package.title}</td>
                    <td>{row.registrationTime}</td>
                    <td>{row.registrationDate}</td>
                </tr>)}
            </tbody>
      </table>
        }
        </>
    )
}

export default PaymentsDetaisTable