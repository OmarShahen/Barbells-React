import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { serverRequest } from '../../../API/request'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { trimClubs } from '../../../utils/trimmers'
import translations from '../../../i18n'
import { localStorageSecured } from '../../../security/localStorage'



const ClubsTable = ({ data, isRefreshAdded, isLoading, reload, setReload }) => {

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }

    const lang = localStorage.getItem('lang')

    const [clubs, setClubs] = useState(trimClubs(data))
    const [updatedClubs, setUpdatedClubs] = useState([])

    const [filter, setFilter] = useState(false)

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
        { title: translations[lang]['Image'], field: 'imageURL', filtering: false, grouping: false, editable: 'never', render: rowData => {
            return <img src={`https://avatars.dicebear.com/api/initials/${rowData.name}.svg`} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%' }} alt="club avatar" />
        } },
        { title: translations[lang]['Name'], field: 'name', editable: 'never' },
        { title: translations[lang]['Branch'], field: 'clubCode', editable: 'never' },
        { title: translations[lang]['Description'], field: 'description' },
        { title: translations[lang]['Phone'], field: 'phone' },
        { title: translations[lang]['Country'], field: 'location.country', editable: 'never' },
        { title: translations[lang]['City'], field: 'location.city', editable: 'never' },
        { title: translations[lang]['Club Status'], filtering: false, grouping: false, field: 'isActive', editable: 'never', render: rowData => {
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
        { title: translations[lang]['Registration Date'], field: 'registrationDate', editable: 'never' },


    ]

    return (
        <div className="table-container">
            <MaterialTable 
                title={translations[lang]['Clubs']}
                isLoading={isLoading}
                columns={columns}
                data={clubs}
                icons={TableIcons}
                options={{ 
                    pageSize: 15,
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: clubs.length }], 
                    actionsColumnIndex: -1,
                    exportButton: {
                        pdf: false,
                        csv: true
                    }, 
                    exportFileName: translations[lang]['Clubs'],
                    grouping: true,
                    filtering: filter
                }}
                editable={{
                    onRowDelete: deleteClub,
                    onRowUpdate: updateClub
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
                        emptyDataSourceMessage: 'لا يوجد سجلات',
                        editRow: {
                            deleteText: 'هل انت متاكد من المسح',
                            cancelTooltip: 'الغاء',
                            saveTooltip: 'احفظ'
                        },

                        editTooltip: 'تعديل',
                        deleteTooltip: 'مسح'
                    },
                    grouping: {
                        placeholder: 'اسحب العناوين هنا للتجميع',
                        groupedBy: 'مجموعة من'
                    },
                    header: {
                        actions: ''
                    },
                    toolbar: {
                        exportTitle: 'تحميل',
                        exportAriaLabel: 'تحميل',
                        searchTooltip: 'بحث',
                        searchPlaceholder: 'بحث',
                        exportCSVName: 'تحميل البينات'
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

export default ClubsTable