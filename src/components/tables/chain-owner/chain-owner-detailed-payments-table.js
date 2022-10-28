import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { serverRequest } from '../../../API/request'
import { trimStaffPayments } from '../../../utils/trimmers'
import PaymentIcon from '@mui/icons-material/Payment'
import translations from '../../../i18n'
import PaymentsDetaisTable from '../payments-details-table'
import toast from 'react-hot-toast'
import { localStorageSecured } from '../../../security/localStorage'


const DetailedPayments = ({ clubId, statsQuery, currency='EGP' }) => {

    const [staffPayments, setStaffPayments] = useState([])
    const [totalPayments, setTotalPayments] = useState(0)
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState(false)

    const lang = localStorage.getItem('lang')

    useEffect(() => {
        
        setIsLoading(true)

        serverRequest.get(`/registrations/clubs/${clubId}/staffs/payments`, { 
            params: statsQuery,
            headers: { 'x-access-token': localStorageSecured.get('access-token') }
         })
        .then(response => {
            setIsLoading(false)
            setStaffPayments(trimStaffPayments(response.data.staffPayments))
            setTotalPayments(response.data.totalEarnings)
        })
        .catch(error => {
            setIsLoading(false)
            return toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })

    }, [reload])
    
    const columns = () => {

            return [
                { title: translations[lang]['payments'], field: '', render: rowData => {
                    return <div className="center"><PaymentIcon /></div>
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


    return (
        <div className="table-container">
            <MaterialTable 
                title={<div><strong>{totalPayments}</strong> <span>{currency}</span></div>}
                isLoading={isLoading}
                columns={columns()}
                data={staffPayments}
                icons={TableIcons}
                options={{ 
                    pageSize: 5, 
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: staffPayments.length }],
                    actionsColumnIndex: -1,
                    exportButton: {
                        pdf: false,
                        csv: true
                    }, 
                    exportFileName: translations[lang]['Payments'],
                    grouping: false,
                    filtering: filter
                }}
                actions={[
                    {
                        icon: TableIcons.Filter,
                        tooltip: translations[lang]['Filter'],
                        isFreeAction: true,
                        onClick: e => setFilter(filter ? false: true)
                    },
                    {
                        icon: TableIcons.Refresh,
                        tooltip: translations[lang]['Refresh'],
                        isFreeAction: true,
                        onClick: e => setReload(reload + 1)
                    }
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

export default DetailedPayments