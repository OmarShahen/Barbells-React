import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { serverRequest } from '../../../API/request'
import { trimOffersMessages } from '../../../utils/trimmers'
import translations from '../../../i18n'
import { localStorageSecured } from '../../../security/localStorage'
import { toast } from 'react-hot-toast'
import { config } from '../../../config/config'


const ClubOffersMessagesTable = ({ data, isRefreshAdded, isLoading, reload, setReload, setMode }) => {

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }
    const lang = localStorage.getItem('lang')
    
    const [offersMessages, setOffersMessages] = useState(trimOffersMessages(data))
    const [updatedOffersMessages, setUpdatedOffersMessages] = useState([])


    const columns = () => {

        return [
            { title: 'Name', field: 'name' },
            { title: 'Message', field: 'message', render: rowData => <p className="truncate">{rowData.message}</p> },
            { title: 'Creation Date', field: 'creationDate', editable: false },
        ]
    }

    useEffect(() => {
        setOffersMessages(trimOffersMessages(data))
    }, [data])

    useEffect(() => {
        setOffersMessages(trimOffersMessages(updatedOffersMessages))
    }, [updatedOffersMessages])

    const deleteOfferMessage = async (offerMessageData) => {

        const offersMessagesData = [...offersMessages]  
        const offerMessageTableId = offerMessageData.tableData.id
                
        serverRequest.delete(`/offers-messages/${offerMessageData._id}`, { headers, params: { lang } })
        .then(response => {

            const filteredOffersMessages = offersMessagesData.filter((offerMessageObj, index) => offerMessageTableId !== index)

            setUpdatedOffersMessages(filteredOffersMessages)
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

    const updateOfferMessage = async (newOfferMessage, oldOfferMessage) => {

        const offersMessagesData = [...offersMessages]  
        const offerMessageTableId = oldOfferMessage.tableData.id
                
        serverRequest.put(`/offers-messages/${newOfferMessage._id}`, newOfferMessage, { headers, params: { lang } })
        .then(response => {

            const offerMessageData = response.data.offerMessage
            offerMessageData.club = oldOfferMessage.club
            offersMessagesData[offerMessageTableId] = offerMessageData

            setUpdatedOffersMessages(offersMessagesData)
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


    return (
        <div className="table-container">
            <MaterialTable 
                title={`# ${data.length}`}
                isLoading={isLoading}
                columns={columns()}
                data={offersMessages}
                icons={TableIcons}
                options={{ 
                    pageSize: 15,
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: offersMessages.length }], 
                    actionsColumnIndex: -1,
                    exportButton: {
                        pdf: false,
                        csv: true
                    }, 
                    exportFileName: translations[lang]['Attendances'],
                    grouping: true,
                }}

                editable={{
                    onRowUpdate: updateOfferMessage,
                    onRowDelete: deleteOfferMessage
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
                        icon: TableIcons.Message,
                        tooltip: 'Send',
                        onClick: (e, rowData) => {
                            localStorageSecured.set('offer-message', rowData)
                            setMode('PICK')
                        }
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

export default ClubOffersMessagesTable