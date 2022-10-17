import React, { useState, useEffect } from 'react'
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css'
import './form.css'
import CircularLoadingButton from '../buttons/loading-button'
import translations from '../../i18n'

const StatDatePicker = ({ setStatQuery, loading }) => {

    const [statDateType, SetStatDateType] = useState('SPECIFIC')

    const [specificDate, setSpecificDate] = useState()

    const [untilDate, setUntilDate] = useState()

    const [fromDate, setFromDate] = useState()
    const [toDate, setToDate] = useState()

    const lang = localStorage.getItem('lang')


    const submitForm = () => {

        let query = {}

        if(statDateType === 'SPECIFIC') {
            query = { specific: specificDate }
        } else if(statDateType === 'UNTIL') {
            query = { until: untilDate }
        } else if(statDateType === 'FROMTO') {
            query = {from: fromDate, to: toDate }
        }

        setStatQuery(query)
                
    }

    useEffect(() => {
        M.AutoInit()
    }, [])

    return (
        <div>
            <div id="stat-date-picker-form" className="modal">
            <div className="modal-content">
                    <div className="header-icon">
                    <h4>{translations[lang]['Stats Date Range']}</h4>
                    <i className="medium material-icons white-text blue" style={{ borderRadius: '10px' }}>equalizer</i>
                </div>
                <div className="divider"></div>
                <div className="row input-fields-container">
                <div className="input-field col s12 m7">
                <select 
                onChange={e => SetStatDateType(e.target.value)} 
                >
                    <option value="UNTIL">{translations[lang]['Until Date']}</option>
                    <option value="FROMTO">{translations[lang]['From Date To Date']}</option>
                    <option value="SPECIFIC" selected>{translations[lang]['Specific Date']}</option>
                </select>
                <label>{translations[lang]['Stats Date Range Type']}</label>
                </div>
                    {
                        statDateType === 'SPECIFIC'
                        ?
                        <div className="input-field col s12 m7">
                            <input type="date" onChange={e => setSpecificDate(e.target.value)} />
                            <label> {translations[lang]['Stats Of Specific Date']}</label>
                        </div>
                        :
                        null
                    }
                    {
                        statDateType === 'UNTIL'
                        ?
                        <div className="input-field col s12 m7">
                            <input type="date" onChange={e => setUntilDate(e.target.value)} />
                            <label> {translations[lang]['Stats Until Date']}</label>
                        </div>
                        :
                        null
                    }
                    {
                        statDateType === 'FROMTO'
                        ?
                        <div className="row">
                            <div className="input-field col s12 m7">
                                <input type="date" onChange={e => setFromDate(e.target.value)} />
                                <label> {translations[lang]['Stats From Date']}</label>
                            </div>
                            <div className="input-field col s12 m7">
                                <input type="date" onChange={e => setToDate(e.target.value)} />
                                <label> {translations[lang]['Stats To Date']}</label>
                            </div>
                        </div>
                        :
                        null
                    }

                    <div className="col s12">
                        <button 
                        onClick={e => submitForm()}
                        className="btn blue modal-close" 
                        style={{ marginRight: '1rem' }}
                        >{translations[lang]['SUBMIT']} </button>
                        <button className="modal-close btn grey darken-1">{translations[lang]['CLOSE']}</button>
                    </div>
                </div>
                
            </div>

            </div>
        </div>

    )
}

export default StatDatePicker