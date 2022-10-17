import React from 'react'
import './card.css'
import { iconPicker } from '../../utils/icon-finder'
import translations from '../../i18n'

const PackagesPercentageCard = ({ packagesPercentages, total }) => {

    const lang = localStorage.getItem('lang')

    return (
        <div className="personal-info-card card">
            <div className="personal-info-card-header">
                <h5>
                    {translations[lang]['Packages Percentages']}
                </h5>
            </div>
            <div className="personal-info-card-body">
            { packagesPercentages.map(packageObj => {
                return <>
                    <div className="divider"></div>
                        <div className="info-wrapper">
                            <div className="" style={{ backgroundColor: packageObj.color, width: '30px', height: '10px' }}>
                            </div>
                            <strong>{packageObj.label}</strong>
                            <span>
                                {packageObj.data}
                                { packageObj.data === 1 ?  ` ${translations[lang]['Registration']}` : ` ${translations[lang]['Registrations']}` }
                            </span>
                            <strong>
                                    {
                                        Math.round(((packageObj.data / total) * 100).toFixed(2))
                                    }%
                                </strong>
                        </div>
                        </>
                          
            }) }
            </div>
        </div>
    )
}

export default PackagesPercentageCard