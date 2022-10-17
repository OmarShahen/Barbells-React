import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import toast from 'react-hot-toast'
import { serverRequest } from '../../../API/request'
import { trimChainOwners } from '../../../utils/trimmers'
import translations from '../../../i18n'


const ChainOwnersStaffsTable = ({ data, isRefreshAdded, isLoading, reload, setReload }) => {

    const headers = { 'x-access-token': localStorage.getItem('access-token') }

    const lang = localStorage.getItem('lang')

    const [staffs, setStaffs] = useState(data)    

    useEffect(() => setStaffs(data), [data])


    const columns = [
        { title: 'Image', field: 'imageURL', editable: 'never', render: rowData => {
            return <img src={`https://avatars.dicebear.com/api/initials/${rowData.name}.svg`} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%' }} alt="club avatar" />
        } },
        { title: 'Name', field: 'name' },
        { title: 'Phone', field: 'phone' },
        { title: 'Mail', field: 'email' },
        { title: 'Club', field: 'club.clubCode' },
        { title: 'Registration Date', field: 'registrationDate' },

    ]

    return (
        <div className="table-container">
            <MaterialTable 
                title={`Admins`}
                isLoading={isLoading}
                columns={columns}
                data={staffs}
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
            
            />
        </div>
    )

}

export default ChainOwnersStaffsTable