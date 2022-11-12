

export const to12 = (hours) => {

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const newHours = hours.map(hour => {
        
        const formateHour = String(hour).length === 1 ?  `0${String(hour)}:00:00` : `${String(hour)}:00:00`        
        const adjustedHour = new Date('1970-01-01T' + formateHour + 'Z').toLocaleTimeString('en', { timeZone })

        // 8:00:00 PM
        const adjustedHourSplitted = adjustedHour.split(':')
        const periodName = adjustedHourSplitted[2].split(' ')[1]
        const periodHour = adjustedHourSplitted[0]

        return `${periodHour} ${periodName}`

    })

    return newHours
}