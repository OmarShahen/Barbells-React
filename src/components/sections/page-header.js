import React from 'react'
import translations from '../../i18n'
import CachedIcon from '@mui/icons-material/Cached'

const PageHeader = ({ pageName, reload, setReload }) => {

    const lang = localStorage.getItem('lang')

    return (
        <div className="page-body-header">
            <h5>
                {translations[lang][pageName]}
            </h5>
            <div className="header-icon-container">
                
                <div className="reload-icon" onClick={e => setReload(reload + 1)}>
                    <CachedIcon /> 
                </div>
            </div>
        </div>
    )
}

export default PageHeader