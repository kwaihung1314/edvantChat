import axios from 'axios'

let instance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000
})

export default instance
