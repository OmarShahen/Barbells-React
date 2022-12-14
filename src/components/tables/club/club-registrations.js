import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { trimRegistrations } from '../../../utils/trimmers'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import { useNavigate } from 'react-router-dom'
import translations from '../../../i18n/index'
import DropdownAttendancesTable from './dropdown/attendances'


const ClubRegistrationsTable = ({ data, statsQuery, isClub, isAttendance, isRefreshAdded, isLoading, reload, setReload }) => {

    const navigate = useNavigate()

    const lang = localStorage.getItem('lang')

    const [registrations, setRegistrations] = useState(trimRegistrations(data))
    const [updatedRegistrations, setUpdatedRegistrations] = useState([])

    const [filter, setFilter] = useState(false)


    const pagePath = window.location.pathname
    const Id = pagePath.split('/')[3]
    

    useEffect(() => {
        setRegistrations(trimRegistrations(data))
    }, [data])

    useEffect(() => {
        setRegistrations(trimRegistrations(updatedRegistrations))
    }, [updatedRegistrations])


    /*const cancelRegistration = async (registrationData) => {

        const registrationsData = [...registrations]  
        const registrationTableId = registrationData.tableData.id

        const cancelRegistrationData = {
            clubId: registrationData.clubId,
            registrationId: registrationData._id,
            staffId: JSON.parse(localStorage.getItem('user'))._id
        }

                
        serverRequest.post(`/cancelled-registrations`, cancelRegistrationData, { headers })
        .then(response => {

            const filteredRegistrations = registrationsData.filter((registration, index) => registrationTableId !== index)

            setUpdatedRegistrations(filteredRegistrations)
            toast.success('cancelled registration successfully!', { position: 'top-right', duration: 3000 })

        })
        .catch(error => {
            console.error(error)     
            try {
                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })
    }*/

    const columns = () => {

        if(isClub) {
            return [
                { title: translations[lang]['New'], filtering: false, field: 'isNew', editable: 'never', render: rowData => {
                    return rowData.isNew ?
                    <span className="app-badge blue white-text">{translations[lang]['new']}</span>
                    :
                    <span className="app-badge grey white-text">{translations[lang]['old']}</span>
                } },
                { title: translations[lang]['Branch'], field: 'club.clubCode' },
                { title: translations[lang]['Package'], field: 'package.title' },
                { title: translations[lang]['Member'], field: 'member.name' },
                { title: translations[lang]['Staff'], field: 'staff.name' },
                { title: translations[lang]['Paid'], field: 'paid' },
                { title: translations[lang]['Attended'], field: 'attendances' },
                { title: translations[lang]['Status'], editable: true, field: 'status' },
                { title: translations[lang]['Activity'], filtering: false, grouping: false, field: 'isActive', render: rowData => {
                    return <div className="switch">
                    <label>
                      { rowData.isActive
                       ? 
                       <input type="checkbox" onChange={(e) => e.preventDefault()} checked={true} />
                        : 
                        <input type="checkbox" onChange={(e) => e.preventDefault()} checked={false} />
                    }
                      <span className="lever" ></span>
                    </label>
                  </div>
                } },
                { title: translations[lang]['Freezed'],  filtering: false, grouping: false, field: 'isFreezed', render: rowData => {
                    return rowData.isFreezed ? <AcUnitIcon style={{ color: 'dodgerblue' }} /> : <AcUnitIcon />
                }  },
                { title: translations[lang]['Registration Date'], field: 'registrationDate' },
                { title: translations[lang]['Expiration Date'], field: 'expirationDate' }
        
            ]
        } else {
            return [
                { title: translations[lang]['New'],  filtering: false, field: 'isNew', editable: 'never', render: rowData => {
                    return rowData.isNew ?
                    <span className="app-badge blue white-text">{translations[lang]['new']}</span>
                    :
                    <span className="app-badge grey white-text">{translations[lang]['old']}</span>
                } },
                { title: translations[lang]['Package'], field: 'package.title' },
                { title: translations[lang]['Member'], field: 'member.name' },
                { title: translations[lang]['Staff'], field: 'staff.name' },
                { title: translations[lang]['Paid'], field: 'paid' },
                { title: translations[lang]['Attended'], field: 'attendances' },
                { title: translations[lang]['Status'], editable: true, field: 'status' },
                { title: translations[lang]['Activity'],  filtering: false, grouping: false, field: 'isActive', render: rowData => {
                    return <div className="switch">
                    <label>
                      { rowData.isActive
                       ? 
                       <input type="checkbox" onChange={(e) => e.preventDefault()} checked={true} />
                        : 
                        <input type="checkbox" onChange={(e) => e.preventDefault()} checked={false} />
                    }
                      <span className="lever" ></span>
                    </label>
                  </div>
                } },
                { title: translations[lang]['Freezed'],  filtering: false, grouping: false, field: 'isFreezed', render: rowData => {
                    return rowData.isFreezed ? <AcUnitIcon style={{ color: 'dodgerblue' }} /> : <AcUnitIcon />
                }  },
                { title: translations[lang]['Registration Date'], field: 'registrationDate' },
                { title: translations[lang]['Expiration Date'], field: 'expirationDate' }
        
            ]
        }
    }

    return (
        <div className="table-container">
            <MaterialTable 
                title={`# ${data.length}`}
                isLoading={isLoading}
                columns={columns()}
                data={registrations}
                icons={TableIcons}
                options={{ 
                    pageSize: 15, 
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: registrations.length }],
                    actionsColumnIndex: -1,
                    exportButton: {
                        pdf: false,
                        csv: true
                    }, 
                    exportFileName: translations[lang]['Registrations'],
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
                        tooltip: translations[lang]['cancelled registrations'],
                        isFreeAction: true,
                        onClick: e => navigate(
                            isClub ?
                            `/app/chain-owners/${Id}/cancelled-registrations/main`
                            :
                            `/app/clubs/${Id}/cancelled-registrations/main`
                            )
                    }
                ]}

                detailPanel={rowData => <DropdownAttendancesTable registrationId={rowData._id} statsQuery={statsQuery}/>}

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

export default ClubRegistrationsTable