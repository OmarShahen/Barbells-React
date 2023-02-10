import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { serverRequest } from '../../../API/request'
import { trimStaffs } from '../../../utils/trimmers'
import toast from 'react-hot-toast'
import translations from '../../../i18n'
import { localStorageSecured } from '../../../security/localStorage'
import { config } from '../../../config/config'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import ClubPayrollForm from '../../forms/payroll-form'
import { formateNumber } from '../../../utils/money'

const ClubStaffsTable = ({ title, data, staffRole, isClub, isRefreshAdded, isLoading, reload, setReload }) => {

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }

    const [staffs, setStaffs] = useState(trimStaffs(data))
    const [staffPayroll, setStaffPayroll] = useState()
    const [updatedStaffs, setUpdatedStaffs] = useState([])

    const [filter, setFilter] = useState(false)

    const lang = localStorage.getItem('lang')

    const columns = () => {
        return [
            { title: translations[lang]['Image'], field: 'imageURL', grouping: false, filtering: false, editable: 'never', render: rowData => {
                return <img src={`https://avatars.dicebear.com/api/initials/${rowData.name}.svg`} style={{ width: '3rem', height: '3rem', borderRadius: '50%' }} alt="club avatar" />
            } },
            { title: translations[lang]['Name'], field: 'name', cellStyle: { whiteSpace: 'nowrap' } },
            { title: translations[lang]['Phone Code'], field: 'countryCode', cellStyle: { whiteSpace: 'nowrap' }, render: rowData => <div className="center">{rowData.countryCode}</div> },
            { title: translations[lang]['Phone'], field: 'phone', cellStyle: { whiteSpace: 'nowrap' } },
            { title: translations[lang]['Mail'], field: 'email', cellStyle: { whiteSpace: 'nowrap' } },
            { title: translations[lang]['Payroll'], field: '', cellStyle: { whiteSpace: 'nowrap' }, render: rowData => {
                return <a href='#payroll-form-modal' onClick={e => setStaffPayroll(rowData)} className="modal-trigger send-offer-icon-table">
                <PaymentsOutlinedIcon />
            </a> 
            }},
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
            { title: translations[lang]['Registration Date'], field: 'registrationDate', cellStyle: { whiteSpace: 'nowrap' }, editable: 'never' },
    
        ] 
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

                
        serverRequest.put(`/v1/staffs/${newStaff._id}`, newStaff, { headers, params: { lang } })
        .then(response => {

            const staffData = response.data.staff
            staffData.club = oldStaff.club
            staffsData[staffTableId] = staffData

            setUpdatedStaffs(staffsData)
            toast.success(response.data.message, { position: 'top-right', duration: config.TOAST_SUCCESS_TIME })

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

    const updateStaffStatus = (staffData) => {

        const staffTableId = staffData.tableData.id
        const staffsData = [...staffs]

        serverRequest.patch(`/v1/staffs/${staffData._id}`, { isAccountActive: !staffData.isAccountActive }, { headers, params: { lang } })
        .then(response => {

            const updatedStaff = response.data.staff
            updatedStaff.club = staffData.club
            staffsData[staffTableId] = updatedStaff

            setUpdatedStaffs(staffsData)

            toast.success(staffData.isAccountActive ? translations[lang]['Staff is disabled successfully'] : translations[lang]['Staff is enabled successfully']
                , { position: 'top-right', duration: config.TOAST_SUCCESS_TIME })
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

    const deleteStaff = async (staffData) => {

        const staffsData = [...staffs]  
        const staffTableId = staffData.tableData.id
                
        serverRequest.delete(`/v1/staffs/${staffData._id}`, { headers, params: { lang } })
        .then(response => {

            const filteredStaffs = staffsData.filter((staff, index) => staffTableId !== index)

            setUpdatedStaffs(filteredStaffs)
            toast.success(response.data.message, { position: 'top-right', duration: config.TOAST_SUCCESS_TIME })

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

    const updateStaffRole = async (staffData, role) => {

        const staffTableId = staffData.tableData.id
        const staffsData = [...staffs]

        serverRequest.patch(`/v1/staffs/${staffData._id}/role`, { role }, { headers, params: { lang } })
        .then(response => {

            const filteredStaffs = staffsData.filter((staff, index) => staffTableId !== index)
            setUpdatedStaffs(filteredStaffs)

            toast.success(response.data.message, { position: 'top-right', duration: config.TOAST_SUCCESS_TIME })
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



    return (
        <div className="table-container">
            <ClubPayrollForm staff={staffPayroll} />
            <MaterialTable 
                title={formateNumber(data.length)}
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
                    filtering: filter,
                    headerStyle: {
                        whiteSpace: 'nowrap'
                    }
                }}
                editable={{
                    onRowUpdate: updateStaff,
                    onRowDelete: deleteStaff
                }}
                actions={[
                    staffRole === 'CLUB-ADMIN' ? 
                    {
                        icon: TableIcons.Downgrade,
                        tooltip: translations[lang]['downgrade to staff'],
                        onClick: (e, row)=> updateStaffRole(row, 'STAFF')
                    }
                    :
                    null,
                    staffRole === 'STAFF' ? 
                    {
                        icon: TableIcons.Upgrade,
                        tooltip: translations[lang]['upgrade to club admin'],
                        onClick: (e, row)=> updateStaffRole(row, 'CLUB-ADMIN')
                    }
                    :
                    null,
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