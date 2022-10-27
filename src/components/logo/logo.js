import React from 'react'
import AppLogo from '../../images/logo.png'

const Logo = ({ width, height }) => {

    return (
        <>
            <img src={AppLogo} style={{ width, height }} alt="Logo" />
        </>
    )
}

export default Logo