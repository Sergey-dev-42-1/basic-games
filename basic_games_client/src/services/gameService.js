import Api from './Main_api'
export default{
    updateRating (values) {
        return Api().post('/user/rating', values)
      }
}
