import React from 'react'
import './card.css'
import translations from '../../i18n'
import { formateMoney, formateNumber } from '../../utils/money'

const PercentagesCard = ({ category, dataOf, percentOf, percentages, total }) => {

    const lang = localStorage.getItem('lang')

    return (
                <table className="striped">
                    <thead>
                        <tr>
                            <th>{category}</th>
                            <th>{dataOf} #</th>
                            <th>{translations[lang]['Percentages']} %</th>
                        </tr>
                    </thead>
                    <tbody>
                    { percentages.map(percentage => {
                        return <tr> 
                                    <td>{percentage.label}</td>
                                        <td>
                                            {percentOf ? formateNumber(percentage.data) : formateMoney(percentage.data, lang)}
                                                { percentage.data === 1 ?
                                                ` ${percentOf ? translations[lang][percentOf] : ''}` 
                                                : 
                                                ` ${percentOf ? translations[lang][percentOf + 's'] : ''}` }
                                            </td>
                                            <td>
                                                {
                                                    ((percentage.data / total) * 100).toFixed(2)
                                                }%
                                            </td>
                                        </tr>                                    
                        }) }
                        </tbody>
                </table>
    )
}

export default PercentagesCard