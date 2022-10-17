import React from 'react'

const BasicStatTable = ({ headers, data }) => {

    return (
        <table className="striped">
                    <thead>
                        <tr>
                            {
                                headers.map(header => {
                                    return <th>{header}</th>
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                    { data.map(info => {
                        return <tr> 
                                    <td>{info.title}</td>
                                        <td>
                                            {info.number}
                                            </td>
                                            <td>
                                                {info.percentage}%
                                            </td>
                                        </tr>                                    
                        }) }
                        </tbody>
                </table>
    )

}

export default BasicStatTable