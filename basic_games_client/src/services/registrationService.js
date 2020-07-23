import Api from './api'

export default {
  register (credentials) {
    return Api().post('api/register', credentials)
  },
  updateRating (values) {
    return Api().post('api/rating', values)
  },
}
