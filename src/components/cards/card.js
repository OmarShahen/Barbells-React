import React from 'react'
import './card.css'
import CountUp from 'react-countup'


const Card = ({ title, number, color, sign, currency, icon }) => {

    return (
        <div className="stat-card white">
            <div className="stat-info">
                <div className="stat-number">
                    <CountUp end={Number.parseInt(number)} duration={2} />
                </div>
                <div className="stat-title">
                    {title}
                </div>
            </div>
            <div className="stat-icon">
                <span>
                    {icon}
                </span>
            </div>
        </div>
    )
}

export default Card