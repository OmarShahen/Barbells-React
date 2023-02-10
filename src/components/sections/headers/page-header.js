import React from 'react'
import translations from '../../../i18n'
import CachedIcon from '@mui/icons-material/Cached'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import './page-header.css'
import DataDateShower from '../../data-date-shower'


const PageHeader = ({ pageName, reload, setReload, statsQuery }) => {

    const lang = localStorage.getItem('lang')

    return (
        <div className="page-body-header">
            <h5>
                {translations[lang][pageName]}
            </h5>
            <div className="header-icon-container">
            <a href="#stat-date-picker-form" className="modal-trigger">
                    <div className="reload-icon">
                        <CalendarMonthOutlinedIcon />
                    </div>
                </a> 
                {<div className="reload-icon" onClick={e => setReload(reload + 1)}>
                    <FilterAltOutlinedIcon /> 
                </div>}
                <div className="reload-icon" onClick={e => setReload(reload + 1)}>
                    <CachedIcon /> 
                </div>
            </div>
        </div>
    )
}

export default PageHeader