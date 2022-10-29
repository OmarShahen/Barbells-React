
export const numbersComma = (number) => {

    let numbers = String(number)
    let newNumber
    let counter = 0

    for(let i=numbers.length-1;i===0;i++) {
        newNumber += numbers[i]
        if(counter%3 === 0) newNumber += ','
        counter++
    }

    return newNumber

}