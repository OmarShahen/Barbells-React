import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { serverRequest } from '../../../API/request'
import { trimPayrolls } from '../../../utils/trimmers'
import toast from 'react-hot-toast'
import { config } from '../../../config/config'
import M from 'materialize-css'
import { useNavigate } from 'react-router-dom'
import translations from '../../../i18n'
import { localStorageSecured } from '../../../security/localStorage'
import { formateMoney, getTotal } from '../../../utils/money'

const ClubPayrollsTable = ({ data, isClub, isRefreshAdded, isLoading, reload, setReload }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }

    const [payrolls, setPayrolls] = useState(data)
    const [updatedPayrolls, setupdatedPayrolls] = useState([])

    const [filter, setFilter] = useState(false)

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    
    useEffect(() => {
        const elems = document.querySelectorAll('.dropdown-trigger')
        M.Dropdown.init(elems)
    }, [])

    useEffect(() => {
        setPayrolls(trimPayrolls(data))
    }, [data])

    useEffect(() => {
        setPayrolls(trimPayrolls(updatedPayrolls))
    }, [updatedPayrolls])

    const updatePayroll = async (newPayroll, oldPayroll) => {

        const payrollsData = [...payrolls]  
        const payrollTableId = oldPayroll.tableData.id

        newPayroll.price = Number.parseInt(newPayroll.paid)
                
        serverRequest.put(`/v1/payments/${newPayroll._id}`, newPayroll, { headers, params: { lang } })
        .then(response => {

            const payrollData = response.data.payment
            payrollData.staffPayroll = oldPayroll.staffPayroll
            payrollsData[payrollTableId] = payrollData

            setupdatedPayrolls(payrollsData)
            toast.success(response.data.message, { position: 'top-right', duration: config.TOAST_SUCCESS_TIME })

        })
        .catch(error => {
            console.error(error)     
            try {
                toast.error(error.response.data.message, { position: 'top-right', duration: config.TOAST_ERROR_TIME })
            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: config.TOAST_ERROR_TIME })
            }
        })       

    }


    const deletePayroll = async (payrollData) => {

        const payrollsData = [...payrolls]  
        const payrollTableId = payrollData.tableData.id
                
        serverRequest.delete(`/v1/payments/${payrollData._id}`, { headers, params: { lang } })
        .then(response => {

            const filteredPayments = payrollsData.filter((payrollObj, index) => payrollTableId !== index)

            setupdatedPayrolls(filteredPayments)
            toast.success(response.data.message, { position: 'top-right', duration: config.TOAST_SUCCESS_TIME })

        })
        .catch(error => {
            console.error(error)     
            try {
                toast.error(error.response.data.message, { position: 'top-right', duration: config.TOAST_ERROR_TIME })
            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: config.TOAST_ERROR_TIME })
            }
        })
    }

    const columns = () => {
        return [ 
            { title: translations[lang]['Image'], field: '', filtering: false, export: false, editable: 'never', render: rowData => {
                return <img src={`https://avatars.dicebear.com/api/initials/${rowData.staffPayroll.name}.svg`} style={{ width: '3rem', height: '3rem', borderRadius: '50%' }} alt="club avatar" />
            } },
            { title: translations[lang]['Employee'], field: 'staffPayroll.name', cellStyle: { whiteSpace: 'nowrap' }, editable: 'never' },
            { title: translations[lang]['Role'], field: 'staffPayroll.role', cellStyle: { whiteSpace: 'nowrap' }, editable: 'never' },
            { title: translations[lang]['Paid'], field: 'paid', cellStyle: { whiteSpace: 'nowrap' }, render: rowData => formateMoney(rowData.paid, lang) },
            { title: translations[lang]['Payment Date'], field: 'paymentDate', cellStyle: { whiteSpace: 'nowrap' }, editable: 'never' },
        ]
    }
    

    return (
        <div className="table-container">
            <MaterialTable 
                title={`${formateMoney(getTotal(payrolls, 'paid'), lang)}`}
                isLoading={isLoading}
                columns={columns()}
                data={payrolls}
                icons={TableIcons}
                options={{ 
                    pageSize: 15,
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: payrolls.length }],
                    actionsColumnIndex: -1,
                    exportButton: {
                        pdf: false,
                        csv: true
                    }, 
                    exportFileName: translations[lang]['Payrolls'],
                    grouping: true,
                    filtering: filter,
                    headerStyle: {
                        whiteSpace: 'nowrap'
                    }
                }}
                editable={{
                    onRowUpdate: updatePayroll,
                    onRowDelete: deletePayroll
                }}
                actions={[
                    isRefreshAdded ? 
                    {
                        icon: TableIcons.Refresh,
                        tooltip: translations[lang]['Refresh'],
                        isFreeAction: true,
                        onClick: e => setReload(reload + 1)
                    }
                    :
                    null,
                    {
                        icon: TableIcons.Filter,
                        tooltip: translations[lang]['Filter'],
                        isFreeAction: true,
                        onClick: e => setFilter(filter ? false : true)
                    }
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

export default ClubPayrollsTable