import React from 'react'
import NavBar from '../../components/navigation/nav-bar'
import SideBar from '../../components/navigation/side-bar'
import ClubPackageForm from '../../components/forms/package-form'

const ClubPackageFormPage = () => {

    return (
        <div className="blue-grey lighten-5">
            <SideBar />
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12">
                        <div className="page-main">
                            <ClubPackageForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClubPackageFormPage