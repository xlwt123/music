import { http } from './config'

export default {
  getBanner() {
    return http.get('/banner?type=1')
  },
  getPlayList() {
    return http.get('/personalized?limit=6')
  },
  getNewSong() {
    return http.get('/personalized/newsong')
  }
}