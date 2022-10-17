const axios = require('axios')

export const serverRequest = axios.create({
    baseURL: 'http://localhost:5000/api/v1'
})