import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { serverRequest } from '../../../API/request'
import { trimRegistrations } from '../../../utils/trimmers'
import toast from 'react-hot-toast'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import ClubMiniAttendancesTable from './mini-attendance-table'
import { useNavigate, useNavigte } from 'react-router-dom'
import translations from '../../../i18n/index'



const ClubRegistrationsTable = ({ data, isClub, isAttendance, isRefreshAdded, isLoading, reload, setReload }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': localStorage.getItem('access-token') }

    const lang = localStorage.getItem('lang')

    const [registrations, setRegistrations] = useState(trimRegistrations(data))
    const [updatedRegistrations, setUpdatedRegistrations] = useState([])

    const pagePath = window.location.pathname
    const clubName = pagePath.split('/')[2]
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
                { title: translations[lang]['New'], field: 'isNew', editable: 'never', render: rowData => {
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
                { title: translations[lang]['Activity'], field: 'isActive', render: rowData => {
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
                { title: translations[lang]['Freezed'], field: 'isFreezed', render: rowData => {
                    return rowData.isFreezed ? <AcUnitIcon style={{ color: 'dodgerblue' }} /> : <AcUnitIcon />
                }  },
                { title: translations[lang]['Registration Date'], field: 'registrationDate' },
                { title: translations[lang]['Expiration Date'], field: 'expirationDate' }
        
            ]
        } else {
            return [
                { title: translations[lang]['New'], field: 'isNew', editable: 'never', render: rowData => {
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
                { title: translations[lang]['Activity'], field: 'isActive', render: rowData => {
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
                { title: translations[lang]['Freezed'], field: 'isFreezed', render: rowData => {
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
                title={`${translations[lang]['Registrations']}`}
                isLoading={isLoading}
                columns={columns()}
                data={registrations}
                icons={TableIcons}
                options={{ pageSize: 10, exportButton: true, actionsColumnIndex: -1 }}
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

                detailPanel={ isAttendance ? rowData => <ClubMiniAttendancesTable data={rowData.registrationAttendances} /> : null }

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

export default ClubRegistrationsTable