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

    const [filter, setFilter] = useState(false)

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
                title={`# ${data.length}`}
                isLoading={isLoading}
                columns={columns()}
                data={cancelledAttendances}
                icons={TableIcons}
                options={{ 
                    pageSize: 15, 
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: cancelledAttendances.length }],
                    actionsColumnIndex: -1,
                    exportButton: {
                        pdf: false,
                        csv: true
                    }, 
                    exportFileName: translations[lang]['Cancelled-Attendances'],
                    grouping: true,
                    filtering: filter
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
                        emptyDataSourceMessage: '???? ???????? ??????????',
                        editRow: {
                            deleteText: '???? ?????? ?????????? ???? ??????????',
                            cancelTooltip: '??????????',
                            saveTooltip: '????????'
                        },

                        editTooltip: '??????????',
                        deleteTooltip: '??????'
                    },
                    grouping: {
                        placeholder: '???????? ???????????????? ?????? ??????????????',
                        groupedBy: '???????????? ????'
                    },
                    header: {
                        actions: ''
                    },
                    toolbar: {
                        exportTitle: '??????????',
                        exportAriaLabel: '??????????',
                        searchTooltip: '??????',
                        searchPlaceholder: '??????',
                        exportCSVName: '?????????? ??????????????'
                    },
                    pagination: {
                        labelRowsSelect: '??????????',
                        labelRowsPerPage: '?????? ????????????',
                        firstAriaLabel: '???????????? ????????????',
                        firstTooltip: '???????????? ????????????',
                        previousAriaLabel: '???????????? ??????????????',
                        previousTooltip: '???????????? ??????????????',
                        nextAriaLabel: '???????????? ??????????????',
                        nextTooltip: '???????????? ??????????????',
                        lastAriaLabel: '???????????? ??????????????',
                        lastTooltip: '???????????? ??????????????',
                    }

                }
                 : {}
                }
            
            />
        </div>
    )

}

export default ClubCancelledAttendancesTable