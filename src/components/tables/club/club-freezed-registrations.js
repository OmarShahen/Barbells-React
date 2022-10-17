import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { serverRequest } from '../../../API/request'
import { trimFreezedRegistrations } from '../../../utils/trimmers'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import translations from '../../../i18n'


const ClubFreezedRegistrationsTable = ({ data, isClub, isRefreshAdded, isLoading, reload, setReload }) => {

    const [freezedRegistrations, setFreezedRegistrations] = useState(trimFreezedRegistrations(data))

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    

    useEffect(() => {

        setFreezedRegistrations(trimFreezedRegistrations(data))
    }, [data])


    const columns = () => {

        if(isClub) {
            return [
                /*{ title: 'Image', field: 'imageURL', render: rowData => {
                    return <img src={`https://avatars.dicebear.com/api/initials/${rowData.name}.svg`} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%' }} alt="club avatar" />
                } },*/
                { title: translations[lang]['Freezing Status'], field: 'isFreezed', render: rowData => {
                    return rowData.isFreezed ? <AcUnitIcon style={{ color: 'dodgerblue' }} /> : <AcUnitIcon />
                } },
                { title: translations[lang]['Branch'], field: 'club.clubCode' },
                { title: translations[lang]['Member'], field: 'member.name' },
                { title: translations[lang]['Staff'], field: 'staff.name' },
                { title: translations[lang]['Activator'], field: 'activator.name' },
                { title: translations[lang]['Package'], field: 'package.title' },
                { title: translations[lang]['Freeze Duration'], field: 'freezePeriod' },
                { title: translations[lang]['Freezing Date'], field: 'freezedDate' },
                { title: translations[lang]['Registration Expiration Date'], field: 'originalRegistrationNewExpirationDate' },
                { title: translations[lang]['Reactivation Date'], field: 'registrationReactivationDate' },
                { title: translations[lang]['Registration Date'], field: 'registrationDate' },
        
            ]
        } else {

            return [
                /*{ title: 'Image', field: 'imageURL', render: rowData => {
                    return <img src={`https://avatars.dicebear.com/api/initials/${rowData.name}.svg`} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%' }} alt="club avatar" />
                } },*/
                { title: translations[lang]['Freezing Status'], field: 'isFreezed', render: rowData => {
                    return rowData.isFreezed ? <AcUnitIcon style={{ color: 'dodgerblue' }} /> : <AcUnitIcon />
                } },
                { title: translations[lang]['Member'], field: 'member.name' },
                { title: translations[lang]['Staff'], field: 'staff.name' },
                { title: translations[lang]['Activator'], field: 'activator.name' },
                { title: translations[lang]['Package'], field: 'package.title' },
                { title: translations[lang]['Freeze Duration'], field: 'freezePeriod' },
                { title: translations[lang]['Freezing Date'], field: 'freezedDate' },
                { title: translations[lang]['Registration Expiration Date'], field: 'originalRegistrationNewExpirationDate' },
                { title: translations[lang]['Reactivation Date'], field: 'registrationReactivationDate' },
                { title: translations[lang]['Registration Date'], field: 'registrationDate' },
        
            ]
        }
    }

    return (
        <div className="table-container">
            <MaterialTable 
                title={`${translations[lang]['Freezed Registrations']}`}
                isLoading={isLoading}
                columns={columns()}
                data={freezedRegistrations}
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

export default ClubFreezedRegistrationsTable