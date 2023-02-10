import React from 'react'
import translations from '../../../i18n'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import DataDateShower from '../../data-date-shower'
import './date-filter.css'

const DateFilterSection = ({ statsQuery }) => {

    const lang = localStorage.getItem('lang')

    return (
        <div className="date-filter-section">
            <div className="date-picker-container">
                <span>
                    Last 7 days
                </span>
            </div>
            <div className="date-picker-container">
                <CalendarMonthOutlinedIcon />
                <span>
                    <DataDateShower statsQuery={statsQuery}/>
                </span>
            </div>
        </div>
    )
}

export default DateFilterSection