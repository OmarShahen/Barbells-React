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
import PaymentsDetaisTable from '../payments-details-table'



const ClubPaymentsTable = ({ data, statsQuery, isClub, totalPayments, currency, isRefreshAdded, isLoading, reload, setReload }) => {

    const [staffPayments, setStaffPayments] = useState(trimStaffPayments(data))

    const [filter, setFilter] = useState(false)

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]
    const club = JSON.parse(localStorage.getItem('club'))

    const lang = localStorage.getItem('lang')
    
    const columns = () => {

        if(isClub) {

            return [
                { title: translations[lang]['payments'], field: '', render: rowData => {
                    return <div className="center"><PaymentIcon color="primary" /></div>
                } },
                { title: translations[lang]['Received'], field: 'count', render: rowData => <span>{`${rowData.count} EGP`}</span> },
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
                { title: translations[lang]['payments'], field: '', render: rowData => {
                    return <div className="center"><PaymentIcon color="primary" /></div>
                } },
                { title: translations[lang]['Received'], field: 'count', render: rowData => <span>{`${rowData.count} EGP`}</span> },
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
                title={<div><strong>{totalPayments}</strong> <span>{currency}</span></div>}
                isLoading={isLoading}
                columns={columns()}
                data={staffPayments}
                icons={TableIcons}
                options={{ 
                    pageSize: 15, 
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: staffPayments.length }],
                    actionsColumnIndex: -1,
                    exportButton: {
                        pdf: false,
                        csv: true
                    }, 
                    exportFileName: translations[lang]['Payments'],
                    grouping: true,
                    filtering: filter
                }}
                actions={[
                    {
                        icon: TableIcons.Filter,
                        tooltip: translations[lang]['Filter'],
                        isFreeAction: true,
                        onClick: e => setFilter(filter ? false: true)
                    },
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

                detailPanel={rowData => { return <div style={{ display: 'flex', justifyContent: 'center'}}>                    
                    <PaymentsDetaisTable staffId={rowData._id} statsQuery={statsQuery} currency={'EGP'} />
                </div>}}

                localization={ lang === 'ar' ? {
                    body: {
                        emptyDataSourceMessage: 'لا يوجد سجلات',
                        editRow: {
                            deleteText: 'هل انت متاكد من المسح',
                            cancelTooltip: 'الغاء',
                            saveTooltip: 'احفظ'
                        },

                        editTooltip: 'تعديل',
                        deleteTooltip: 'مسح'
                    },
                    grouping: {
                        placeholder: 'اسحب العناوين هنا للتجميع',
                        groupedBy: 'مجموعة من'
                    },
                    header: {
                        actions: ''
                    },
                    toolbar: {
                        exportTitle: 'تحميل',
                        exportAriaLabel: 'تحميل',
                        searchTooltip: 'بحث',
                        searchPlaceholder: 'بحث',
                        exportCSVName: 'تحميل البينات'
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