import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { serverRequest } from '../../../API/request'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { trimClubs } from '../../../utils/trimmers'
import translations from '../../../i18n'




const ClubsTable = ({ data, isRefreshAdded, isLoading, reload, setReload }) => {

    const headers = { 'x-access-token': localStorage.getItem('access-token') }

    const lang = localStorage.getItem('lang')

    const [clubs, setClubs] = useState(trimClubs(data))
    const [updatedClubs, setUpdatedClubs] = useState([])

    useEffect(() => setClubs(data), [data])

    useEffect(() => {
        setClubs(trimClubs(updatedClubs))
    }, [updatedClubs])

    const updateClub = async (newClub, oldClub) => {

        const clubsData = [...clubs]  
        const clubTableId = oldClub.tableData.id
                
        serverRequest.put(`/clubs/${newClub._id}`, newClub, { headers })
        .then(response => {

            const clubData = response.data.club
            clubsData[clubTableId] = clubData

            setUpdatedClubs(clubsData)
            toast.success('updated club successfully!', { position: 'top-right', duration: 3000 })

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

    const updateClubStatus = (clubData) => {

        const clubTableId = clubData.tableData.id
        const clubsData = [...clubs]

        serverRequest.patch(`/clubs/${clubData._id}`, { isActive: !clubData.isActive }, { headers })
        .then(response => {

            clubsData[clubTableId] = response.data.club

            setUpdatedClubs(clubsData)

            toast.success(clubData.isActive ? 'club is deactivated successfully' : 'club is activated successfully'
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

    const deleteClub = async (clubData) => {

        const clubsData = [...clubs]  
        const clubTableId = clubData.tableData.id
                
        serverRequest.delete(`/clubs/${clubData._id}`, { headers })
        .then(response => {

            const filteredClubs = clubsData.filter((club, index) => clubTableId !== index)

            setUpdatedClubs(filteredClubs)
            toast.success('deleted club successfully!', { position: 'top-right', duration: 3000 })

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
        { title: 'Name', field: 'name', editable: 'never' },
        { title: 'Branch Code', field: 'clubCode', editable: 'never' },
        { title: 'Description', field: 'description' },
        { title: 'Phone', field: 'phone' },
        { title: 'Country', field: 'location.country', editable: 'never' },
        { title: 'City', field: 'location.city', editable: 'never' },
        { title: 'Club Status', field: 'isActive', editable: 'never', render: rowData => {
            return <div className="switch">
            <label>
              { rowData.isActive
               ? 
               <input type="checkbox" onChange={() => updateClubStatus(rowData)} checked={true} />
                : 
                <input type="checkbox" onChange={() => updateClubStatus(rowData)} checked={false} />
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
                title={translations[lang]['Clubs']}
                isLoading={isLoading}
                columns={columns}
                data={clubs}
                icons={TableIcons}
                options={{ pageSize: 10, exportButton: true, actionsColumnIndex: -1 }}
                editable={{
                    onRowDelete: deleteClub,
                    onRowUpdate: updateClub
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
                ]}
            
            />
        </div>
    )

}

export default ClubsTable