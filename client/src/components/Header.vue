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

      v-toolbar-items(v-if="$store.state.isUserLoggedIn && !isPhone")
        v-btn(depressed to="/category/new" color="#343A40") Add Category
        v-btn(depressed to="/product/new" color="#343A40") Add Product
        v-btn(depressed @click="logout" color="#343A40") Log Out

      v-app-bar-nav-icon(@click="drawer = true" v-if="isPhone")

    v-navigation-drawer(v-model='drawer' absolute temporary right)
      v-list(nav dense v-if="$store.state.isUserLoggedIn")
        v-list-item-group(active-class="text--accent-4" )
          v-list-item(to="/category/new")
            v-list-item-title Add Category
          v-list-item(to="/product/new")
            v-list-item-title Add Product
          v-list-item(@click="logout")
            v-list-item-title Log Out
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      drawer: false
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
    isPhone () {
      return (this.$vuetify.breakpoint.name == 'xs' || this.$vuetify.breakpoint.name == 'sm')
    }
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
