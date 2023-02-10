import React from 'react'
import { format } from 'date-fns'
import translations from '../../../../i18n'

const NotesTable = ({ notes }) => {

    const lang = localStorage.getItem('lang')


    return <table className="highlight centered responsive-table striped">
    <thead>
        <tr>
            <th>{translations[lang]['Image']}</th>
            <th>{translations[lang]['Staff']}</th>
            <th>{translations[lang]['Note']}</th>
            <th>{translations[lang]['Creation Date']}</th>
        </tr>
    </thead>
    <tbody>
        {notes.map(note => <tr>
            <td>
                <img src={`https://avatars.dicebear.com/api/initials/${note.noteMaker}.svg`} style={{ width: '3rem', height: '3rem', borderRadius: '50%' }} alt="club avatar" />
            </td>
            <td>{note.noteMaker}</td>
            <td>{note.note}</td>
            <td>{
            lang === 'en' ? format(new Date(note.createdAt), 'dd MMM yyyy') : format(new Date(note.createdAt), 'dd-MM-yyyy')
            }</td>
            
        </tr>)}
    </tbody>
</table>
            
}

export default NotesTable