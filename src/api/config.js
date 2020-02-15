import axios from 'axios'

const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/',
  withCredentials: true
})

const ERR_OK = 200

export {
  http,
  ERR_OK
}