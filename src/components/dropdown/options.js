import React from 'react'
import { NavLink } from 'react-router-dom'

const Options = ({ urls }) => {

    return (
        <ul id="dropdown-members" className="dropdown-content">
            { urls.map(url => {
                return <li>
                        {url}
                </li>
            }) }
        </ul>
    )
}

export default Options