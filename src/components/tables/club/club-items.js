import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { trimItems } from '../../../utils/trimmers'
import { useNavigate } from 'react-router-dom'
import translations from '../../../i18n/index'
import { serverRequest } from '../../../API/request'
import { localStorageSecured } from '../../../security/localStorage'
import { config } from '../../../config/config'
import toast from 'react-hot-toast'
import { formateNumber, formateMoney } from '../../../utils/money'


const ClubItemsTable = ({ data, isRefreshAdded, isLoading, reload, setReload }) => {

    const navigate = useNavigate()

    const lang = localStorage.getItem('lang')
    const headers = { 
        'x-access-token': localStorageSecured.get('access-token')
    }

    const [items, setItems] = useState(data)
    const [updatedItems, setUpdatedItems] = useState([])
    const [filter, setFilter] = useState(false)

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]
    

    useEffect(() => {
        setItems(trimItems(data))
    }, [data])

    useEffect(() => {
        setItems(trimItems(updatedItems))
    }, [updatedItems])


    const updateItem = async (newItem, oldItem) => {

        const itemsData = [...items]  
        const itemTableId = oldItem.tableData.id

        const newItemData = { name: newItem.name, price: Number.parseFloat(newItem.price), barcode: Number.parseInt(newItem.barcode) }
                
        serverRequest.patch(`/v1/items/${newItem._id}/clubs/${clubId}`, newItemData, { headers, params: { lang } })
        .then(response => {

            const itemData = response.data.item
            itemsData[itemTableId] = itemData

            setUpdatedItems(itemsData)
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

    const deleteItem = async (itemData) => {

        const itemsData = [...items]  
        const itemTableId = itemData.tableData.id
                
        serverRequest.delete(`/v1/items/${itemData._id}`, { headers, params: { lang } })
        .then(response => {

            const filteredItems = itemsData.filter((itemObj, index) => itemTableId !== index)

            setUpdatedItems(filteredItems)
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

        tableColumns.push({ title: translations[lang]['Amount'], field: 'itemAmount', editable: false, cellStyle: { whiteSpace: 'nowrap' } })

        tableColumns.push({ title: translations[lang]['Price'], field: 'price', render: rowData => formateMoney(rowData.price), cellStyle: { whiteSpace: 'nowrap' } })

        tableColumns.push({ title: translations[lang]['Initial Stock'], field: 'itemInitialStock', editable: false, cellStyle: { whiteSpace: 'nowrap' } })

        tableColumns.push({ title: translations[lang]['Barcode'], field: 'barcode', cellStyle: { whiteSpace: 'nowrap' } })

        tableColumns.push({
            title: translations[lang]['Statistics'], grouping: false, filtering: false, render: rowData => {
                return <div className="app-table-stats-icon" onClick={ e => navigate(`/app/clubs/${clubId}/items/${rowData._id}/stats`)}>
                    <i className="material-icons blue white-text"
                    >equalizer
                    </i>
                </div>
            }
        })

        tableColumns.push({ title: translations[lang]['Registration Date'], editable: false, field: 'registrationDate', cellStyle: { whiteSpace: 'nowrap' } })

        return tableColumns
    }



    return (
        <div className="table-container">
            <MaterialTable 
                title={`# ${formateNumber(items.length)}`}
                isLoading={isLoading}
                columns={columns()}
                data={items}
                icons={TableIcons}
                options={{ 
                    pageSize: 15, 
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: items.length }],
                    actionsColumnIndex: -1,
                    exportButton: {
                        pdf: false,
                        csv: true
                    }, 
                    exportFileName: translations[lang]['Items'],
                    grouping: true,
                    filtering: filter,
                    headerStyle: {
                        whiteSpace: 'nowrap'
                    }
                }}
                editable={{
                    onRowDelete: deleteItem,
                    onRowUpdate: updateItem
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

export default ClubItemsTable