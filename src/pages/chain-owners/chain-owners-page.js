import React, { useState, useEffect } from 'react'
import NavBar from '../../components/navigation/chain-owner-nav-bar'
import SideBar from '../../components/navigation/chain-owner-side-bar'
import ChainOwnersTable from '../../components/tables/chain-owner/chain-owners-table'
import { serverRequest } from '../../API/request'
import { format } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'
import ChainOwnerForm from '../../components/forms/chain-owner-form'
import FloatingFormButton from '../../components/buttons/forms-floating-button'



const ChainOwnersPage = () => {

    const [chainOwners, setChainOwners] = useState([])

    useEffect(() => {

        toast.promise(
            serverRequest.get(`/chain-owners`, {
                headers: {
                    'x-access-token': localStorage.getItem('access-token')
                }
            })
            .then(response => {
    
                const chainOwners = response.data.chainOwners
                
                chainOwners.forEach(chainOwner => {
                    chainOwner.createdAt = format(new Date(chainOwner.createdAt), 'dd MMM yyyy')
                    chainOwner.phone = chainOwner.countryCode + chainOwner.phone
                    chainOwner.branches = chainOwner.clubs.length
                })
    
                setChainOwners(chainOwners)
            })
            .catch(error => {
                console.error(error)
            })
            ,
            {
                loading: <strong>Getting your data from the cloud</strong>,
                success: <strong>Staffs data loaded successfully</strong>,
                error: <strong>Error loading your staffs data</strong>
            },
            {
                position: 'top-right',
                duration: 5000
            }
        )


    }, [])

    return (
        <div className="blue-grey lighten-5">
            <SideBar />
            <Toaster />
            <FloatingFormButton modalId={"chain-owner-form"}/>
            <div className="row page">
                <div className="col s12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <NavBar />
                    <div className="page-main">
                        <ChainOwnersTable data={chainOwners} />
                        <ChainOwnerForm />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChainOwnersPage