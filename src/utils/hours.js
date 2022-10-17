export const to12 = (hours) => {

    const newHours = hours.map(hour => {
        if(hour === 0) {
            return `12 am`
        } else if(hour === 12) {
            return `12 pm`
        }
        else if(hour > 12) {
            return `${(hour%12)} pm`
        } else {
            return `${hour} am`
        }
    })

    return newHours
}