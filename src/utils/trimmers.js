import { format } from 'date-fns'
import { translatePackageDuration } from './dates'
import translations from '../i18n'

const lang = localStorage.getItem('lang')

const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone

export const trimAttendances = (attendances) => {

    attendances.forEach(attendance => {

        attendance.attendanceTime = new Date(attendance.createdAt)
        .toLocaleTimeString('en', { timeZone: getTimeZone() })

        lang === 'en' ? 
        attendance.registrationDate = format(new Date(attendance.createdAt), 'dd MMM yyyy')
        :
        attendance.registrationDate = format(new Date(attendance.createdAt), 'dd-MM-yyyy')

        const attendanceRegistrationDate = new Date(attendance.createdAt)
        const yesterdayDate = new Date()
        yesterdayDate.setDate(yesterdayDate.getDate() - 1)

        if(attendanceRegistrationDate > yesterdayDate) {
            attendance.isNew = true
        } else {
            attendance.isNew = false
        }

    })

    return attendances
}

export const trimOffersMessages = (offersMessages) => {

    offersMessages.forEach(offerMessage => {
        lang === 'en' ? 
        offerMessage.creationDate = format(new Date(offerMessage.createdAt), 'dd MMM yyyy')
        :
        offerMessage.creationDate = format(new Date(offerMessage.createdAt), 'dd-MM-yyyy')
    })

    return offersMessages
}

export const trimPaymentsDetails = (payments) => {

    payments.forEach(payment => {
        payment.registrationDate = format(new Date(payment.createdAt), 'dd MMM yyyy')
        payment.registrationTime = new Date(payment.createdAt)
        .toLocaleTimeString('en', { timeZone: getTimeZone() })
    })

    return payments
}

export const trimStaffs = (staffs) => {

    staffs.forEach(staff => {
        lang === 'en' ? 
        staff.registrationDate = format(new Date(staff.createdAt), 'dd MMM yyyy')
        :
        staff.registrationDate = format(new Date(staff.createdAt), 'dd-MM-yyyy')
    })

    return staffs
}

export const trimStaffPayments = (staffPayments) => {

    staffPayments.forEach(staffPayment => {
        staffPayment.staff.registrationDate = format(new Date(staffPayment.staff.createdAt), 'dd MMM yyyy')
    })

    return staffPayments
}

export const trimClubPayments = (clubPayments) => {

    clubPayments.forEach(clubPayment => {
        clubPayment.club.registrationDate = format(new Date(clubPayment.club.createdAt), 'dd MMM yyyy')
    })

    return clubPayments
}

export const trimFreezedRegistrations = (freezedRegistrations) => {

    let dateFormate

    lang === 'en' ? dateFormate = 'dd MMM yyyy' : dateFormate = 'dd-MM-yyyy'

    freezedRegistrations.forEach(freezedRegistration => {

        freezedRegistration.freezedDate = format(new Date(freezedRegistration.createdAt), dateFormate)
        freezedRegistration.originalRegistrationNewExpirationDate = format(new Date(freezedRegistration.registrationNewExpirationDate), dateFormate)
        freezedRegistration.registrationReactivationDate = format(new Date(freezedRegistration.reactivationDate), dateFormate)

        /*const registrationDate = freezedRegistration.registration.createdAt ? format(new Date(freezedRegistration.registration.createdAt), dateFormate) : null
        freezedRegistration.registrationDate = registrationDate*/

        freezedRegistration.freezePeriod = translatePackageDuration(freezedRegistration.freezeDuration)

        if(!freezedRegistration.activator) {
            freezedRegistration.isFreezed = true
        } else {
            freezedRegistration.isFreezed = false
        }
            
    })

    return freezedRegistrations
}

export const trimCancelledAttendances = (cancelledAttendances) => {

    cancelledAttendances.forEach(cancelledAttendance => {
        cancelledAttendance.attendanceTime = new Date(cancelledAttendance.createdAt)
        .toLocaleTimeString('en', { timeZone: getTimeZone() })
        lang === 'en' ? 
        cancelledAttendance.cancellationDate = format(new Date(cancelledAttendance.createdAt), 'dd MMM yyyy')
        :
        cancelledAttendance.cancellationDate = format(new Date(cancelledAttendance.createdAt), 'dd-MM-yyyy')
    })

    return cancelledAttendances
}

export const trimCancelledRegistrations = (cancelledRegistrations) => {

    cancelledRegistrations.forEach(cancelledRegistration => {
        cancelledRegistration.attendanceTime = new Date(cancelledRegistration.createdAt)
        .toLocaleTimeString('en', { timeZone: getTimeZone() })   

        lang === 'en' ? 
        cancelledRegistration.cancellationDate = format(new Date(cancelledRegistration.createdAt), 'dd MMM yyyy')
        :
        cancelledRegistration.cancellationDate = format(new Date(cancelledRegistration.createdAt), 'dd-MM-yyyy')

        
    })

    return cancelledRegistrations
}

export const trimRegistrations = (registrations) => {

    registrations.forEach(registration => {

        lang === 'en' ? 
        registration.expirationDate = format(new Date(registration.expiresAt), 'dd MMM yyyy')
        :
        registration.expirationDate = format(new Date(registration.expiresAt), 'dd-MM-yyyy')

        lang === 'en' ? 
        registration.registrationDate = format(new Date(registration.createdAt), 'dd MMM yyyy')
        :
        registration.registrationDate = format(new Date(registration.createdAt), 'dd-MM-yyyy')

        registration.attendances = `${registration.attended}/${registration.package.attendance}`

        const RegistrationDate = new Date(registration.createdAt)
        const yesterdayDate = new Date()
        yesterdayDate.setDate(yesterdayDate.getDate() - 1)

        if(RegistrationDate > yesterdayDate) {
            registration.isNew = true
        } else {
            registration.isNew = false
        }

        registration.status = registration.isActive ? translations[lang]['Active'] : translations[lang]['Expired']

        
    })

    return registrations
}

export const trimMembers = (members) => {

    members.forEach(member => {

        if(member.birthYear) {
            member.age = new Date().getFullYear() - new Date(member.birthYear).getFullYear()
        } else {
            member.age = ''
        }

        member.type = translations[lang][member.gender]

        lang === 'en' ? 
        member.registrationDate = format(new Date(member.createdAt), 'dd MMM yyyy')
        :
        member.registrationDate = format(new Date(member.createdAt), 'dd-MM-yyyy')

        const memberRegistrationDate = new Date(member.createdAt)
        const yesterdayDate = new Date()
        yesterdayDate.setDate(yesterdayDate.getDate() - 1)

        if(memberRegistrationDate > yesterdayDate) {
            member.isNew = true
        } else {
            member.isNew = false
        }

        member.entrance = member.isBlocked ? translations[lang]['Blocked'] : translations[lang]['Allowed']
        member.security = member.canAuthenticate ? translations[lang]['Secure'] : translations[lang]['Insecure']
    })

    return members
}

export const trimDaysStats = (stats) => {

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    stats.forEach(statistic => statistic._id = days[new Date(statistic).getDay()])

    return stats
}

export const trimPackages = (packages) => {
    packages.forEach(packageObj => {

        lang === 'en' ? 
        packageObj.registrationDate = format(new Date(packageObj.createdAt), 'dd MMM yyyy')
        :
        packageObj.registrationDate = format(new Date(packageObj.createdAt), 'dd-MM-yyyy')

        packageObj.expiresIn = translatePackageDuration(packageObj.expiresIn)

        packageObj.registrationTime = format(new Date(packageObj.createdAt), 'HH:mm:ss')
    })

    return packages
}

export const trimClubs = (clubs) => {
    
    clubs.forEach(club => {
        lang === 'en' ? 
        club.registrationDate = format(new Date(club.createdAt), 'dd MMM yyyy')
        :
        club.registrationDate = format(new Date(club.createdAt), 'dd-MM-yyyy')
    })

    return clubs
}

export const trimChainOwners = (chainOwners) => {

    chainOwners.forEach(chainOwner => {
        chainOwner.createdAt = format(new Date(chainOwner.createdAt), 'dd MMM yyyy')
        chainOwner.branches = chainOwner.clubs.length
    })

    return chainOwners
}