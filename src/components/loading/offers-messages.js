import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'
import './loading.css'
import translations from '../../i18n'

const SendOfferMessage = ({ members, setMembers, setMode }) => {

    const lang = localStorage.getItem('lang')

    return <>
    <div className="send-offer-message-container">
        <ArrowCircleLeftIcon className="back-btn" onClick={e => {
            setMembers([])
            setMode('VIEW')
        }} />
        { members.map(member => {
            return <div className="send-offer-message-row">
            <div className="row-info">
                <img src={`https://avatars.dicebear.com/api/initials/${member.name}.svg`} alt="image" style={{ marginRight: '1rem', width: '3rem', height: '3rem', borderRadius: '50%' }} />

                <div className="description">
                    <strong>{member.name}</strong>
                    <p className="grey-text">
                        {
                            member.sent ?
                            translations[lang]['Member received offer message successfully'] :
                            translations[lang]['There was an error sending offer message']
                        }
                    </p>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {
                    member.sent ?
                    <CheckCircleIcon className="green-text" style={{ fontSize: '2rem' }} />
                    :
                    <ErrorIcon className="red-text" style={{ fontSize: '2rem' }} />
                }
            </div>
        </div>
        })}
    </div>
    </>
}

export default SendOfferMessage