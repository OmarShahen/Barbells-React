import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { serverRequest } from '../../../API/request'
import { format } from 'date-fns'
import { DataArrayOutlined, DataArrayTwoTone, DataObjectOutlined } from '@mui/icons-material'
import { trimStaffs } from '../../../utils/trimmers'
import toast, { Toaster } from 'react-hot-toast'
import { TrendingUpRounded } from '@material-ui/icons'
import StaffNav from '../../navigation/options/staff-nav'
import translations from '../../../i18n'


const ClubStaffsTable = ({ title, data, isClub, isRefreshAdded, isLoading, reload, setReload }) => {

    const headers = { 'x-access-token': localStorage.getItem('access-token') }

    const [staffs, setStaffs] = useState(trimStaffs(data))
    const [updatedStaffs, setUpdatedStaffs] = useState([])

    const [filter, setFilter] = useState(false)

    const lang = localStorage.getItem('lang')

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const columns = () => {

        if(isClub) {

            return [
                { title: translations[lang]['Image'], grouping: false, filtering: false, field: 'imageURL', editable: 'never', render: rowData => {
                    return <img src={`https://avatars.dicebear.com/api/initials/${rowData.name}.svg`} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%' }} alt="club avatar" />
                } },
                { title: translations[lang]['Name'], field: 'name' },
                { title: translations[lang]['Phone Code'], field: 'countryCode', render: rowData => <div className="center">{rowData.countryCode}</div> },
                { title: translations[lang]['Phone'], field: 'phone' },
                { title: translations[lang]['Mail'], field: 'email' },
                { title: translations[lang]['Branch'], field: 'club.clubCode', editable: 'never' },
                //{ title: translations[lang]['Role'], field: 'role', editable: 'never' },
                { title: translations[lang]['Account Status'], grouping: false, filtering: false, field: 'isAccountActive', editable: 'never', render: rowData => {
                    return <div className="switch">
                    <label>
                      { rowData.isAccountActive
                       ? 
                       <input type="checkbox" onChange={() => updateStaffStatus(rowData)} checked={true} />
                        : 
                        <input type="checkbox" onChange={() => updateStaffStatus(rowData)} checked={false} />
                    }
                      <span className="lever" ></span>
                    </label>
                  </div>
                } },
                { title: translations[lang]['Registration Date'], field: 'registrationDate', editable: 'never' },
        
            ]
        
        } else {
            return [
                { title: translations[lang]['Image'], field: 'imageURL', grouping: false, filtering: false, editable: 'never', render: rowData => {
                    return <img src={`https://avatars.dicebear.com/api/initials/${rowData.name}.svg`} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%' }} alt="club avatar" />
                } },
                { title: translations[lang]['Name'], field: 'name' },
                { title: translations[lang]['Phone Code'], field: 'countryCode', render: rowData => <div className="center">{rowData.countryCode}</div> },
                { title: translations[lang]['Phone'], field: 'phone' },
                { title: translations[lang]['Mail'], field: 'email' },
                //{ title: translations[lang]['Role'], field: 'role', editable: 'never' },
                { title: translations[lang]['Account Status'], grouping: false, filtering: false, field: 'isAccountActive', editable: 'never', render: rowData => {
                    return <div className="switch">
                    <label>
                      { rowData.isAccountActive
                       ? 
                       <input type="checkbox" onChange={() => updateStaffStatus(rowData)} checked={true} />
                        : 
                        <input type="checkbox" onChange={() => updateStaffStatus(rowData)} checked={false} />
                    }
                      <span className="lever" ></span>
                    </label>
                  </div>
                } },
                { title: translations[lang]['Registration Date'], field: 'registrationDate', editable: 'never' },
        
            ]
        
        }
    }
    

    useEffect(() => {
        setStaffs(trimStaffs(data))
    }, [data])

    useEffect(() => {
        setStaffs(trimStaffs(updatedStaffs))
    }, [updatedStaffs])

    const updateStaff = async (newStaff, oldStaff) => {

        const staffsData = [...staffs]  
        const staffTableId = oldStaff.tableData.id

                
        serverRequest.put(`/staffs/${newStaff._id}`, newStaff)
        .then(response => {

            const staffData = response.data.staff
            staffsData[staffTableId] = staffData

            setUpdatedStaffs(staffsData)
            toast.success('updated staff successfully!', { position: 'top-right', duration: 3000 })

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

    const updateStaffStatus = (staffData) => {

        const staffTableId = staffData.tableData.id
        const staffsData = [...staffs]

        serverRequest.patch(`/staffs/${staffData._id}`, { isAccountActive: !staffData.isAccountActive })
        .then(response => {

            staffsData[staffTableId] = response.data.staff

            setUpdatedStaffs(staffsData)

            toast.success(staffData.isAccountActive ? 'staff is disabled successfully' : 'staff is enabled successfully'
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

    const deleteStaff = async (staffData) => {

        const staffsData = [...staffs]  
        const staffTableId = staffData.tableData.id
                
        serverRequest.delete(`/staffs/${staffData._id}`, { headers })
        .then(response => {

            const filteredStaffs = staffsData.filter((staff, index) => staffTableId !== index)

            setUpdatedStaffs(filteredStaffs)
            toast.success('deleted staff successfully!', { position: 'top-right', duration: 3000 })

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



    return (
        <div className="table-container">
            <MaterialTable 
                title={`# ${data.length}`}
                isLoading={isLoading}
                columns={columns()}
                data={staffs}
                icons={TableIcons}
                options={{ 
                    pageSize: 15,
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: staffs.length }], 
                    actionsColumnIndex: -1,
                    exportButton: {
                        pdf: false,
                        csv: true
                    }, 
                    exportFileName: translations[lang][title] || translations[lang]['Staffs'],
                    grouping: true,
                    filtering: filter
                }}
                editable={{
                    onRowUpdate: updateStaff,
                    onRowDelete: deleteStaff
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

export default ClubStaffsTable