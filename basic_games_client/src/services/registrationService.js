import Api from './api'

export default {
  register (credentials) {
    return Api().post('/register', credentials)
  },
  updateRating (values) {
    return Api().post('/rating', values)
  },
}
