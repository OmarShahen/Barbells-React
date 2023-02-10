import React from 'react'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'

const PaymentCategoryDescriptionSection = () => {
    return <div className="payment-section">
    <h5>
        Category Descriptions
    </h5>
    <div className="row">
        <div className="col s12 payment-section-form">
            <div className="input-field input-field-container col s12">
                <input 
                    type="text"                                                     
                    id="package-duration-number" 
                    /> 
                    <label for="package-duration-number">Category Description</label>
                </div>
                <div className="col s12">
                    <button className="btn blue">
                        Add
                    </button>
                </div>
        </div>
        <div className="col s12 limit-table">
        <table className="highlight centered">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        Supplements
                    </td>
                    <td>
                        <DeleteOutlineOutlinedIcon />
                    </td>
                </tr>
                <tr>
                    <td>
                        Supplements
                    </td>
                    <td>
                        <DeleteOutlineOutlinedIcon />
                    </td>
                </tr>
                <tr>
                    <td>
                        Supplements
                    </td>
                    <td>
                        <DeleteOutlineOutlinedIcon />
                    </td>
                </tr>
                <tr>
                    <td>
                        Supplements
                    </td>
                    <td>
                        <DeleteOutlineOutlinedIcon />
                    </td>
                </tr>
            </tbody>
    </table>
        </div>
    </div>
    </div>
}

export default PaymentCategoryDescriptionSection