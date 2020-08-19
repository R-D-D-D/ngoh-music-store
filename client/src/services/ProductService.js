import Api from '@/services/Api'

export default {
  create (productInfo) {
    return Api().post('product/new', productInfo)
  },

  list (categoryId) {
    return Api().get(`product/list?cid=${categoryId}`)
  },

  search (value) {
    return Api().get(`product/listall?search=${value}`)
  },

  show (pid) {
    return Api().get(`product/show?pid=${pid}`)
  },

  edit (productInfo) {
    return Api().put('product/edit', productInfo)
  },

  delete (productId) {
    return Api().delete(`product/del?pid=${productId}`)
  }
}
