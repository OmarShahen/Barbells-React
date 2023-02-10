import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { serverRequest } from '../../../API/request'
import { trimAttendances } from '../../../utils/trimmers'
import { useNavigate } from 'react-router-dom'
import translations from '../../../i18n'


const ClubAttendancesTable = ({ data, isClub, isRefreshAdded, isLoading, reload, setReload }) => {

    const navigate = useNavigate()
    
    const [attendances, setAttendances] = useState(trimAttendances(data))

    const [filter, setFilter] = useState(false)

    const lang = localStorage.getItem('lang')

    const pagePath = window.location.pathname
    const clubName = pagePath.split('/')[2]
    const Id = pagePath.split('/')[3]
    


    const columns = () => {
        return [
            { title: translations[lang]['New'], field: 'isNew', editable: 'never', render: rowData => {
                return rowData.isNew ?
                <span className="app-badge blue white-text">{translations[lang]['new']}</span>
                :
                <span className="app-badge grey white-text">{translations[lang]['old']}</span>
            } },
            { title: translations[lang]['Member'], field: 'member.name', cellStyle: { whiteSpace: 'nowrap' } },
            { title: translations[lang]['Package'], field: 'package.title', cellStyle: { whiteSpace: 'nowrap' } },
            { title: translations[lang]['Staff'], field: 'staff.name', cellStyle: { whiteSpace: 'nowrap' } },
            { title: translations[lang]['Attendance Time'], field: 'attendanceTime', cellStyle: { whiteSpace: 'nowrap' } },
            { title: translations[lang]['Attendance Date'], field: 'registrationDate', cellStyle: { whiteSpace: 'nowrap' } },
    
        ]
    }

    useEffect(() => {
        setAttendances(trimAttendances(data))
    }, [data])


    return (
        <div className="table-container">
            <MaterialTable 
                title={`# ${data.length}`}
                isLoading={isLoading}
                columns={columns()}
                data={attendances}
                icons={TableIcons}
                options={{ 
                    pageSize: 15,
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: attendances.length }], 
                    actionsColumnIndex: -1,
                    exportButton: {
                        pdf: false,
                        csv: true
                    }, 
                    exportFileName: translations[lang]['Attendances'],
                    grouping: true,
                    filtering: filter,
                    headerStyle: {
                        whiteSpace: 'nowrap'
                    }
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
                        onClick: e => setFilter(filter ? false: true)
                    },
                    {
                        icon: TableIcons.Cancel,
                        tooltip: translations[lang]['cancelled attendances'],
                        isFreeAction: true,
                        onClick: e => navigate(
                            isClub ?
                            `/app/chain-owners/${Id}/cancelled-attendances/main`
                            :
                            `/app/clubs/${Id}/cancelled-attendances/main`
                            )
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

export default ClubAttendancesTable