import React from 'react'
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined'
const FloatingFormButton = () => {

    return (
        <div className="fixed-action-btn">
            <a href="#stat-date-picker-form" className="btn-floating btn-large modal-trigger" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'dodgerblue'
            }}>
                <QueryStatsOutlinedIcon style={{ fontSize: '2rem' }} />
            </a>
            
        </div>
    )
}

export default FloatingFormButton