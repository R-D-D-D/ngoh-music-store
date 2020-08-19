import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  plugins: [createPersistedState()],
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false
  },

  mutations: {
    setToken (state, token) {
      state.token = token;
    },

    setUser (state, user) {
      state.user = user;
    },

    logIn (state) {
      state.isUserLoggedIn = true;
    },

    logOut (state) {
      state.isUserLoggedIn = false;
    },
  },

  actions: {
    // user management
    setToken ({commit}, token) {
      commit("setToken", token);
      if (token)
        commit("logIn");
      else {
        commit("logOut");
        commit("resetState");
      }
    },

    setUser ({commit}, user) {
      commit("setUser", user);
    },
  }
})
