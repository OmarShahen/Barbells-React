import React from 'react'
import './card.css'
import { formateNumber, formateMoney } from '../../utils/money'

const Card = ({ title, number, currency, sign, isMoney, icon }) => {

    return (
        <div className="stat-card white">
            <div className="stat-info">
                <div className="stat-number">
                    { isMoney ? formateMoney(number, currency) : formateNumber(number) }
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