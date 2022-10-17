import React from 'react'
import NavBar from '../../components/navigation/nav-bar'
import SideBar from '../../components/navigation/side-bar'
import ChainOwnerForm from '../../components/forms/chain-owner-form'

const ChainOwnerFormPage = () => {

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
                            <ChainOwnerForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChainOwnerFormPage