import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import toast from 'react-hot-toast'
import { serverRequest } from '../../../API/request'
import { trimChainOwners } from '../../../utils/trimmers'


const ChainOwnersMembersTable = ({ data }) => {

    const headers = { 'x-access-token': localStorage.getItem('access-token') }

    const [members, setMembers] = useState(data)    

    useEffect(() => setMembers(data), [data])


    const columns = [
        { title: 'Image', field: 'imageURL', editable: 'never', render: rowData => {
            return <img src={`https://avatars.dicebear.com/api/initials/${rowData.name}.svg`} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%' }} alt="club avatar" />
        } },
        { title: 'Name', field: 'name' },
        { title: 'Phone', field: 'phone' },
        { title: 'Mail', field: 'email' },
        { title: 'Club', field: 'club.clubCode' },
        { title: 'Description', field: 'club.description' },
        { title: 'Country', field: 'club.location.country' },
        { title: 'City', field: 'club.location.city' },
        { title: 'Registration Date', field: 'registrationDate' },

    ]

    return (
        <div className="table-container">
            <MaterialTable 
                title={`Members ${members.length}`}
                isLoading={false}
                columns={columns}
                data={members}
                icons={TableIcons}
                options={{ pageSize: 10, exportButton: true }}
            
            />
        </div>
    )

}

export default ChainOwnersMembersTable