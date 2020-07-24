import Api from './api'
export default{
    updateRating (values) {
        return Api().post('/rating', values)
      }
}
