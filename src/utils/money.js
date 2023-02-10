export const formateMoney = (number, lang='en') => {
    return new Intl.NumberFormat(lang, { style: 'currency', currency: 'EGP' }).format(number)
}

export const getTotal = (payments, key) => {

    let total = 0
    for(let i=0;i<payments.length;i++) {
        total += payments[i][key]
    }

    return total
}

export const formateNumber = (number) => {
    return new Intl.NumberFormat().format(number)
}