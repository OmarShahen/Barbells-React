import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { trimStaffPayments } from '../../../utils/trimmers'
import PaymentIcon from '@mui/icons-material/Payment'
import translations from '../../../i18n'
import PaymentsDetaisTable from '../payments-details-table'
import { localStorageSecured } from '../../../security/localStorage'


const ClubPaymentsTable = ({ data, statsQuery, isClub, totalPayments, currency, isRefreshAdded, isLoading, reload, setReload }) => {

    const [staffPayments, setStaffPayments] = useState(trimStaffPayments(data))

    const [filter, setFilter] = useState(false)

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]
    const club = localStorageSecured.get('club')

    const lang = localStorage.getItem('lang')
    
    const columns = () => {

        if(isClub) {

            return [
                { title: translations[lang]['payments'], field: '', render: rowData => {
                    return <div className="center"><PaymentIcon color="primary" /></div>
                } },
                { title: translations[lang]['Received'], field: 'count', render: rowData => <span>{`${rowData.count} EGP`}</span> },
                { title: translations[lang]['Name'], field: 'staff.name' },
                { title: translations[lang]['Phone Code'], field: 'staff.countryCode', render: rowData => <div className="">{rowData.staff.countryCode}</div> },
                { title: translations[lang]['Phone'], field: 'staff.phone' },
                { title: translations[lang]['Mail'], field: 'staff.email' },
                { title: translations[lang]['Branch'], field: 'club.clubCode' },
                { title: translations[lang]['Role'], field: 'staff.role', editable: 'never' },
                //{ title: 'Registration Date', field: 'staff.registrationDate', editable: 'never' },
        
            ]

        } else {

            return [
                { title: translations[lang]['payments'], field: '', render: rowData => {
                    return <div className="center"><PaymentIcon color="primary" /></div>
                } },
                { title: translations[lang]['Received'], field: 'count', render: rowData => <span>{`${rowData.count} EGP`}</span> },
                { title: translations[lang]['Name'], field: 'staff.name' },
                { title: translations[lang]['Phone Code'], field: 'staff.countryCode', render: rowData => <div className="">{rowData.staff.countryCode}</div> },
                { title: translations[lang]['Phone'], field: 'staff.phone' },
                { title: translations[lang]['Mail'], field: 'staff.email' },
                { title: translations[lang]['Role'], field: 'staff.role', editable: 'never' },
                //{ title: 'Registration Date', field: 'staff.registrationDate', editable: 'never' },
        
            ]
        }
    }
    

    useEffect(() => {
        setStaffPayments(trimStaffPayments(data))
    }, [data])


    return (
        <div className="table-container">
            <MaterialTable 
                title={<div><strong>{totalPayments}</strong> <span>{currency}</span></div>}
                isLoading={isLoading}
                columns={columns()}
                data={staffPayments}
                icons={TableIcons}
                options={{ 
                    pageSize: 15, 
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: staffPayments.length }],
                    actionsColumnIndex: -1,
                    exportButton: {
                        pdf: false,
                        csv: true
                    }, 
                    exportFileName: translations[lang]['Payments'],
                    grouping: true,
                    filtering: filter
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

                detailPanel={rowData => { return <div style={{ display: 'flex', justifyContent: 'center'}}>                    
                    <PaymentsDetaisTable staffId={rowData._id} statsQuery={statsQuery} currency={'EGP'} />
                </div>}}

                localization={ lang === 'ar' ? {
                    body: {
                        emptyDataSourceMessage: '???? ???????? ??????????',
                        editRow: {
                            deleteText: '???? ?????? ?????????? ???? ??????????',
                            cancelTooltip: '??????????',
                            saveTooltip: '????????'
                        },

                        editTooltip: '??????????',
                        deleteTooltip: '??????'
                    },
                    grouping: {
                        placeholder: '???????? ???????????????? ?????? ??????????????',
                        groupedBy: '???????????? ????'
                    },
                    header: {
                        actions: ''
                    },
                    toolbar: {
                        exportTitle: '??????????',
                        exportAriaLabel: '??????????',
                        searchTooltip: '??????',
                        searchPlaceholder: '??????',
                        exportCSVName: '?????????? ??????????????'
                    },
                    pagination: {
                        labelRowsSelect: '??????????',
                        labelRowsPerPage: '?????? ????????????',
                        firstAriaLabel: '???????????? ????????????',
                        firstTooltip: '???????????? ????????????',
                        previousAriaLabel: '???????????? ??????????????',
                        previousTooltip: '???????????? ??????????????',
                        nextAriaLabel: '???????????? ??????????????',
                        nextTooltip: '???????????? ??????????????',
                        lastAriaLabel: '???????????? ??????????????',
                        lastTooltip: '???????????? ??????????????',
                    }

                }
                : {}
                }
            
            />
        </div>
    )

}

export default ClubPaymentsTable