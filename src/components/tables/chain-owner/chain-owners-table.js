import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import toast from 'react-hot-toast'
import { serverRequest } from '../../../API/request'
import { trimChainOwners } from '../../../utils/trimmers'


const ChainOwnersTable = ({ data }) => {

    const headers = { 'x-access-token': localStorage.getItem('access-token') }

    const [chainOwners, setChainOwners] = useState(data)    
    const [updatedChainOwners, setUpdatedChainOwners] = useState([])

    useEffect(() => setChainOwners(data), [data])

    useEffect(() => {
        setChainOwners(trimChainOwners(updatedChainOwners))
    }, [updatedChainOwners])


    const updateChainOwner = async (newChainOwner, oldChainOwner) => {

        const chainOwnersData = [...chainOwners]  
        const chainOwnerTableId = oldChainOwner.tableData.id
                
        serverRequest.put(`/chain-owners/${newChainOwner._id}`, newChainOwner, { headers })
        .then(response => {

            const chainOwnerData = response.data.owner
            chainOwnersData[chainOwnerTableId] = chainOwnerData

            setUpdatedChainOwners(chainOwnersData)
            toast.success('updated chain owner successfully!', { position: 'top-right', duration: 3000 })

        })
        .catch(error => {
            console.error(error)     
            try {
                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })       

    }

    const updateChainOwnerStatus = (chainOwnerData) => {

        const chainOwnerTableId = chainOwnerData.tableData.id
        const chainOwnersData = [...chainOwners]

        serverRequest.patch(`/chain-owners/${chainOwnerData._id}`, { isAccountActive: !chainOwnerData.isAccountActive }, { headers })
        .then(response => {

            chainOwnersData[chainOwnerTableId] = response.data.owner

            setUpdatedChainOwners(chainOwnersData)

            toast.success(chainOwnerData.isAccountActive ? 'chain owner is deactivated successfully' : 'chain owner is activated successfully'
                , { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            console.error(error)     
            try {
                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })       
        
    }

    const deleteChainOwner = async (chainOwnerData) => {

        const chainOwnersData = [...chainOwners]  
        const chainOwnerTableId = chainOwnerData.tableData.id
                
        serverRequest.delete(`/chain-owners/${chainOwnerData._id}`, { headers })
        .then(response => {

            const filteredChainOwners = chainOwnersData.filter((owner, index) => chainOwnerTableId !== index)

            setUpdatedChainOwners(filteredChainOwners)
            toast.success('deleted chain owner successfully!', { position: 'top-right', duration: 3000 })

        })
        .catch(error => {
            console.error(error)     
            try {
                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })
    }


    const columns = [
        { title: 'Image', field: 'imageURL', editable: 'never', render: rowData => {
            return <img src={`https://avatars.dicebear.com/api/initials/${rowData.name}.svg`} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%' }} alt="club avatar" />
        } },
        { title: 'Name', field: 'name' },
        { title: 'Phone', field: 'phone' },
        { title: 'Mail', field: 'email' },
        { title: 'Branches', field: 'branches', editable: 'never' },
        { title: 'Account Status', field: 'isBlocked', editable: 'never', render: rowData => {
            return <div className="switch">
            <label>
              { rowData.isAccountActive
               ? 
               <input type="checkbox" onChange={() => updateChainOwnerStatus(rowData)} checked={true} />
                : 
                <input type="checkbox" onChange={() => updateChainOwnerStatus(rowData)} checked={false} />
            }
              <span className="lever" ></span>
            </label>
          </div>
        } },
        { title: 'Registration Date', field: 'createdAt', editable: 'never' },

    ]

    return (
        <div className="table-container">
            <MaterialTable 
                title={`Owners ${chainOwners.length}`}
                isLoading={false}
                columns={columns}
                data={chainOwners}
                icons={TableIcons}
                options={{ pageSize: 10, exportButton: true, actionsColumnIndex: -1 }}
                editable={{
                    onRowUpdate: updateChainOwner,
                    onRowDelete: deleteChainOwner
                }}
            
            />
        </div>
    )

}

export default ChainOwnersTable