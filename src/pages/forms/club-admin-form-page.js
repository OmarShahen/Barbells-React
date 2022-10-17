import React from 'react'
import NavBar from '../../components/navigation/nav-bar'
import SideBar from '../../components/navigation/side-bar'
import ClubAdminForm from '../../components/forms/club-admin-form'

const ClubAdminFormPage = () => {

    return (
        <div className="blue-grey lighten-5">
            <div className="">
                <div className="row">
                    <div className="col s12 m1 l1" style={{ padding: 0 }} >
                        <SideBar />
                    </div>
                    <div className="col s12 m11 l11" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar />
                        <div className="page-main">
                            <ClubAdminForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClubAdminFormPage