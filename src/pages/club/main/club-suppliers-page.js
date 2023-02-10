import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import ClubSuppliersTable from '../../../components/tables/club/club-suppliers'
import ClubSupplierForm from '../../../components/forms/supplier-form'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/forms-floating-button'
import { config } from '../../../config/config'
import translations from '../../../i18n'
import { useNavigate } from 'react-router-dom'
import { isUserValid } from '../../../utils/security'
import { localStorageSecured } from '../../../security/localStorage'
import { useSelector } from 'react-redux'
import PageHeader from '../../../components/sections/headers/page-header'


const MainClubSuppliersPage = ({ roles }) => {

    const navigate = useNavigate()

    const headers = { 'x-access-token': localStorageSecured.get('access-token') }
    const pagePath = window.location.pathname
    const clubId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')
    const user = useSelector(state => state.user.user)
    const accessToken = localStorageSecured.get('access-token')

    const [authorized, setAuthorized] = useState(false)
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [suppliers, setSuppliers] = useState([])

    useEffect(() => {

        if(!isUserValid(accessToken, user, roles)) {
            setAuthorized(false)
            navigate('/clubs-admins/login')
        } else {
            setAuthorized(true)
        }
    }, [])

    useEffect(() => {

        setIsLoading(true)

        serverRequest.get(`/v1/suppliers/clubs/${clubId}`, {
            headers,
        })
        .then(response => {
            
            setIsLoading(false)

            const data = response.data
            setSuppliers(data.suppliers)    
        })
        .catch(errorResponse => {

            setIsLoading(false)
            toast.error(translations[lang]['user-error'], { position: 'top-right', duration: config.TOAST_ERROR_TIME })
        })
            

    }, [reload])



    return (
        <>
        {
            authorized
            &&
            <div className="blue-grey lighten-5">
            <Toaster />
            <FloatingFormButton modalId={'supplier-form-modal'}/>
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar pageName={translations[lang]['Suppliers']}/>
                        <div className="page-main">
                        <PageHeader pageName="Suppliers" reload={reload} setReload={setReload} />
                            <div className="row">
                                <div className="col s12">
                                    <ClubSuppliersTable 
                                    data={suppliers} 
                                    reload={reload}
                                    setReload={setReload}
                                    isLoading={isLoading} 
                                    isRefreshAdded={true}
                                    />
                                    <ClubSupplierForm reload={reload} setReload={setReload}/>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
        </div>
        }
        </>
    )
}

export default MainClubSuppliersPage