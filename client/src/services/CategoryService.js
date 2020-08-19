import Api from '@/services/Api'

export default {
  create (categoryInfo) {
    return Api().post('category/new', categoryInfo)
  },

  list () {
    return Api().get(`category/list`)
  },

  show (cid) {
    return Api().get(`category/show?cid=${cid}`)
  },

  edit (categoryInfo) {
    return Api().put('category/edit', categoryInfo)
  },

  delete (categoryId) {
    return Api().delete(`category/del?cid=${categoryId}`)
  }
}
