import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { trimCancelledRegistrations } from '../../../utils/trimmers'
import translations from '../../../i18n'


const ClubCancelledRegistrationsTable = ({ data, isClub, isRefreshAdded, isLoading, reload, setReload }) => {

    const [cancelledRegistrations, setCancelledRegistrations] = useState(trimCancelledRegistrations(data))

    const [filter, setFilter] = useState(false)

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    

    useEffect(() => {
        setCancelledRegistrations(trimCancelledRegistrations(data))
    }, [data])


    const columns = () => {
        return [
    
            { title: translations[lang]['Member'], field: 'member.name', cellStyle: { whiteSpace: 'nowrap' } },
            { title: translations[lang]['Package'], field: 'package.title', cellStyle: { whiteSpace: 'nowrap' } },
            { title: translations[lang]['Staff'], field: 'staff.name', cellStyle: { whiteSpace: 'nowrap' } },
            { title: translations[lang]['Paid'], field: 'paid', cellStyle: { whiteSpace: 'nowrap' } },
            { title: translations[lang]['Cancellation Time'], field: 'attendanceTime', cellStyle: { whiteSpace: 'nowrap' } },
            { title: translations[lang]['Cancellation Date'], field: 'cancellationDate', cellStyle: { whiteSpace: 'nowrap' } },
    
        ]
    }

    return (
        <div className="table-container">
            <MaterialTable 
                title={`# ${data.length}`}
                isLoading={isLoading}
                columns={columns()}
                data={cancelledRegistrations}
                icons={TableIcons}
                options={{ 
                    pageSize: 15,
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: cancelledRegistrations.length }],
                    actionsColumnIndex: -1,
                    exportButton: {
                        pdf: false,
                        csv: true
                    }, 
                    exportFileName: translations[lang]['Cancelled-Registrations'],
                    grouping: true,
                    filtering: filter,
                    headerStyle: {
                        whiteSpace: 'nowrap'
                    }
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

export default ClubCancelledRegistrationsTable