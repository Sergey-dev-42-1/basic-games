import Api from './Main_api'
import Auth_Api from './Auth_api'
export default {
  register (credentials) {
    return Api().post('/user/register', credentials)
  },
  login (credentials) {
    return Auth_Api().post('/login', credentials)
  },
  //проверит Refresh токен и даст новый Access токен
  giveAccessToken (refreshToken) {
    return Auth_Api().get('/token', {headers:{'Authorization': refreshToken}})
  },
  //Дает доступ к закрытым для гостей страницам
  checkAccess (accessToken) {
    return Auth_Api().get('/auth', {headers:{'Authorization': accessToken}} )
  },
  logout (refreshToken) {
    return Auth_Api().delete('/logout', refreshToken)
  },
}
