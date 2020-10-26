import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const store = new Vuex.Store({
    state: { key: '' }
  })
  return store
}
