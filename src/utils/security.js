
export const isUserValid = (accessToken, user, validRoles) => {

    if(!accessToken) return false

    if(!user || !validRoles.includes(user.role)) return false

    return true
}