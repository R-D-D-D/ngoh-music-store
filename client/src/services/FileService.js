import Api from '@/services/Api'

export default {
  list (productId) {
    return Api().get(`file/list?pid=${productId}`)
  },

  create (fileInfo) {
    return Api().post('file/new', fileInfo)
  },

  delete (fileId) {
    return Api().delete(`file/del?fid=${fileId}`)
  }
}
