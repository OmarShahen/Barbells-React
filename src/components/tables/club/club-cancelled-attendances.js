import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { serverRequest } from '../../../API/request'
import { format } from 'date-fns'
import { trimCancelledAttendances } from '../../../utils/trimmers'
import { DataArrayTwoTone } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import translations from '../../../i18n'


const ClubCancelledAttendancesTable = ({ data, isClub, isRefreshAdded, isLoading, reload, setReload }) => {

    const navigate = useNavigate()

    const [cancelledAttendances, setCancelledAttendances] = useState(trimCancelledAttendances(data))

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    

    useEffect(() => {
        setCancelledAttendances(trimCancelledAttendances(data))
    }, [data])


    const columns = () => {

        if(isClub) {
            return [
                { title: translations[lang]['Branch'], field: 'club.clubCode' },
                { title: translations[lang]['Member'], field: 'member.name' },
                { title: translations[lang]['Package'], field: 'package.title' },
                { title: translations[lang]['Staff'], field: 'staff.name' },
                { title: translations[lang]['Cancellation Time'], field: 'attendanceTime' },
                { title: translations[lang]['Cancellation Date'], field: 'cancellationDate' },
        
            ]
        } else {

            return [
                { title: translations[lang]['Member'], field: 'member.name' },
                { title: translations[lang]['Package'], field: 'package.title' },
                { title: translations[lang]['Staff'], field: 'staff.name' },
                { title: translations[lang]['Cancellation Time'], field: 'attendanceTime' },
                { title: translations[lang]['Cancellation Date'], field: 'cancellationDate' },
        
            ]
        }
    }

    return (
        <div className="table-container">
            <MaterialTable 
                title={`${translations[lang]['Cancelled Attendances']}`}
                isLoading={isLoading}
                columns={columns()}
                data={cancelledAttendances}
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

export default ClubCancelledAttendancesTable