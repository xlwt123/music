import { http } from './config'

export default {
  getLyric(id) {
    return http.get(`/lyric?id=${id}`)
  },
  getSongUrl(idList) {
    return http.get(`/song/url/?id=${idList}`)
  }
}