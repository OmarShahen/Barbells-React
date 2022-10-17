import React from 'react'
import './card.css'
import translations from '../../i18n'

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
                                            {percentage.data}
                                                { percentage.data === 1 ?  ` ${translations[lang][percentOf]}` : ` ${translations[lang][percentOf + 's']}` }
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