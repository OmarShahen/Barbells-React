const axios = require('axios')

const DEV_URL = 'http://localhost:5000/api/v1'
const PROD_URL = 'https://barbells-eg.co/api/v1'

export const serverRequest = axios.create({
    baseURL: DEV_URL
})