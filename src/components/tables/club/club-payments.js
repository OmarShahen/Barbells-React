import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { trimPayments } from '../../../utils/trimmers'
import { useNavigate } from 'react-router-dom'
import translations from '../../../i18n/index'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import { serverRequest } from '../../../API/request'
import { localStorageSecured } from '../../../security/localStorage'
import { config } from '../../../config/config'
import toast from 'react-hot-toast'
import { formateMoney, getTotal, formateNumber } from '../../../utils/money'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'


const ClubPaymentsTable = ({ data, view, deductionPayments, earningsPayments, category, isRefreshAdded, isLoading, reload, setReload }) => {

    const navigate = useNavigate()

    const lang = localStorage.getItem('lang')
    const headers = { 
        'x-access-token': localStorageSecured.get('access-token')
    }

    const [payments, setPayments] = useState(trimPayments(data))
    const [updatedPayments, setUpdatedPayments] = useState([])
    const [filter, setFilter] = useState(false)

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]
    

    useEffect(() => {
        setPayments(trimPayments(data))
    }, [data])

    useEffect(() => {
        setPayments(trimPayments(updatedPayments))
    }, [updatedPayments])

    const updatePayment = async (newPayment, oldPayment) => {

        const paymentsData = [...payments]  
        const paymentTableId = oldPayment.tableData.id

        newPayment.price = Number.parseInt(newPayment.price)
        newPayment.amount = Number.parseInt(newPayment.amount)
                
        serverRequest.put(`/v1/payments/${newPayment._id}`, newPayment, { headers, params: { lang } })
        .then(response => {

            const paymentData = response.data.payment
            paymentData.staff = oldPayment.staff
            paymentsData[paymentTableId] = paymentData

            setUpdatedPayments(paymentsData)
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

    

    const deletePayment = async (paymentData) => {

        const paymentsData = [...payments]  
        const paymentTableId = paymentData.tableData.id
                
        serverRequest.delete(`/v1/payments/${paymentData._id}`, { headers, params: { lang } })
        .then(response => {

            const filteredPayments = paymentsData.filter((paymentObj, index) => paymentTableId !== index)

            setUpdatedPayments(filteredPayments)
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

        view === 'all' && tableColumns.push({ title: translations[lang]['Category'], cellStyle: { whiteSpace: 'nowrap' }, field: 'categoryName' })
        view !== 'all' && tableColumns.push({ title: translations[lang]['Description'], cellStyle: { whiteSpace: 'nowrap' }, field: 'description' })
        view !== 'all' && tableColumns.push({ title: translations[lang]['Staff'], cellStyle: { whiteSpace: 'nowrap' },field: 'staff.name', editable: 'never' })
        //tableColumns.push({ title: 'Category', field: 'category' })
        category === 'inventory' && tableColumns.push({ title: translations[lang]['Payment Type'], cellStyle: { whiteSpace: 'nowrap' }, editable: 'never', field: 'typeName' })

        if(category === 'inventory') {
            tableColumns.push({ title: translations[lang]['Price'], field: 'price', cellStyle: { whiteSpace: 'nowrap' }, render: rowData => formateMoney(rowData.price, lang) })
        } else if(view === 'all') {

        } else {
            tableColumns.push({ title: translations[lang]['Paid'], field: 'price', cellStyle: { whiteSpace: 'nowrap' }, render: rowData => formateMoney(rowData.price, lang) }) 
        }

        if(category === 'inventory') {
            tableColumns.push({ title: translations[lang]['Amount'], field: 'amount', cellStyle: { whiteSpace: 'nowrap' }, render: rowData => formateNumber(rowData.amount) })
        }

        if(category === 'inventory' || view === 'all') {
            tableColumns.push({ title: translations[lang]['Total'], field: 'total', cellStyle: { whiteSpace: 'nowrap' }, editable: 'never', render: rowData => formateMoney(rowData.total, lang) })
        }

        if(category === 'bill') {

            tableColumns.push({ 
                title: translations[lang]['Image'], 
                editable: false, 
                field: 'imageURL', 
                render: rowData => <a href={rowData.imageURL} target="_blank" className="black-text">
                    <DescriptionOutlinedIcon />
            </a> })
        }

        tableColumns.push({ title: translations[lang]['Payment Date'], editable: false, field: 'registrationDate', cellStyle: { whiteSpace: 'nowrap' } })

        tableColumns.push({ title: translations[lang]['Payment Time'], editable: false, field: 'paymentTime', cellStyle: { whiteSpace: 'nowrap' } })

        return tableColumns
    }



    return (
        <div className="table-container">
            <MaterialTable 
                title={
                    view === 'all' ?
                    `# ${payments.length}`
                    :
                    formateMoney(getTotal(payments, 'total'), lang)
                }
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
                editable={{
                    onRowDelete: view === 'all' ? false : deletePayment,
                    onRowUpdate: view === 'all' ? false :  updatePayment
                }}
                actions={[
                    {
                        icon: TableIcons.InAndOut,
                        tooltip: translations[lang]['All'],
                        isFreeAction: true,
                        onClick: e => setPayments(trimPayments(data))
                    },
                    {
                        icon: TableIcons.Earn,
                        tooltip: translations[lang]['Earns'],
                        isFreeAction: true,
                        onClick: e => setPayments(trimPayments(data.filter(payment => payment.type === 'EARN')))
                    }
                    ,
                    {
                        icon: TableIcons.Deduct,
                        tooltip: translations[lang]['Deductions'],
                        isFreeAction: true,
                        onClick: e => setPayments(trimPayments(data.filter(payment => payment.type === 'DEDUCT')))
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
                    view !== 'all' ?
                    {
                        icon: TableIcons.Stats,
                        tooltip: translations[lang]['Statistics'],
                        isFreeAction: true,
                        onClick: e => navigate(`/app/clubs/${clubId}/payments/${category}/stats`)
                    }
                    :
                    null
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

export default ClubPaymentsTable