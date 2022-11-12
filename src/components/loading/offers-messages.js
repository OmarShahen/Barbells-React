import React from 'react'
import CircularLoadingButton from '../buttons/loading-button'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const SendOfferMessage = ({ members }) => {

    return <>
    <div className="send-offer-message-container">
        { members.map(member => {
            return <div className="send-offer-message-row">
            <div className="row-info">
                <img src={`https://avatars.dicebear.com/api/initials/${member.name}.svg`} alt="image" style={{ marginRight: '1rem', width: '3rem', height: '3rem', borderRadius: '50%' }} />

                <div className="description">
                    <strong>{member.name}</strong>
                    <p className="grey-text">Waiting his fooking turn</p>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircleIcon className="green-text" style={{ color: 'success', fontSize: '2rem' }} />
            </div>
        </div>
        })}
    </div>
    </>
}

export default SendOfferMessage