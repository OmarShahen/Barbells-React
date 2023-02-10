import React from 'react'
import translations from '../../../../i18n'

const DropdownSuppliersTable = ({ suppliers }) => {

    const lang = localStorage.getItem('lang')

    return <table className="striped highlight centered">
    <thead>
        <tr>
            <th>{translations[lang]['Image']}</th>
            <th>{translations[lang]['Name']}</th>
            <th>{translations[lang]['Phone']}</th>
        </tr>
    </thead>
    <tbody>
        {suppliers.map(supplier => <tr>
            <td><img src={`https://avatars.dicebear.com/api/initials/${supplier.name}.svg`} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%' }} alt="club avatar" /></td>
            <td>{supplier.name}</td>
            <td>{`+${supplier.countryCode}${supplier.phone}`}</td>
        </tr>)}
    </tbody>
</table>
            

}

export default DropdownSuppliersTable