import React, { useState, useEffect } from 'react'
import './stats-nav.css'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import { NavLink } from 'react-router-dom'
import M from 'materialize-css'
import translations from '../../i18n'

const ClubAdminStatNav = () => {

    const club = JSON.parse(localStorage.getItem('club'))

    const lang = localStorage.getItem('lang')

    const [modal, setModal] = useState()

    useEffect(() => {
        const elems = document.querySelector('#club-admin-stats-nav')
        setModal(M.Modal.init(elems))

    }, [])


    return (
        <>
        <div className="stats-nav-container">
            <div className="stats-nav-header">
                <div>
                    <span>{translations[lang]['Statistics']}</span>
                </div>
                <div className="stat-icon">
                    <span>
                        <QueryStatsIcon />
                    </span>
                </div>
            </div>
            <div className="divider"></div>
            <div className="row stats-nav-tabs-container">
                <div className="row">
                    <NavLink className="col s12 m6 stats-nav-tab modal-close" to={`/app/clubs/${club._id}/registrations/stats`}>
                        <div className="stats-nav-tab-header">
                            <ContentPasteOutlinedIcon />
                            <span>{translations[lang]['Registrations']}</span>
                        </div>
                        <div className="stats-nav-tab-body grey-text">
                            <p>
                                { lang === 'ar' ? `?????????????????? ???????????????????? ???????????????? ???????????????? ??
                                ?????????? ???????????????? ???????????????? ?????????????????????? ?????????????? ???????????????? ????????
                                ???????????? ????????????.` : `Registrations, payments, cancellation, freezing,
                                packages and staffs registrations stats and graphs all
                                combined and individual.` }
                                
                            </p>
                        </div>
                    </NavLink>
                    <NavLink className="col s12 m6 stats-nav-tab modal-close" to={`/app/clubs/${club._id}/packages/stats`}>
                        <div className="stats-nav-tab-header">
                            <AppsOutlinedIcon />
                            <span>{translations[lang]['Packages']}</span>
                        </div>
                        <div className="stats-nav-tab-body grey-text">
                            <p>
                                {
                                    lang === 'ar' ?
                                    `
                                    ???????????????? ???????????? ???????????? ???????????? ???????????? ????????????????
                                    ??????????????.`
                                    :
                                    `Packages Stats compared to other packages and the preferred 
                                    for the members.`
                                }

                            </p>
                        </div>
                    </NavLink>
                </div>
                <div className="row">
                    <NavLink to={`/app/clubs/${club._id}/members/stats`} className="col s12 m6 stats-nav-tab modal-close">
                        <div className="stats-nav-tab-header">
                            <GroupOutlinedIcon />
                            <span>{translations[lang]['Members']}</span>
                        </div>
                        <div className="stats-nav-tab-body grey-text">
                            <p>
                                {
                                    lang === 'ar' ?
                                    `
                                    ?????????????? ?????????????? ?? ?????????????? ?? ?????????????? ?????????????? ??
                                    ?????????????????????? ?????????????? ???????????????? ?????????????? ?????????????? ???????????? ????????????.`
                                    :
                                    `Members registrations, attendances, preffered packages,
                                    and profiles stats and graphs all combined and individual. `

                                }
                                
                            </p>
                        </div>
                    </NavLink>
                    <NavLink to={`/app/clubs/${club._id}/attendances/stats`} className="col s12 m6 stats-nav-tab modal-close">
                        <div className="stats-nav-tab-header">
                            <DoneAllIcon />
                            <span>{translations[lang]['Attendances']}</span>
                        </div>
                        <div className="stats-nav-tab-body grey-text">
                            <p>
                                {
                                    lang === 'ar' ? 
                                    `
                                    ?????????? ???????????? ?????????????? ??????????????
                                    ???????????????? ?????????? ???????????? ????????
                                    ???????????? ????????????.`
                                    :
                                    `Attendances hours, days, months
                                    stats and graphs all
                                    combined and individual.`
                                }
        
                            </p>
                        </div>
                    </NavLink>
                </div>
            </div>
        </div>
        </>
    )
}

export default ClubAdminStatNav