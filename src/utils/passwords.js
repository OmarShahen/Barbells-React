
export const checkPasswordStrength = (password, checkMixed=true) => {

    if(password.length < 8 || password.length > 36) {
        return { isAccepted: false, message: 'Password must contain between 8 to 36 characters', strength: 'poor' }
    }

    if(checkMixed) {

        const isMixed = checkMixedCaseLetters(password)
        if(!isMixed) {
            return { isAccepted: false, message: 'Password must contain mixed-case letter', strength: 'weak' }
        } 
    }

    const numberValidation = checkNumber(password)

    if(!numberValidation) return { isAccepted: false, message: 'Password must contain at least one number', strength: 'weak' }

    return { isAccepted: true, message: 'Valid password', strength: 'good' }

}

const checkMixedCaseLetters = (password) => {

    let foundUpper = false
    let foundLower = false

    for(let i=0;i<password.length;i++) {
        if(password[i] === password[i].toUpperCase()) {
            foundUpper = true
        }

        if(password[i] === password[i].toLowerCase()) {
            foundLower = true
        }
    }

    if(!foundUpper || !foundLower) {
        return false
    }

    return true
}

const checkNumber = (password) => {

    const numbers = '0123456789'

    for(let i=0;i<password.length;i++) {
        for(let j=0;j<numbers.length;j++) {
            if(password[i] === numbers[j]) {
                return true
            }
        }
    }

    return false
}