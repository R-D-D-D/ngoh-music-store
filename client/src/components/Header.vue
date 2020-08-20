<template lang="pug">
  div
    v-app-bar(
      dark
      app
      absolute
      color="#343A40"
    )
      router-link.font-weight-black.pl-3#logo(to="/") Ngoh Store
      v-spacer

      //- v-toolbar-items(v-if="!$store.state.isUserLoggedIn")
      //-   v-btn(depressed to="/register" color="#343A40") Register
      //-   v-btn(depressed to="/login" color="#343A40") Log In
      v-toolbar-items(v-if="$store.state.isUserLoggedIn")
        v-btn(depressed to="/category/new" color="#343A40") Add Category
        v-btn(depressed to="/product/new" color="#343A40") Add Product
        v-btn(depressed @click="logout" color="#343A40") Log Out
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'Header',
  data () {
    return {
    }
  },

  methods: {
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push('/')
    }
  },

  computed: {
    ...mapState(['user'])
  },

  mounted: function () {
  }
}
</script>

<style scoped>
#logo {
  color: white;
  text-decoration: none;
  font-size: 2rem;
}
</style>
