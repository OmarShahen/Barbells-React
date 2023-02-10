import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { trimInventoryPayments } from '../../../utils/trimmers'
import translations from '../../../i18n/index'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import { localStorageSecured } from '../../../security/localStorage'
import { formateMoney, formateNumber } from '../../../utils/money'


const ClubInventoryTable = ({ data, isRefreshAdded, isLoading, reload, setReload }) => {

    const lang = localStorage.getItem('lang')
    const headers = { 
        'x-access-token': localStorageSecured.get('access-token')
    }

    const [payments, setPayments] = useState(trimInventoryPayments(data))
    const [updatedPayments, setUpdatedPayments] = useState([])
    const [filter, setFilter] = useState(false)

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]
    

    useEffect(() => {
        setPayments(trimInventoryPayments(data))
    }, [data])

    useEffect(() => {
        setPayments(trimInventoryPayments(updatedPayments))
    }, [updatedPayments])


    const columns = () => {

        let tableColumns = []

        tableColumns.push({ title: translations[lang]['New'],  filtering: false, field: 'isNew', editable: 'never', render: rowData => {
            return rowData.isNew ?
            <span className="app-badge blue white-text">{translations[lang]['new']}</span>
            :
            <span className="app-badge grey white-text">{translations[lang]['old']}</span>
        } })

        tableColumns.push({ title: translations[lang]['Type'], field: '', editable: 'never', render: rowData => {
            return rowData.type === 'EARN' ? 
            <span className="status-btn done">{translations[lang]['EARN']}</span>
            :
            <span className="status-btn declined">{translations[lang]['DEDUCT']}</span>
        }},)

        tableColumns.push({ title: translations[lang]['Payment Type'], editable: 'never', field: 'typeName' })
        tableColumns.push({ title: 'Item', field: 'item.name', cellStyle: { whiteSpace: 'nowrap' } })
        tableColumns.push({ title: translations[lang]['Price'], field: 'price', cellStyle: { whiteSpace: 'nowrap' }, render: rowData => formateMoney(rowData.price, lang) })
        tableColumns.push({ title: translations[lang]['Amount'], field: 'amount', cellStyle: { whiteSpace: 'nowrap' }, render: rowData => formateNumber(rowData.amount) })
        tableColumns.push({ title: translations[lang]['Total'], field: 'total', cellStyle: { whiteSpace: 'nowrap' }, editable: 'never', render: rowData => formateMoney(rowData.total, lang) })
        tableColumns.push({ title: translations[lang]['Payment Date'], editable: false, field: 'paymentDate', cellStyle: { whiteSpace: 'nowrap' } })
        tableColumns.push({ title: translations[lang]['Payment Time'], editable: false, field: 'paymentTime', cellStyle: { whiteSpace: 'nowrap' } })

        return tableColumns
    }



    return (
        <div className="table-container">
            <MaterialTable 
                title={`# ${payments.length}`}
                isLoading={isLoading}
                columns={columns()}
                data={payments}
                icons={TableIcons}
                options={{ 
                    pageSize: 15, 
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: payments.length }],
                    actionsColumnIndex: -1,
                    exportButton: {
                        pdf: false,
                        csv: true
                    }, 
                    exportFileName: translations[lang]['Payments'],
                    grouping: true,
                    filtering: filter,
                    headerStyle: {
                        whiteSpace: 'nowrap'
                    }
                }}
                actions={[
                    {
                        icon: TableIcons.InAndOut,
                        tooltip: translations[lang]['All'],
                        isFreeAction: true,
                        onClick: e => setPayments(trimInventoryPayments(data))
                    },
                    {
                        icon: TableIcons.Earn,
                        tooltip: translations[lang]['Earns'],
                        isFreeAction: true,
                        onClick: e => setPayments(trimInventoryPayments(data.filter(payment => payment.type === 'EARN')))
                    }
                    ,
                    {
                        icon: TableIcons.Deduct,
                        tooltip: translations[lang]['Deductions'],
                        isFreeAction: true,
                        onClick: e => setPayments(trimInventoryPayments(data.filter(payment => payment.type === 'DEDUCT')))
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
                    ,
                    {
                        icon: TableIcons.Filter,
                        tooltip: translations[lang]['Filter'],
                        isFreeAction: true,
                        onClick: e => setFilter(filter ? false : true)
                    },
                ]}

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

export default ClubInventoryTable