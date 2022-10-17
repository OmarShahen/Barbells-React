import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { DataArrayOutlined, DataArrayTwoTone, DataObjectOutlined } from '@mui/icons-material'
import { trimClubPayments } from '../../../utils/trimmers'
import toast, { Toaster } from 'react-hot-toast'
import PaymentIcon from '@mui/icons-material/Payment'
import translations from '../../../i18n'


const ChainOwnersClubsPaymentsTable = ({ data, totalPayments, isRefreshAdded, isLoading, reload, setReload }) => {

    const [clubPayments, setClubPayments] = useState(trimClubPayments(data))

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    
    const columns = () => {

            return [
                { title: translations[lang]['Payments'], field: '', render: rowData => {
                    return <div><PaymentIcon /></div>
                } },
                { title: translations[lang]['Branch'], field: 'club.clubCode', editable: 'never' },
                { title: translations[lang]['Received'], field: 'count' },
                //{ title: translations[lang]['Phone Code'], field: 'club.countryCode' },
                { title: translations[lang]['Description'], field: 'club.description' },
                //{ title: translations[lang]['Phone'], field: 'club.phone' },
                { title: translations[lang]['Country'], field: 'club.location.country' },
                { title: translations[lang]['City'], field: 'club.location.city' },
                //{ title: translations[lang]['Registration Date'], field: 'club.registrationDate' },
            ]
    }
    

    useEffect(() => {
        setClubPayments(trimClubPayments(data))
    }, [data])


    return (
        <div className="table-container">
            <MaterialTable 
                title={`Total: ${totalPayments}`}
                isLoading={isLoading}
                columns={columns()}
                data={clubPayments}
                icons={TableIcons}
                options={{ pageSize: 10, exportButton: true }}
                actions={[
                    isRefreshAdded ? 
                    {
                        icon: TableIcons.Refresh,
                        tooltip: translations[lang]['Refresh'],
                        isFreeAction: true,
                        onClick: e => setReload(reload + 1)
                    }
                    :
                    null
                ]}
            
            />
        </div>
    )

}

export default ChainOwnersClubsPaymentsTable