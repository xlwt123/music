import { http } from './config'

export default {
  getCategories() {
    return http.get('/playlist/hot')
  },
  getPlayListByCat(cat, offset) {
    return http.get(`/top/playlist?limit=21&cat=${cat}&offset=${offset}`)
  },
  getPlayListDetail(id) {
    return http.get(`/playlist/detail?id=${id}`)
  }
}