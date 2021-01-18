import { createStore } from 'vuex'
import { getCart } from '@/service/cart'

export default createStore({
  state: {
    cartCount: 0
  },
  mutations: {
    addCart (state, payload) {
      state.cartCount = payload.count
    }
  },
  actions: {
    async updateCart (ctx) {
      const { data } = await getCart()
      // console.log(data);
      ctx.commit('addCart', {
        count: data.length || 0
      })
    }
  },
  modules: {
  }
})
