import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { trimRegistrations } from '../../../utils/trimmers'
import { useNavigate } from 'react-router-dom'
import translations from '../../../i18n/index'
import DropdownInstallmentsTable from './dropdown/installments'
import { formateMoney, formateNumber } from '../../../utils/money'


const ClubInstallmentsRegistrationsTable = ({ data, statsQuery, isClub, isAttendance, isRefreshAdded, isLoading, reload, setReload }) => {

    const navigate = useNavigate()

    const lang = localStorage.getItem('lang')

    const [registrations, setRegistrations] = useState(trimRegistrations(data))
    const [updatedRegistrations, setUpdatedRegistrations] = useState([])
    const [viewTableHeader, setViewTableHeader] = useState(true)

    const [filter, setFilter] = useState(false)


    const pagePath = window.location.pathname
    const Id = pagePath.split('/')[3]
    

    useEffect(() => {
        setRegistrations(trimRegistrations(data))
    }, [data])

    useEffect(() => {
        setRegistrations(trimRegistrations(updatedRegistrations))
    }, [updatedRegistrations])


    const columns = () => {
            return [
                { title: translations[lang]['Status'], field: 'isPaidFull', 
                render: rowData => rowData.isPaidFull ?
                 <button className="status-btn done">{translations[lang]['Paid']}</button> : <button className="status-btn pending">{translations[lang]['Pending']}</button>
                },
                { title: translations[lang]['Package'], field: 'package.title', cellStyle: { whiteSpace: 'nowrap' } },
                { title: translations[lang]['Member'], field: 'member.name', cellStyle: { whiteSpace: 'nowrap' } },
                { title: translations[lang]['Phone'], field: 'member.phone', cellStyle: { whiteSpace: 'nowrap' } },
                { title: translations[lang]['Total'], field: 'originalPrice', cellStyle: { whiteSpace: 'nowrap' }, render: rowData => <span>{formateMoney(rowData.originalPrice)}</span> },
                { title: translations[lang]['Paid'], field: 'paid', cellStyle: { whiteSpace: 'nowrap' }, render: rowData => <span>{formateMoney(rowData.paid, lang)}</span> },
                { title: translations[lang]['Remaining'], field: '', cellStyle: { whiteSpace: 'nowrap' }, render: rowData => <span>{formateMoney(rowData.originalPrice - rowData.paid)}</span> },
                { title: translations[lang]['Attended'], field: 'attendances', cellStyle: { whiteSpace: 'nowrap' } },
                { title: translations[lang]['Registration Date'], field: 'registrationDate', cellStyle: { whiteSpace: 'nowrap' } },
                { title: translations[lang]['Expiration Date'], field: 'expirationDate', cellStyle: { whiteSpace: 'nowrap' } }   
            ]
    }

    const getTotalPaid = (registrations) => {

        let total = 0
        for(let i=0;i<registrations.length;i++) {
            total += registrations[i].paid
        }

        return total
    }

    return (
        <div className="table-container">
            <MaterialTable 
                title={viewTableHeader ? translations[lang]['Registrations with installments'] : formateMoney(getTotalPaid(registrations))}
                isLoading={isLoading}
                columns={columns()}
                data={registrations}
                icons={TableIcons}
                options={{ 
                    pageSize: 15, 
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: registrations.length }],
                    actionsColumnIndex: -1,
                    exportButton: {
                        pdf: false,
                        csv: true
                    }, 
                    exportFileName: translations[lang]['Registrations'],
                    filtering: filter,
                    headerStyle: {
                        whiteSpace: 'nowrap'
                    }
                }}
                actions={[
                    {
                        icon: TableIcons.InAndOut,
                        tooltip: translations[lang]['All Registrations'],
                        isFreeAction: true,
                        onClick: e => {
                            setUpdatedRegistrations(data)
                            setViewTableHeader(true)
                        }
                    },
                    {
                        icon: TableIcons.Paid,
                        tooltip: translations[lang]['Paid Registrations'],
                        isFreeAction: true,
                        onClick: e => {
                            setUpdatedRegistrations(data.filter(registration => registration.isPaidFull))
                            setViewTableHeader(false)
                        }
                    },
                    {
                        icon: TableIcons.Unpaid,
                        tooltip: translations[lang]['Unpaid Registrations'],
                        isFreeAction: true,
                        onClick: e => {
                            setUpdatedRegistrations(data.filter(registration => !registration.isPaidFull))
                            setViewTableHeader(false)
                        }
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
                    ,
                    {
                        icon: TableIcons.Filter,
                        tooltip: translations[lang]['Filter'],
                        isFreeAction: true,
                        onClick: e => setFilter(filter ? false: true)
                    },
                ]}

                detailPanel={rowData => <DropdownInstallmentsTable registrationId={rowData._id} statsQuery={statsQuery} />}

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

export default ClubInstallmentsRegistrationsTable