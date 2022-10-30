const axios = require('axios')

const DEV_URL = 'http://localhost:5000/api/v1'
const PROD_URL = 'http://159.223.172.150/api/v1'

export const serverRequest = axios.create({
    baseURL: PROD_URL
})