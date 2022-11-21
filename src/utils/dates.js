import { format, formatRelative, subDays } from 'date-fns'
import translations from '../i18n'

const lang = localStorage.getItem('lang')

export const formateDates = list => {

    for(let i=0;i<list.length;i++) {

        const creationDate = new Date(list[i]['createdAt'])

        list[i]['createdAt'] = format(creationDate, 'd MMM yyyy')
    }

    return list
}

export const translatePackageDuration = (duration) => {

    try {

        const splittedDuration = duration.split(' ')
        const durationNumber = splittedDuration[0]
        const durationName = splittedDuration[1]

        return `${durationNumber} ${translations[lang][durationName]}`

    } catch(error) {
        console.error(error)
        return translations[lang]['No Date']
    }
}