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

        if(isClub) {
            return [
                { title: 'New', field: 'isNew', editable: 'never', render: rowData => {
                    return rowData.isNew ?
                    <span className="app-badge blue white-text">new</span>
                    :
                    <span className="app-badge grey white-text">old</span>
                } },
                { title: translations[lang]['Branch'], field: 'club.clubCode' },
                { title: translations[lang]['Member'], field: 'member.name' },
                { title: translations[lang]['Package'], field: 'package.title' },
                { title: translations[lang]['Staff'], field: 'staff.name' },
                { title: translations[lang]['Attendance Time'], field: 'attendanceTime' },
                { title: translations[lang]['Attendance Date'], field: 'registrationDate' },
        
            ]
        } else {
            return [
                { title: translations[lang]['New'], field: 'isNew', editable: 'never', render: rowData => {
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
                    filtering: filter
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

export default ClubAttendancesTable