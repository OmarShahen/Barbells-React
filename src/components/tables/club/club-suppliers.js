import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { trimSuppliers } from '../../../utils/trimmers'
import { useNavigate } from 'react-router-dom'
import translations from '../../../i18n/index'
import { serverRequest } from '../../../API/request'
import { localStorageSecured } from '../../../security/localStorage'
import { config } from '../../../config/config'
import toast from 'react-hot-toast'
import { formateNumber } from '../../../utils/money'


const ClubSuppliersTable = ({ data, isRefreshAdded, isLoading, reload, setReload }) => {

    const navigate = useNavigate()

    const lang = localStorage.getItem('lang')
    const headers = { 
        'x-access-token': localStorageSecured.get('access-token')
    }

    const [suppliers, setSuppliers] = useState(data)
    const [updatedSuppliers, setUpdatedSuppliers] = useState([])
    const [filter, setFilter] = useState(false)

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]
    

    useEffect(() => {
        setSuppliers(trimSuppliers(data))
    }, [data])

    useEffect(() => {
        setSuppliers(trimSuppliers(updatedSuppliers))
    }, [updatedSuppliers])


    const updateSupplier = async (newSupplier, oldSupplier) => {

        const suppliersData = [...suppliers]  
        const supplierTableId = oldSupplier.tableData.id
                
        serverRequest.put(`/v1/suppliers/${newSupplier._id}`, newSupplier, { headers, params: { lang } })
        .then(response => {

            const supplierData = response.data.supplier
            suppliersData[supplierTableId] = supplierData

            setUpdatedSuppliers(suppliersData)
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

    const deleteSupplier = async (supplierData) => {

        const suppliersData = [...suppliers]  
        const supplierTableId = supplierData.tableData.id
                
        serverRequest.delete(`/v1/suppliers/${supplierData._id}`, { headers, params: { lang } })
        .then(response => {

            const filteredSuppliers = suppliersData.filter((itemObj, index) => supplierTableId !== index)

            setUpdatedSuppliers(filteredSuppliers)
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

        tableColumns.push({ title: translations[lang]['Name'], field: 'name', cellStyle: { whiteSpace: 'nowrap' } })

        tableColumns.push({ title: translations[lang]['Description'], field: 'description', cellStyle: { whiteSpace: 'nowrap' } })

        tableColumns.push({ title: translations[lang]['Phone Code'], field: 'countryCode', cellStyle: { whiteSpace: 'nowrap' } })

        tableColumns.push({ title: translations[lang]['Phone'], field: 'phone', cellStyle: { whiteSpace: 'nowrap' } })

        tableColumns.push({ title: translations[lang]['Registration Date'], editable: false, cellStyle: { whiteSpace: 'nowrap' }, field: 'registrationDate' })

        return tableColumns
    }



    return (
        <div className="table-container">
            <MaterialTable 
                title={`# ${formateNumber(suppliers.length)}`}
                isLoading={isLoading}
                columns={columns()}
                data={suppliers}
                icons={TableIcons}
                options={{ 
                    pageSize: 15, 
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: suppliers.length }],
                    actionsColumnIndex: -1,
                    exportButton: {
                        pdf: false,
                        csv: true
                    }, 
                    exportFileName: translations[lang]['Suppliers'],
                    grouping: true,
                    filtering: filter,
                    headerStyle: {
                        whiteSpace: 'nowrap'
                    }
                }}
                editable={{
                    onRowDelete: deleteSupplier,
                    onRowUpdate: updateSupplier
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
                    null
                    ,
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

export default ClubSuppliersTable