import Api from './Main_api'
export default {
    updateRating (values) {
      return Api().patch('/user/rating', values)
    }
}

   
