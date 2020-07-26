import Api from './Main_api'
import Auth_Api from './Auth_api'
export default {
  register (credentials) {
    return Api().post('/user/register', credentials)
  },
  login (credentials) {
    return Auth_Api().post('/login', credentials)
  },
}
