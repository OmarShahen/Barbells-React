export const removePhoneZero = (phone) => {

    let cleanPhone = phone
        if(phone[0] === '0') {
            cleanPhone = ''
            for(let i=1;i<phone.length;i++) {
                cleanPhone += phone[i]
            }
        }

    return cleanPhone
}