import React from 'react'
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined'
import AddIcon from '@mui/icons-material/Add';

const NestedFloatingButton = ({ addFormId, statsQueryFormId}) => {

    return <div class="fixed-action-btn">
        <a class="btn-floating btn-large blue">
            <i class="large material-icons">mode_edit</i>
        </a>
        <ul>
            <li>
                <a href={`#${addFormId}`} className="btn-floating btn-large modal-trigger teal" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <AddIcon style={{ fontSize: '2rem' }} />
                </a>
            </li>
            <li>
                <a href={`#${statsQueryFormId}`} className="btn-floating btn-large modal-trigger purple" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <QueryStatsOutlinedIcon style={{ fontSize: '2rem' }} />
                </a>
            </li>
        </ul>
  </div>
}

export default NestedFloatingButton