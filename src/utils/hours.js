export const to12 = (hours) => {

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const newHours = hours.map(hour => {
        
        const formateHour = String(hour).length === 1 ?  `0${String(hour)}:00:00` : `${String(hour)}:00:00`        
        const adjustedHour = new Date('1970-01-01T' + formateHour + 'Z').toLocaleTimeString('en', { timeZone })

        return adjustedHour
    })

    return newHours
}