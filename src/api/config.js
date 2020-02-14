import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
})

const ERR_OK = 200

export {
  http,
  ERR_OK
}