import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { serverRequest } from '../../../API/request'
import { format } from 'date-fns'
import { DataArrayOutlined, DataArrayTwoTone, DataObjectOutlined } from '@mui/icons-material'
import { trimStaffPayments } from '../../../utils/trimmers'
import toast, { Toaster } from 'react-hot-toast'
import { TrendingUpRounded } from '@material-ui/icons'
import PaymentIcon from '@mui/icons-material/Payment'
import RegistrationTable from './club-registrations'
import translations from '../../../i18n'



const ClubPaymentsTable = ({ data, isClub, totalPayments, isRefreshAdded, isLoading, reload, setReload }) => {

    const [staffPayments, setStaffPayments] = useState(trimStaffPayments(data))

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]
    const club = JSON.parse(localStorage.getItem('club'))

    const lang = localStorage.getItem('lang')
    
    const columns = () => {

        if(isClub) {

            return [
                { title: '', field: '', render: rowData => {
                    return <div className="center"><PaymentIcon color="primary" /></div>
                } },
                { title: translations[lang]['Received'], field: 'count' },
                { title: translations[lang]['Name'], field: 'staff.name' },
                { title: translations[lang]['Phone Code'], field: 'staff.countryCode', render: rowData => <div className="">{rowData.staff.countryCode}</div> },
                { title: translations[lang]['Phone'], field: 'staff.phone' },
                { title: translations[lang]['Mail'], field: 'staff.email' },
                { title: translations[lang]['Branch'], field: 'club.clubCode' },
                { title: translations[lang]['Role'], field: 'staff.role', editable: 'never' },
                //{ title: 'Registration Date', field: 'staff.registrationDate', editable: 'never' },
        
            ]

        } else {

            return [
                { title: '', field: '', render: rowData => {
                    return <div className="center"><PaymentIcon color="primary" /></div>
                } },
                { title: translations[lang]['Received'], field: 'count' },
                { title: translations[lang]['Name'], field: 'staff.name' },
                { title: translations[lang]['Phone Code'], field: 'staff.countryCode', render: rowData => <div className="">{rowData.staff.countryCode}</div> },
                { title: translations[lang]['Phone'], field: 'staff.phone' },
                { title: translations[lang]['Mail'], field: 'staff.email' },
                { title: translations[lang]['Role'], field: 'staff.role', editable: 'never' },
                //{ title: 'Registration Date', field: 'staff.registrationDate', editable: 'never' },
        
            ]
        }
    }
    

    useEffect(() => {
        setStaffPayments(trimStaffPayments(data))
    }, [data])


    return (
        <div className="table-container">
            <MaterialTable 
                title={`${totalPayments} ${club.currency}`}
                isLoading={isLoading}
                columns={columns()}
                data={staffPayments}
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

                localization={ lang === 'ar' ? {
                    body: {
                        emptyDataSourceMessage: 'لا يوجد سجلات',
                        
                    },
                    editRow: {
                        deleteText: 'مسح',
                        cancelTooltip: 'الغاء'
                    },
                    header: {
                        actions: ''
                    },
                    toolbar: {
                        exportTitle: 'تنزيل',
                        exportAriaLabel: 'تنزيل',
                        searchTooltip: 'بحث',
                        searchPlaceholder: 'بحث'
                    },
                    pagination: {
                        labelRowsSelect: 'سجلات',
                        labelRowsPerPage: 'سجل للصفحة',
                        firstAriaLabel: 'الصفحة الاولة',
                        firstTooltip: 'الصفحة الاولة',
                        previousAriaLabel: 'الصفحة السابقة',
                        previousTooltip: 'الصفحة السابقة',
                        nextAriaLabel: 'الصفحة التالية',
                        nextTooltip: 'الصفحة التالية',
                        lastAriaLabel: 'الصفحة الاخيرة',
                        lastTooltip: 'الصفحة الاخيرة',
                    }

                }
                 : {}
                }
            
            />
        </div>
    )

}

export default ClubPaymentsTable