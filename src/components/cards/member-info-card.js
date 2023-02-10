import React from 'react'
import translations from '../../i18n'
import { format } from 'date-fns'

const MemberInfoCard = ({ memberData }) => {

    const lang = localStorage.getItem('lang')


    return <div className="member-info-card-container white">
        <h6>
            {memberData.name}
        </h6>
        <div className="center image-container">
            <img src={`https://avatars.dicebear.com/api/initials/${memberData.name}.svg`} style={{ width: '5rem', height: '5rem', borderRadius: '50%' }} alt="club avatar" />
        </div>
        <div>
            <ul>
                <li>
                    <strong>{translations[lang]['Name']}</strong>
                    <span>{memberData.name}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Email']}</strong>
                    <span>{memberData.email ? memberData.email : translations[lang]['Not Registered']}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Phone']}</strong>
                    {
                        memberData.phone ?
                        <span>{'+' + memberData.countryCode + memberData.phone}</span>
                        :
                        '+11111111'
                    }
                    
                </li>
                <li>
                    <strong>{translations[lang]['Gender']}</strong>
                    <span>{memberData.gender}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Age']}</strong>
                    <span>{memberData.age}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Address']}</strong>
                    <span>{memberData.address ? memberData.address : translations[lang]['Not Registered']}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Job']}</strong>
                    <span>{memberData.job ? memberData.job : translations[lang]['Not Registered']}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Sport Type']}</strong>
                    <span>{memberData.sportType ? memberData.sportType : translations[lang]['Not Registered']}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Secure']}</strong>
                    {
                    memberData.canAuthenticate ? 
                    <span className="green-text">{translations[lang]['Secure']}</span> 
                    : 
                    <span className="red-text">{translations[lang]['Insecure']}</span> }
                </li>
                <li>
                    <strong>{translations[lang]['Account Status']}</strong>
                    {memberData.isBlocked ? <span className="red-text">{translations[lang]['Blocked']}</span> : <span className="green-text">{translations[lang]['Active']}</span>}
                </li>
                <li>
                    <strong>{translations[lang]['Blacklist']}</strong>
                    {memberData.isBlacklist ? <span className="red-text">{translations[lang]['In Blacklist']}</span> : <span className="green-text">{translations[lang]['Clean']}</span> }
                </li>
                <li>
                    <strong>{translations[lang]['Registration Date']}</strong>
                    <span>
                        {
                            memberData.createdAt ?
                            lang === 'en' ? format(new Date(memberData.createdAt), 'dd MMM yyyy') : format(new Date(memberData.createdAt), 'dd-MM-yyyy')
                            :
                            null
                        }
                    </span>
                </li>
            </ul>
            
        </div>
    </div>
}


export default MemberInfoCard