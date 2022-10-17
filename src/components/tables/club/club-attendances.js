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

    const lang = localStorage.getItem('lang')

    const pagePath = window.location.pathname
    const clubName = pagePath.split('/')[2]
    const Id = pagePath.split('/')[3]
    


    const columns = () => {

        if(isClub) {
            return [
                { title: '', field: 'isNew', editable: 'never', render: rowData => {
                    return rowData.isNew ?
                    <span className="app-badge blue white-text">new</span>
                    :
                    <span className="app-badge grey white-text">old</span>
                } },
                { title: translations[lang]['Member'], field: 'member.name' },
                { title: translations[lang]['Package'], field: 'package.title' },
                { title: translations[lang]['Staff'], field: 'staff.name' },
                { title: translations[lang]['Branch'], field: 'club.clubCode' },
                { title: translations[lang]['Attendance Time'], field: 'attendanceTime' },
                { title: translations[lang]['Attendance Date'], field: 'registrationDate' },
        
            ]
        } else {
            return [
                { title: translations[lang][''], field: 'isNew', editable: 'never', render: rowData => {
                    return rowData.isNew ?
                    <span className="app-badge blue white-text">{translations[lang]['new']}</span>
                    :
                    <span className="app-badge grey white-text">{translations[lang]['old']}</span>
                } },
                { title: translations[lang]['Member'], field: 'member.name' },
                { title: translations[lang]['Package'], field: 'package.title' },
                { title: translations[lang]['Staff'], field: 'staff.name' },
                { title: translations[lang]['Attendance Time'], field: 'attendanceTime' },
                { title: translations[lang]['Attendance Date'], field: 'registrationDate' },
        
            ]
        }
    }

    useEffect(() => {
        setAttendances(trimAttendances(data))
    }, [data])


    return (
        <div className="table-container">
            <MaterialTable 
                title={`${translations[lang]['Attendances']}`}
                isLoading={isLoading}
                columns={columns()}
                data={attendances}
                icons={TableIcons}
                options={{ pageSize: 10, exportButton: true }}
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
                        
                    },
                    editRow: {
                        deleteText: 'مسح',
                        cancelTooltip: 'الغاء'
                    },
                    header: {
                        actions: ''
                    },
                    toolbar: {
                        exportTitle: 'تنزيل',
                        exportAriaLabel: 'تنزيل',
                        searchTooltip: 'بحث',
                        searchPlaceholder: 'بحث'
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