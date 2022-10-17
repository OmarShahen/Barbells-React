import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/chain-owner-nav-bar'
import SideBar from '../../../components/navigation/chain-owner-side-bar'
import ClubPackagesTable from '../../../components/tables/club/club-packages'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/forms-floating-button'
import translations from '../../../i18n'
import { config } from '../../../config/config'
import ClubPackageForm from '../../../components/forms/package-form'


const MainChainOwnersPackagesPage = () => {

    const pagePath = window.location.pathname
    const ownerId = pagePath.split('/')[3]
    const lang = localStorage.getItem('lang')


    const [packages, setPackages] = useState([])
    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        setIsLoading(true)

        serverRequest.get(`/packages/chain-owners/${ownerId}`, {
            headers: {
                'x-access-token': localStorage.getItem('access-token')
            }
        })
        .then(response => {

            setIsLoading(false)

            const packages = response.data.packages

            setPackages(packages)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(translations[lang]['user-error'], { position: 'top-right', duration: config.TOAST_ERROR_TIME })

        })


    }, [reload])

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])
      

    return (
        <div className="blue-grey lighten-5">
            <SideBar />
            <Toaster />
            <FloatingFormButton modalId={'package-form-modal'}/>
            <div className="row page">
                <div className="col s12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <NavBar pageName={translations[lang]["Packages"]} />
                    <div className="page-main">
                        <ClubPackagesTable 
                        data={packages} 
                        isClub={true} 
                        reload={reload}
                        setReload={setReload}
                        isLoading={isLoading} 
                        isRefreshAdded={true}
                        />
                        <ClubPackageForm
                        isChooseClub={true} 
                        setReload={setReload} 
                        reload={reload}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainChainOwnersPackagesPage