import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { serverRequest } from '../../../API/request'
import { trimMembers } from '../../../utils/trimmers'
import toast from 'react-hot-toast'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { useNavigate } from 'react-router-dom'
import translations from '../../../i18n'
import { localStorageSecured } from '../../../security/localStorage'
import { config } from '../../../config/config'
import ClubOfferMessageForm from '../../forms/offers-messages-form'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'

const ClubMembersTable = ({ data, isClub, isRefreshAdded, isLoading, reload, setReload }) => {

    const navigate = useNavigate()
    const lang = localStorage.getItem('lang')

    const headers = { 
        'x-access-token': localStorageSecured.get('access-token')
    }

    const [members, setMembers] = useState(trimMembers(data))
    const [updatedMembers, setUpdatedMembers] = useState([])
    const [sendToMember, setSendToMember] = useState()

    const [filter, setFilter] = useState(false)

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]
    

    useEffect(() => {
        setMembers(trimMembers(data))
    }, [data])

    useEffect(() => {
        setMembers(trimMembers(updatedMembers))
    }, [updatedMembers])

    const updateMember = async (newMember, oldMember) => {

        newMember.gender = newMember.type
        if(lang === 'en' && !['male', 'female'].includes(newMember.gender)) {
            return toast.error('Invalid gender', { position: 'top-right', duration: 3000 })
        } else if(lang === 'ar' && !['ذكر', 'انثي'].includes(newMember.gender)) {
            return toast.error('النوع غير مقبول', { position: 'top-right', duration: 3000 })
        }

        if(lang === 'ar') {
            newMember.gender = translations[lang][newMember.gender]
        }

        if(!Number.parseInt(newMember.membership)) {
            return toast.error(translations[lang]['Membership must be a number'], { position: 'top-right', duration: 3000 })
        }

        newMember.membership = Number.parseInt(newMember.membership)
        const membersData = [...members]  
        const memberTableId = oldMember.tableData.id
                
        serverRequest.put(`/v1/members/${newMember._id}`, newMember, { headers, params: { lang } })
        .then(response => {

            const memberData = response.data.member
            memberData.club = oldMember.club
            membersData[memberTableId] = memberData

            setUpdatedMembers(membersData)
            toast.success(response.data.message, { position: 'top-right', duration: config.TOAST_ERROR_TIME })

        })
        .catch(error => {
            console.error(error)     
            try {
                toast.error(error.response.data.message, { position: 'top-right', duration: config.TOAST_ERROR_TIME })
            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: config.TOAST_ERROR_TIME })
            }
        })    
    }

    const updateMemberAuthStatus = (memberData) => {

        const memberTableId = memberData.tableData.id
        const membersData = [...members]

        serverRequest.patch(`/v1/members/${memberData._id}`, { isBlocked: !memberData.isBlocked }, { headers, params: { lang } })
        .then(response => {

            let updatedMember = response.data.member
            updatedMember.club = memberData.club
            updatedMember.entrance = updatedMember.isBlocked ? translations[lang]['Blocked'] : translations[lang]['Allowed']
            membersData[memberTableId] = updatedMember

            setUpdatedMembers(membersData)
            toast.success(response.data.message, { position: 'top-right', duration: config.TOAST_SUCCESS_TIME })
        })
        .catch(error => {
            toast.error(error.response.data.message, { position: 'top-right', duration: config.TOAST_ERROR_TIME })
        })
        
    }

    const deleteMember = async (memberData) => {

        const membersData = [...members]  
        const memberTableId = memberData.tableData.id
                
        serverRequest.delete(`/v1/members/${memberData._id}`, { headers, params: { lang } })
        .then(response => {

            const filteredMembers = membersData.filter((member, index) => memberTableId !== index)
            setUpdatedMembers(filteredMembers)
            toast.success(response.data.message, { position: 'top-right', duration: config.TOAST_SUCCESS_TIME })

        })
        .catch(error => {
            toast.error(error.response.data.message, { position: 'top-right', duration: config.TOAST_ERROR_TIME })
        })
    }


    const columns = () => {
                
        return [
            { title: translations[lang]['New'], field: 'isNew', export: false, filtering: false, editable: 'never', render: rowData => {
                return rowData.isNew ?
                <span className="app-badge blue white-text">{translations[lang]['new']}</span>
                :
                <span className="app-badge grey white-text">{translations[lang]['old']}</span>
            } },
            { title:translations[lang]['Image'], export: false, field: 'imageURL', filtering: false, editable: 'never', render: rowData => {
                return <img src={`https://avatars.dicebear.com/api/initials/${rowData.name}.svg`} style={{ width: '3rem', height: '3rem', borderRadius: '50%' }} alt="club avatar" />
            } },
            { title: translations[lang]['Name'], field: 'name', cellStyle: { whiteSpace: 'nowrap' } },
            { title: translations[lang]['Phone Code'], cellStyle: { whiteSpace: 'nowrap' }, editable: false, field: 'countryCode', render: rowData => <div className="center">{rowData.countryCode}</div> },
            { title: translations[lang]['Phone'], field: 'phone', cellStyle: { whiteSpace: 'nowrap' } },
            { title: translations[lang]['Gender'], field: 'type', cellStyle: { whiteSpace: 'nowrap' } },
            { title: translations[lang]['Age'], type: Number, field: 'age', cellStyle: { whiteSpace: 'nowrap' } },
            //{ title: translations[lang]['Job'], type: Number, field: 'job', editable: 'never', cellStyle: { whiteSpace: 'nowrap' } },
            //{ title: translations[lang]['Sport Type'], type: Number, field: 'sportType', editable: 'never', cellStyle: { whiteSpace: 'nowrap' } },
            { title: translations[lang]['Blacklist'], type: Number, field: 'isBlacklist', cellStyle: { whiteSpace: 'nowrap' }, editable: 'never', render: rowData => {
                return rowData.isBlacklist ? <span>{translations[lang]['In Blacklist']}</span> : <span>{translations[lang]['Clean']}</span>
            } },
            { title: translations[lang]['Account Security'], cellStyle: { whiteSpace: 'nowrap' }, filtering: false, grouping: false, field: 'canAuthenticate', editable: 'never',
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
            title: translations[lang]['Statistics'], filtering: false, grouping: false, export: false, render: rowData => {
                return <div className="center app-table-stats-icon" onClick={ e => navigate(`/app/clubs/${clubId}/members/${rowData._id}/stats`)}>
                    <i className="material-icons blue white-text"
                    >equalizer
                    </i>
                </div>
            }
        },
        { title: translations[lang]['Entrance'], editable: true, field: 'entrance', cellStyle: { whiteSpace: 'nowrap' } },
            { title: translations[lang]['Account Status'], filtering: false, grouping: false, field: 'isBlocked', editable: 'never', render: rowData => {
                return <div className="switch">
                <label>
                    { rowData.isBlocked
                    ? 
                    <input type="checkbox" onChange={() => updateMemberAuthStatus(rowData)} checked={false} />
                    : 
                    <input type="checkbox" onChange={() => updateMemberAuthStatus(rowData)} checked={true} />
                }
                    <span className="lever" ></span>
                </label>
                </div>
            } },
            { title: translations[lang]['Send Offer'], field: '', render: rowData => {
                return <a href='#offer-message-form-modal' onClick={e => setSendToMember(rowData)} className="modal-trigger send-offer-icon-table">
                        <SendOutlinedIcon />
                    </a>
            }},
            { title: translations[lang]['Registration Date'], field: 'registrationDate', editable: 'never', cellStyle: { whiteSpace: 'nowrap' } },
    
        ]
    }

    return (
        <div className="table-container">
            <ClubOfferMessageForm member={sendToMember} />
            <MaterialTable 
                title={`# ${members.length}`}
                isLoading={isLoading}
                columns={columns()}
                data={members}
                icons={TableIcons}
                options={{ 
                    pageSize: 10, 
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: members.length }],
                    actionsColumnIndex: -1,
                    exportButton: {
                        pdf: false,
                        csv: true
                    }, 
                    exportFileName: translations[lang]['Members'],
                    grouping: true,
                    filtering: filter,
                    headerStyle: {
                        whiteSpace: 'nowrap'
                    }
                }}
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
                    null,
                    {
                        icon: TableIcons.Filter,
                        tooltip: translations[lang]['Filter'],
                        isFreeAction: true,
                        onClick: e => setFilter(filter ? false: true)
                    },
                ]}

                detailPanel={rowData => <div className="member-detail-panel">
                    <ul>
                        <li>
                            <strong>{translations[lang]['Name']}</strong><br />
                            <span>{rowData.name}</span>
                        </li>
                        <li>
                            <strong>{translations[lang]['Email']}</strong><br />
                            <span>{rowData.email ? rowData.email : translations[lang]['Not Registered']}</span>
                        </li>
                        <li>
                            <strong>{translations[lang]['Phone']}</strong><br />
                            <span>{'+' + rowData.countryCode + rowData.phone}</span>
                        </li>
                        <li>
                            <strong>{translations[lang]['Gender']}</strong><br />
                            <span>{rowData.gender}</span>
                        </li>
                        <li>
                            <strong>{translations[lang]['Age']}</strong><br />
                            <span>{rowData.age}</span>
                        </li>
                        <li>
                            <strong>{translations[lang]['Address']}</strong><br />
                            <span>{rowData.address ? rowData.address : translations[lang]['Not Registered']}</span>
                        </li>
                        <li>
                            <strong>{translations[lang]['Job']}</strong><br />
                            <span>{rowData.job ? rowData.job : translations[lang]['Not Registered']}</span>
                        </li>
                        <li>
                            <strong>{translations[lang]['Sport Type']}</strong><br />
                            <span>{rowData.sportType ? rowData.sportType : translations[lang]['Not Registered']}</span>
                        </li>
                        <li>
                            <strong>{translations[lang]['Secure']}</strong><br />
                            {
                            rowData.canAuthenticate ? 
                            <span className="green-text">{translations[lang]['Secure']}</span> 
                            : 
                            <span className="red-text">{translations[lang]['Insecure']}</span> }
                        </li>
                        <li>
                            <strong>{translations[lang]['Account Status']}</strong><br />
                            {rowData.isBlocked ? <span className="red-text">{translations[lang]['Blocked']}</span> : <span className="green-text">{translations[lang]['Active']}</span>}
                        </li>
                        <li>
                            <strong>{translations[lang]['Blacklist']}</strong><br />
                            {rowData.isBlacklist ? <span className="red-text">{translations[lang]['In Blacklist']}</span> : <span className="green-text">{translations[lang]['Clean']}</span> }
                        </li>
                        <li>
                            <strong>{translations[lang]['Registration Date']}</strong><br />
                            <span>{rowData.registrationDate}</span>
                        </li>
                    </ul>
                </div>}

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

export default ClubMembersTable