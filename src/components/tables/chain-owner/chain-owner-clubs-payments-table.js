import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { trimClubPayments } from '../../../utils/trimmers'
import PaymentIcon from '@mui/icons-material/Payment'
import translations from '../../../i18n'
import DetailedPayments from './chain-owner-detailed-payments-table'


const ChainOwnersClubsPaymentsTable = ({ data, statsQuery, currency, totalPayments, isRefreshAdded, isLoading, reload, setReload }) => {

    const [clubPayments, setClubPayments] = useState(trimClubPayments(data))

    const [filter, setFilter] = useState(false)

    const lang = localStorage.getItem('lang')
    
    const columns = () => {

            return [
                { title: translations[lang]['Payments'], filtering: false, grouping: false, field: '', render: rowData => {
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
                title={<div><strong>{totalPayments}</strong> <span>{currency}</span></div>}
                isLoading={isLoading}
                columns={columns()}
                data={clubPayments}
                icons={TableIcons}
                options={{ 
                    pageSize: 15,
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: clubPayments.length }], 
                    actionsColumnIndex: -1,
                    exportButton: {
                        pdf: false,
                        csv: true
                    }, 
                    exportFileName: translations[lang]['Clubs-Payments'],
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

                detailPanel={rowData => <DetailedPayments statsQuery={statsQuery} clubId={rowData._id} />}

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

export default ChainOwnersClubsPaymentsTable