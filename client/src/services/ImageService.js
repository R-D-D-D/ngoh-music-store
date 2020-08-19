import Api from '@/services/Api'

export default {
  list (productId) {
    return Api().get(`image/list?pid=${productId}`)
  },

  create (imageInfo) {
    return Api().post('image/new', imageInfo)
  },

  delete (imageId) {
    return Api().delete(`image/del?iid=${imageId}`)
  }
}
