import React from 'react'
import './card.css'
import translations from '../../i18n'

const AttendancesPercentageCard = ({ attendancesPercentages, total }) => {

    const lang = localStorage.getItem('lang')

    return (
        <div className="personal-info-card card">
            <div className="personal-info-card-header">
                <h5>
                    {translations[lang]['Attendances Percentages']}
                </h5>
            </div>
            <div className="personal-info-card-body">
            { attendancesPercentages.map(attendance => {
                return <>
                    <div className="divider"></div>
                        <div className="info-wrapper">
                            <div className="" style={{ backgroundColor: attendance.color, width: '30px', height: '10px' }}>
                            </div>
                            <strong>{attendance.label}</strong>
                            <span>
                                {attendance.data}
                                { attendance.data === 1 ?  ` ${translations[lang]['Attendance']}` : ` ${translations[lang]['Attendances']}` }
                            </span>
                            <strong>
                                    {
                                        Math.round(((attendance.data / total) * 100).toFixed(2))
                                    }%
                                </strong>
                        </div>
                        </>
                          
            }) }
            </div>
        </div>
    )
}

export default AttendancesPercentageCard