import Api from './api'
export default{
    updateRating (values) {
        return Api().post('/user/rating', values)
      }
}