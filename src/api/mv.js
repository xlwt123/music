import { http } from './config'

export default {
  getMvList(offset) {
    return http.get(`/mv/all?offset=${offset}&limit=10`)
  },
  getMvdetail(id) {
    return http.get(`/mv/detail?mvid=${id}`)
  },
  getMvUrl(id) {
    return http.get(`/mv/url?id=${id}`)
  },
  getSimilarMv(id) {
    return http.get(`/simi/mv?mvid=${id}`)
  }
}