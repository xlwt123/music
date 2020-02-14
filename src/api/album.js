import { http } from './config'

export default {
  getAlbum(id) {
    return http.get(`/album?id=${id}`)
  }
}