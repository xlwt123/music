import { http } from './config'

export default {
  getMvComments(id, before) {
    return http.get(`/comment/mv?id=${id}&before=${before}`)
  },
  getComments(type, id, before) {
    return http.get(`/comment/${type}?id=${id}&before=${before}`)
  }
}