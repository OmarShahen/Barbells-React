import React from 'react'
import translations from '../i18n'

const DataDateShower = ({statsQuery}) => {

    const lang = localStorage.getItem('lang')
    
    const dateFormatter = () => {

        const { specific, to, from, until } = statsQuery

        if(specific) {
            return <>
                <span>{specific}</span>
            </>
        } else if(until) {
            return <>
                <span>{`${translations[lang]['until']}`}: {until}</span>
            </>
        } else if(to && from) {
            return <>
                <span style={{ paddingRight: '.3rem' }}>{`${translations[lang]['from']}`}: {from} </span>
                <span> {`${translations[lang]['to']}`}: {to}</span>
            </>
        }
    }

    return <>
        {dateFormatter()}
    </>
}

export default DataDateShower