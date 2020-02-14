import { http } from './config'

export default {
  getHotKey() {
    return http.get('/search/hot')
  },
  getMultimatch(keyword) {
    return http.get(`/search/multimatch?keywords=${keyword}`)
  },
  getSearch(keyword, offset) {
    return http.get(`/search?keywords=${keyword}&offset=${offset}`)
  }
}