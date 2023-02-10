import translations from '../../../../i18n'
import { formateMoney, formateNumber } from '../../../../utils/money'

const DropdownItemsTable = ({ items }) => {

    const lang = localStorage.getItem('lang')

    return <table className="striped highlight centered">
    <thead>
        <tr>
            <th>{translations[lang]['Name']}</th>
            <th>{translations[lang]['Amount']}</th>
            <th>{translations[lang]['Price']}</th>
            <th>{translations[lang]['Initial Stock']}</th>
        </tr>
    </thead>
    <tbody>
        {items.map(item => <tr>
            <td>{item.name}</td>
            <td>{formateNumber(item.inStock)}</td>
            <td>{formateMoney(item.price, lang)}</td>
            <td>{formateNumber(item.initialStock)}</td>
        </tr>)}
    </tbody>
</table>
            

}

export default DropdownItemsTable