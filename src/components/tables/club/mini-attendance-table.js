import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { trimAttendances } from '../../../utils/trimmers'
import translations from '../../../i18n/index'

const ClubMiniAttendancesTable = ({ data }) => {

    const [attendances, setAttendances] = useState(trimAttendances(data))
    
    const lang = localStorage.getItem('lang')

    const columns = () => {

            return [
                { title: translations[lang]['Staff'], field: 'staff.name' },
                { title: translations[lang]['Attendance Time'], field: 'attendanceTime' },
                { title: translations[lang]['Attendance Date'], field: 'registrationDate' },
            ]
    }

    useEffect(() => {
        setAttendances(trimAttendances(data))
    }, [data])


    return (
        <div>
            <MaterialTable 
                title={`${translations[lang]['Attendances']}`}
                isLoading={false}
                columns={columns()}
                data={attendances}
                icons={TableIcons}
                options={{ pageSize: 10, exportButton: true }}
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

export default ClubMiniAttendancesTable