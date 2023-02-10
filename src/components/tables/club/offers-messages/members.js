import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../../table-icons'
import { serverRequest } from '../../../../API/request'
import { trimMembers } from '../../../../utils/trimmers'
import toast from 'react-hot-toast'
import translations from '../../../../i18n'
import { localStorageSecured } from '../../../../security/localStorage'
import { config } from '../../../../config/config'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'


const ClubOffersMessagesMembersTable = ({ isClub, updatedMembers, setUpdatedMembers, setMode, isRefreshAdded }) => {

    const lang = localStorage.getItem('lang')

    const headers = { 
        'x-access-token': localStorageSecured.get('access-token')
    }

    const [members, setMembers] = useState([])

    const [filter, setFilter] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [selectAll, setSelectAll] = useState(false)

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]
    

    useEffect(() => {

        setUpdatedMembers([])

        serverRequest.get(`/v1/members/clubs/${clubId}`, { headers, params: { lang, status: 'active' }})
        .then(response => {
            setIsLoading(false)
            setMembers(trimMembers(response.data.members))
        })
        .catch(error => {
            setIsLoading(false)
            toast.error('error loading your data', { position: 'top-right', duration: config.TOAST_ERROR_TIME })
        })
    }, [])

    const sendBulkMessages = () => {

        const { message, language } = localStorageSecured.get('offer-message')
        const members = updatedMembers

        setIsLoading(true)
        serverRequest.post(
            `/v1/offers-messages/clubs/${clubId}/members/send`,
            { message, members, languageCode: language },
            { headers, params: { lang } }
        )
        .then(response => {
            setIsLoading(false)
            setUpdatedMembers(response.data.status)
            setMode('SEND')
        })
        .catch(error => {
            setIsLoading(false)
            toast.error(error.response.data.message, { position: 'top-right', duration: config.TOAST_ERROR_TIME })
        })
    }


    const cancelSelection = () => {

        setSelectAll(false)
        setUpdatedMembers([])
        setMembers(members.map(member => {
            member.picked = false
            return member
        }))
    }


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
                { title: updatedMembers.length === 0 ? translations[lang]['Pick']: updatedMembers.length, field: '', render: rowData => {
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
        <>
            <ArrowCircleLeftIcon className="back-btn" onClick={e => {
                setMembers([])
                setMode('VIEW')
            }} />
            <div className="table-container">
                <MaterialTable 
                    title={<label>
                        <input type="checkbox" className="filled-in" checked={selectAll ? 'checked': ''} onClick={e => {

                            if(selectAll === false) {
                                setUpdatedMembers(members)
                                setMembers(members.map(member => {
                                    member.picked = true
                                    return member
                                }))
                            } else {
                                setUpdatedMembers([])
                                setMembers(members.map(member => {
                                    member.picked = false
                                    return member
                                }))
                            }

                            setSelectAll(!selectAll)
                        }}
                        />
                        <span></span>
                        </label>}
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
                    actions={[
                        {
                            icon: TableIcons.Filter,
                            tooltip: translations[lang]['Filter'],
                            isFreeAction: true,
                            onClick: e => setFilter(filter ? false: true)
                        },
                        {
                            icon: TableIcons.Message,
                            tooltip: translations[lang]['Send'],
                            isFreeAction: true,
                            onClick: e => sendBulkMessages()
                        },
                        {
                            icon: TableIcons.Cancel,
                            tooltip: translations[lang]['Cancel'],
                            isFreeAction: true,
                            onClick: e => cancelSelection()
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
        </>
    )

}

export default ClubOffersMessagesMembersTable