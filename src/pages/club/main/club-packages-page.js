import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import ClubAdminSideBar from '../../../components/navigation/club-admin-side-bar'
import ClubPackagesTable from '../../../components/tables/club/club-packages'
import ClubPackageForm from '../../../components/forms/package-form'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/forms-floating-button'
import { config } from '../../../config/config'
import translations from '../../../i18n'



const MainClubPackagesPage = () => {

    const headers = { 'x-access-token': localStorage.getItem('access-token') }
    const pagePath = window.location.pathname
    const clubName = pagePath.split('/')[2]
    const clubId = pagePath.split('/')[3]

    const lang = localStorage.getItem('lang')


    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [packages, setPackages] = useState([])


    useEffect(() => {

        setIsLoading(true)

        serverRequest.get(`/packages/clubs/${clubId}`, {
            headers,
            params: { status: 'all'}
        })
        .then(response => {
            
            setIsLoading(false)

            const data = response.data
            setPackages(data.packages)    
        })
        .catch(errorResponse => {

            setIsLoading(false)

            toast.error(translations[lang]['user-error'], { position: 'top-right', duration: config.TOAST_ERROR_TIME })
        })
            

    }, [reload])



    return (
        <div className="blue-grey lighten-5">
            <ClubAdminSideBar />
            <Toaster />
            <FloatingFormButton modalId={'package-form-modal'}/>
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar pageName={translations[lang]["Packages"]}/>
                        <div className="page-main">
                            <div className="row">
                                <div className="col s12">
                                    <ClubPackagesTable 
                                    data={packages} 
                                    reload={reload}
                                    setReload={setReload}
                                    isLoading={isLoading} 
                                    isRefreshAdded={true}
                                    />
                                    <ClubPackageForm />
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainClubPackagesPage