import React from 'react'
import './card.css'
import translations from '../../i18n'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'

const PackageInfoCard = ({ packageObj }) => {

    const lang = localStorage.getItem('lang')

    return (
        <div className="personal-info-card">
            <div className="personal-info-card-header">
                <h5>
                    {translations[lang]['Package Info']}
                </h5>
                <div className="stat-icon">
                    <span>
                        <AppsOutlinedIcon />
                    </span>
                </div>
            </div>
            <div className="divider"></div>
            <div className="personal-info-card-body">
                <div className="info-wrapper">
                    <strong>{translations[lang]['Title']}</strong>
                    <span>{packageObj.title}</span>
                </div>
                <div className="divider"></div>
                <div className="info-wrapper">
                    <strong>{translations[lang]['Duration']}</strong>
                    <span>{packageObj.expiresIn}</span>
                </div>
                <div className="divider"></div>
                <div className="info-wrapper">
                    <strong>{translations[lang]['Attendance']}</strong>
                    <span>{packageObj.attendance}</span>
                </div>
                <div className="divider"></div>
                <div className="info-wrapper">
                    <strong>{translations[lang]['Price']}</strong>
                    <span>{packageObj.price}</span>
                </div>
                <div className="divider"></div>
                <div className="info-wrapper">
                    <strong>{translations[lang]['Status']}</strong>
                    <span>{packageObj.isOpen ? <span className="green-text">{translations[lang]['Opened']}</span> : <span className="red-text">{translations[lang]['Closed']}</span>}</span>
                </div>
            </div>
        </div>
    )
}

export default PackageInfoCard