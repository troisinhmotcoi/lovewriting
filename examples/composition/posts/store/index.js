import { createStore } from 'vuex'
import  actions from './actions'
import mutations from './mutations'

const debug = process.env.NODE_ENV !== 'production'
const state = {
  posts: [],
  loginStatus: '',
  pages: {},
  pages_info: [
   
  ],
  num:0,
  token:'',

 

}

export default createStore({
  state,
  actions,
  mutations
})