import { http } from './config'

export default {
  getTopListDetail() {
    return http.get('/toplist/detail')
  }
}