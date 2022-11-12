import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../../table-icons'
import { serverRequest } from '../../../../API/request'
import { trimMembers } from '../../../../utils/trimmers'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import translations from '../../../../i18n'
import { localStorageSecured } from '../../../../security/localStorage'
import { config } from '../../../../config/config'

const ClubOffersMessagesMembersTable = ({ isClub, updatedMembers, setUpdatedMembers, setMode, isRefreshAdded }) => {

    const navigate = useNavigate()
    const lang = localStorage.getItem('lang')

    const headers = { 
        'x-access-token': localStorageSecured.get('access-token')
    }

    const [members, setMembers] = useState([])

    const [filter, setFilter] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]
    

    useEffect(() => {

        serverRequest.get(`/members/clubs/${clubId}`, { headers, params: { lang, status: 'active' }})
        .then(response => {
            setIsLoading(false)
            setMembers(trimMembers(response.data.members))
        })
        .catch(error => {
            setIsLoading(false)
            toast.error('error loading your data', { position: 'top-right', duration: config.TOAST_ERROR_TIME })
        })
    }, [])


    const columns = () => {

        if(isClub) {
            return [
                { title: translations[lang]['Image'], field: 'imageURL', filtering: false, export: false, editable: 'never', render: rowData => {
                    return <img src={`https://avatars.dicebear.com/api/initials/${rowData.name}.svg`} style={{ width: '3rem', height: '3rem', borderRadius: '50%' }} alt="club avatar" />
                } },
                { title: translations[lang]['Branch'], editable: false, field: 'club.clubCode' },
                { title: translations[lang]['Name'], field: 'name' },
                { title: translations[lang]['Phone Code'], field: 'countryCode', render: rowData => <div className="center">{rowData.countryCode}</div> },
                { title: translations[lang]['Phone'], field: 'phone' },
                { title: translations[lang]['Membership'], type: Number, field: 'membership' },
                { title: translations[lang]['Gender'], field: 'type'},
                { title: translations[lang]['Age'], type: Number, field: 'age'},                
                { title: translations[lang]['Registration Date'], filtering: false, field: 'registrationDate', editable: 'never' },
        
            ]
        } else {

            return [
                { title: updatedMembers.length === 0 ? 'Pick': updatedMembers.length, field: '', render: rowData => {
                    return <label>
                    <input type="checkbox" className="filled-in" checked={rowData.picked ? 'checked': ''} onClick={e => {

                        if(!rowData.picked) {
                            rowData.picked = true
                            setUpdatedMembers([...updatedMembers, rowData])
                        } else {
                            rowData.picked = false
                            setUpdatedMembers(updatedMembers.filter(member => member._id !== rowData._id))
                        }
                  
                    }}/>
                    <span></span>
                  </label>
                } },
                { title:translations[lang]['Image'], export: false, field: 'imageURL', filtering: false, editable: 'never', render: rowData => {
                    return <img src={`https://avatars.dicebear.com/api/initials/${rowData.name}.svg`} style={{ width: '3rem', height: '3rem', borderRadius: '50%' }} alt="club avatar" />
                } },
                { title: translations[lang]['Name'], field: 'name' },
                { title: translations[lang]['Phone Code'], editable: false, field: 'countryCode', render: rowData => <div className="center">{rowData.countryCode}</div> },
                { title: translations[lang]['Phone'], field: 'phone' },
                { title: translations[lang]['Membership'], type: Number, field: 'membership' },
                { title: translations[lang]['Gender'], field: 'type'},
                { title: translations[lang]['Age'], type: Number, field: 'age'},
                { title: translations[lang]['Registration Date'], field: 'registrationDate', editable: 'never' },
        
            ]
        }
    }

    return (
        <div className="table-container">
            <MaterialTable 
                title={<div>
                    <button className="btn-small blue" onClick={e => {
                        setUpdatedMembers(members)
                        setMembers(members.map(member => {
                            member.picked = true
                            return member
                        }))
                    }}>Send All</button>
                    <button className="btn-small blue" onClick={e => setMode('SEND')} style={{ marginRight: '1rem', marginLeft: '1rem' }}><i className="material-icons left">send</i>Send</button>
                    <button className="btn-small grey" onClick={e => {
                        setUpdatedMembers([])
                        setMembers(members.map(member => {
                            member.picked = false
                            return member
                        }))
                    }}>Cancel</button>
                </div>}
                isLoading={isLoading}
                columns={columns()}
                data={members}
                icons={TableIcons}
                options={{ 
                    pageSize: 10, 
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: members.length }],
                    actionsColumnIndex: -1,
                    filtering: filter
                }}
                onSelectionChange={(rows) => console.log(rows)}
                actions={[
                    {
                        icon: TableIcons.Filter,
                        tooltip: translations[lang]['Filter'],
                        isFreeAction: true,
                        onClick: e => setFilter(filter ? false: true)
                    }
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

export default ClubOffersMessagesMembersTable