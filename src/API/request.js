const axios = require('axios')

const DEV_URL = 'http://localhost:5000/api'
const PROD_URL = 'https://barbells-eg.co/api'

export const serverRequest = axios.create({
    baseURL: PROD_URL
})