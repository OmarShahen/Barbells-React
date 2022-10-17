import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { serverRequest } from '../../../API/request'
import { trimMembers } from '../../../utils/trimmers'
import toast, { Toaster } from 'react-hot-toast'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import MemberNav from '../../navigation/options/member-nav'
import { useNavigate } from 'react-router-dom'
import translations from '../../../i18n'


const ClubMembersTable = ({ data, isClub, isRefreshAdded, isLoading, reload, setReload }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': localStorage.getItem('access-token') }

    const [members, setMembers] = useState(trimMembers(data))
    const [updatedMembers, setUpdatedMembers] = useState([])

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    

    useEffect(() => {
        setMembers(trimMembers(data))
    }, [data])

    useEffect(() => {
        setMembers(trimMembers(updatedMembers))
    }, [updatedMembers])

    const updateMember = async (newMember, oldMember) => {

        const membersData = [...members]  
        const memberTableId = oldMember.tableData.id

                
        serverRequest.put(`/members/${newMember._id}`, newMember, { headers })
        .then(response => {

            const memberData = response.data.member
            membersData[memberTableId] = memberData

            setUpdatedMembers(membersData)
            toast.success('updated member successfully!', { position: 'top-right', duration: 3000 })

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

    const updatememberAuthStatus = (memberData) => {

        const memberTableId = memberData.tableData.id
        const membersData = [...members]

        serverRequest.patch(`/members/${memberData._id}`, { isBlocked: !memberData.isBlocked }, { headers })
        .then(response => {

            membersData[memberTableId] = response.data.member

            setUpdatedMembers(membersData)

            toast.success(memberData.isBlocked ? 'member is disabled successfully' : 'member is enabled successfully'
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

    const deleteMember = async (memberData) => {

        const membersData = [...members]  
        const memberTableId = memberData.tableData.id
                
        serverRequest.delete(`/members/${memberData._id}`, { headers })
        .then(response => {

            const filteredMembers = membersData.filter((member, index) => memberTableId !== index)

            setUpdatedMembers(filteredMembers)
            toast.success('deleted member successfully!', { position: 'top-right', duration: 3000 })

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


    const columns = () => {

        if(isClub) {
            return [
                { title: '', field: 'isNew', editable: 'never', render: rowData => {
                    return rowData.isNew ?
                    <span className="app-badge blue white-text">new</span>
                    :
                    <span className="app-badge grey white-text">old</span>
                } },
                { title: '', field: 'imageURL', editable: 'never', render: rowData => {
                    return <img src={`https://avatars.dicebear.com/api/initials/${rowData.name}.svg`} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%' }} alt="club avatar" />
                } },
                { title: translations[lang]['Branch'], field: 'club.clubCode' },
                { title: translations[lang]['Name'], field: 'name' },
                { title: translations[lang]['Phone Code'], field: 'countryCode', render: rowData => <div className="center">{rowData.countryCode}</div> },
                { title: translations[lang]['Phone'], field: 'phone' },
                { title: translations[lang]['Mail'], field: 'email' },
                { title: translations[lang]['Gender'], field: 'type'},
                { title: translations[lang]['Age'], field: 'age'},
                { title: translations[lang]['Account Security'], field: 'canAuthenticate', editable: 'never', 
                render: rowData => rowData.canAuthenticate ? 
                <div className="center"><LockOutlinedIcon color='primary' /></div> : <div className="center"><LockOpenIcon color='warning' /></div> } ,
                {
                    title: translations[lang]['Statistics'], render: rowData => {
                        return <div className="center app-table-stats-icon" onClick={ e => navigate(`/app/clubs/${clubId}/members/${rowData._id}/stats`)}>
                            <i className="material-icons blue white-text"
                            >equalizer
                            </i>
                        </div>
                    }
                },
                { title: translations[lang]['Account Status'], field: 'isBlocked', editable: 'never', render: rowData => {
                    return <div className="switch">
                    <label>
                      { rowData.isBlocked
                       ? 
                       <input type="checkbox" onChange={() => updatememberAuthStatus(rowData)} checked={false} />
                        : 
                        <input type="checkbox" onChange={() => updatememberAuthStatus(rowData)} checked={true} />
                    }
                      <span className="lever" ></span>
                    </label>
                  </div>
                } },
                { title: translations[lang]['Registration Date'], field: 'registrationDate', editable: 'never' },
        
            ]
        } else {

            return [
                { title: '', field: 'isNew', editable: 'never', render: rowData => {
                    return rowData.isNew ?
                    <span className="app-badge blue white-text">{translations[lang]['new']}</span>
                    :
                    <span className="app-badge grey white-text">{translations[lang]['old']}</span>
                } },
                { title: translations[lang]['Image'], field: 'imageURL', editable: 'never', render: rowData => {
                    return <img src={`https://avatars.dicebear.com/api/initials/${rowData.name}.svg`} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%' }} alt="club avatar" />
                } },
                { title: translations[lang]['Name'], field: 'name' },
                { title: translations[lang]['Phone Code'], field: 'countryCode', render: rowData => <div className="center">{rowData.countryCode}</div> },
                { title: translations[lang]['Phone'], field: 'phone' },
                { title: translations[lang]['Mail'], field: 'email' },
                { title: translations[lang]['Account Security'], field: 'canAuthenticate', editable: 'never',
                render: rowData => rowData.canAuthenticate ?
                <div className="center">
                    <LockOutlinedIcon color='primary' />
                </div> 
                : 
                <div className="center">
                    <LockOpenIcon color='warning' />
                </div>
            } ,
            {
                title: translations[lang]['Statistics'], render: rowData => {
                    return <div className="center app-table-stats-icon" onClick={ e => navigate(`/app/clubs/${clubId}/members/${rowData._id}/stats`)}>
                        <i className="material-icons blue white-text"
                        >equalizer
                        </i>
                    </div>
                }
            },
                { title: translations[lang]['Account Status'], field: 'isBlocked', editable: 'never', render: rowData => {
                    return <div className="switch">
                    <label>
                      { rowData.isBlocked
                       ? 
                       <input type="checkbox" onChange={() => updatememberAuthStatus(rowData)} checked={false} />
                        : 
                        <input type="checkbox" onChange={() => updatememberAuthStatus(rowData)} checked={true} />
                    }
                      <span className="lever" ></span>
                    </label>
                  </div>
                } },
                { title: translations[lang]['Registration Date'], field: 'registrationDate', editable: 'never' },
        
            ]
        }
    }

    return (
        <div className="table-container">
            <MaterialTable 
                title={`${translations[lang]['Members']}`}
                isLoading={isLoading}
                columns={columns()}
                data={members}
                icons={TableIcons}
                options={{ pageSize: 15, exportButton: true, actionsColumnIndex: -1 }}
                editable={{
                    onRowUpdate: updateMember,
                    onRowDelete: deleteMember
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

export default ClubMembersTable