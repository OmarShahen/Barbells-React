import React from 'react'
import './card.css'
import { iconPicker } from '../../utils/icon-finder'
import translations from '../../i18n'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'

const PersonalInfoCard = ({ member }) => {

    const lang = localStorage.getItem('lang')

    return (
        <div className="personal-info-card">
            <div className="personal-info-card-header">
                <h5>
                    {translations[lang]['Member Info']}
                </h5>
                <div className="stat-icon">
                <span>
                    <GroupOutlinedIcon />
                </span>
            </div>
            </div>
            <div className="divider"></div>
            <div className="personal-info-card-body">
                <div className="info-wrapper">
                    <strong>{translations[lang]['Name']}</strong>
                    <span>{member.name}</span>
                </div>
                <div className="divider"></div>
                <div className="info-wrapper">
                    <strong>{translations[lang]['Email']}</strong>
                    <span>{member.email}</span>
                </div>
                <div className="divider"></div>
                <div className="info-wrapper">
                    <strong>{translations[lang]['Phone']}</strong>
                    <span>{member.phone}</span>
                </div>
                <div className="divider"></div>
                <div className="info-wrapper">
                    <strong>{translations[lang]['Country Code']}</strong>
                    <span>{member.countryCode}</span>
                </div>
                <div className="divider"></div>
                <div className="info-wrapper">
                    <strong>{translations[lang]['Gender']}</strong>
                    <span>{member.gender}</span>
                </div>
                <div className="divider"></div>
                <div className="info-wrapper">
                    <strong>{translations[lang]['Age']}</strong>
                    <span>{member.age}</span>
                </div>
                <div className="divider"></div>
                <div className="info-wrapper">
                    <strong>{translations[lang]['Account Status']}</strong>
                    <span>{member.isBlocked ? 
                    <span className="red-text">{translations[lang]['Blocked']}</span> 
                    : 
                    <span className="green-text">{translations[lang]['Active']}</span>}</span>
                </div>
                <div className="divider"></div>
                <div className="info-wrapper">
                    <strong>{translations[lang]['Account Security']}</strong>
                    <span>{member.canAuthenticate ? 
                    <span className="green-text">{translations[lang]['Activated']}</span> 
                    : 
                    <span className="grey-text">{translations[lang]['Disabled']}</span> }</span>
                </div>
            </div>
        </div>
    )
}

export default PersonalInfoCard