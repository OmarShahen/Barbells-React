import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import TableIcons from '../table-icons'
import { serverRequest } from '../../../API/request'
import { trimPackages } from '../../../utils/trimmers'
import toast, { Toaster } from 'react-hot-toast'
import { config } from '../../../config/config'
import Options from '../../../components/dropdown/options'
import M from 'materialize-css'
import PackageNav from '../../navigation/options/package-nav'
import Modal from '../../modals/modal'
import { useNavigate } from 'react-router-dom'
import translations from '../../../i18n'


const ClubPackagesTable = ({ data, isClub, isRefreshAdded, isLoading, reload, setReload }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': JSON.parse(localStorage.getItem('access-token')) }

    const [packages, setPackages] = useState(data)
    const [updatedPackages, setUpdatedPackages] = useState([])

    const [filter, setFilter] = useState(false)

    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    
    useEffect(() => {
        const elems = document.querySelectorAll('.dropdown-trigger')
        M.Dropdown.init(elems)
    }, [])

    useEffect(() => {

        setPackages(trimPackages(data))
    }, [data])

    useEffect(() => {
        setPackages(trimPackages(updatedPackages))
    }, [updatedPackages])

    const updatePackage = async (newPackage, oldPackage) => {

        const packagesData = [...packages]  
        const packageTableId = oldPackage.tableData.id

        newPackage.price = Number.parseInt(newPackage.price)
        newPackage.attendance = Number.parseInt(newPackage.attendance)

        const periods = ['يوم', 'ايام', 'اسبوع', 'اسابيع', 'شهر', 'شهور', 'سنة']
        const expirationPeriod = newPackage.expiresIn.split(' ')[1]
        const expirationNumber = newPackage.expiresIn.split(' ')[0]

        if(periods.includes(expirationPeriod)) {
            newPackage.expiresIn = `${expirationNumber} ${translations[lang][expirationPeriod]}`
        }
                
        serverRequest.put(`/packages/${newPackage._id}`, newPackage, headers)
        .then(response => {

            const packageData = response.data.package
            packagesData[packageTableId] = packageData

            setUpdatedPackages(packagesData)
            toast.success('updated package successfully!', { position: 'top-right', duration: config.TOAST_SUCCESS_TIME })

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

    const updatePackageStatus = (packageData) => {

        const packageTableId = packageData.tableData.id
        const packagesData = [...packages]

        serverRequest.patch(`/packages/${packageData._id}`, { isOpen: !packageData.isOpen }, { headers })
        .then(response => {

            packagesData[packageTableId] = response.data.package

            setUpdatedPackages(packagesData)

            toast.success(packageData.isOpen ? 'package is disabled successfully' : 'package is enabled successfully'
                , { position: 'top-right', duration: config.TOAST_SUCCESS_TIME })
        })
        .catch(error => {
            console.error(error)     
            try {
                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: config.TOAST_ERROR_TIME })
            }
        })       
        
    }

    const deletePackage = async (packageData) => {

        const packagesData = [...packages]  
        const packageTableId = packageData.tableData.id
                
        serverRequest.delete(`/packages/${packageData._id}`, { headers })
        .then(response => {

            const filteredPackages = packagesData.filter((packageObj, index) => packageTableId !== index)

            setUpdatedPackages(filteredPackages)
            toast.success('deleted package successfully!', { position: 'top-right', duration: 3000 })

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
                { title: translations[lang]['Branch'], field: 'club.clubCode' },
                { title: translations[lang]['Title'], field: 'title' },
                { title: translations[lang]['Attendance'], field: 'attendance' },
                { title: translations[lang]['Price'], field: 'price' },
                { title: translations[lang]['Duration'], field: 'expiresIn' },
                {
                    title: translations[lang]['Statistics'], grouping: false, filtering: false, render: rowData => {
                        return <div className="app-table-stats-icon" onClick={ e => navigate(`/app/clubs/${clubId}/packages/${rowData._id}/stats`)}>
                            <i className="material-icons blue white-text"
                            >equalizer
                            </i>
                        </div>
                    }
                },
                { title: translations[lang]['Package Status'], grouping: false, filtering: false, field: 'isOpen', editable: 'never', render: rowData => {
                    return <div className="switch">
                    <label>
                      { rowData.isOpen
                       ? 
                       <input type="checkbox" onChange={() => updatePackageStatus(rowData)} checked={true} />
                        : 
                        <input type="checkbox" onChange={() => updatePackageStatus(rowData)} checked={false} />
                    }
                      <span className="lever" ></span>
                    </label>
                  </div>
                }},
                { title: translations[lang]['Registration Date'], field: 'registrationDate', editable: 'never' },
        
            ]
        } else {
            return [
                { title: translations[lang]['Title'], field: 'title' },
                { title: translations[lang]['Attendance'], field: 'attendance' },
                { title: translations[lang]['Price'], field: 'price' },
                { title: translations[lang]['Duration'], field: 'expiresIn' },
                {
                    title: translations[lang]['Statistics'], grouping: false, filtering: false, render: rowData => {
                        return <div className="app-table-stats-icon" onClick={ e => navigate(`/app/clubs/${clubId}/packages/${rowData._id}/stats`)}>
                            <i className="material-icons blue white-text"
                            >equalizer
                            </i>
                        </div>
                    }
                },
                { title: translations[lang]['Package Status'], grouping: false, filtering: false, field: 'isOpen', editable: 'never', render: rowData => {
                    return <div className="switch">
                    <label>
                      { rowData.isOpen
                       ? 
                       <input type="checkbox" onChange={() => updatePackageStatus(rowData)} checked={true} />
                        : 
                        <input type="checkbox" onChange={() => updatePackageStatus(rowData)} checked={false} />
                    }
                      <span className="lever" ></span>
                    </label>
                  </div>
                }},
                { title: translations[lang]['Registration Date'], field: 'registrationDate', editable: 'never' },

        
            ]
        }
    }

    

    return (
        <div className="table-container">
            <Toaster />
            <MaterialTable 
                title={`# ${data.length}`}
                isLoading={isLoading}
                columns={columns()}
                data={packages}
                icons={TableIcons}
                options={{ 
                    pageSize: 15,
                    pageSizeOptions: [5, 10, 20, { label: translations[lang]['All'], value: packages.length }],
                    actionsColumnIndex: -1,
                    exportButton: {
                        pdf: false,
                        csv: true
                    }, 
                    exportFileName: translations[lang]['Packages'],
                    grouping: true,
                    filtering: filter
                }}
                editable={{
                    onRowUpdate: updatePackage,
                    onRowDelete: deletePackage
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

export default ClubPackagesTable