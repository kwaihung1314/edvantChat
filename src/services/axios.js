import axios from 'axios'

let instance = axios.create({
  baseURL: process.env.API_BASE,
  timeout: 10000
})

export default instance
