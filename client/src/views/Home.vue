<template lang="pug">
  div
    v-row(v-if="!isPhone")
      v-col.pt-0(syle="position:relative;")
        v-img(:src="require('../assets/bg.jpg')")
          v-container(style="position:absolute; top:0; left:0; right:0;")
            v-row.mt-10
              v-col.text-left(cols="8" style="color:white; text-shadow: 2px 2px 4px #000000;")
                h1 Welcome to Mr Ngoh's Store

            v-row.mb-12
              v-col(cols="8")
                v-autocomplete(v-model='model' :items='items' :loading='isLoading' :search-input.sync='search' cache-items multiple clearable hide-details hide-selected item-text='name' item-value='symbol' label='Search for a product...' solo)
                  template(v-slot:no-data)
                    v-list-item
                      v-list-item-title
                        | Search for a product
                  template(v-slot:item='{ item }')
                    v-list-item(:to="`/product/show/${item.id}`")
                      v-list-item-content {{ item.name }}

    v-container
      div(v-if="isPhone")
        v-row
          v-col.text-left(cols="12" md="8")
            h1 Welcome to Mr Ngoh's Store

        v-row.mb-12
          v-col(cols="12" md="8")
            v-autocomplete(v-model='model' :items='items' :loading='isLoading' :search-input.sync='search' cache-items multiple clearable hide-details hide-selected item-text='name' item-value='symbol' label='Search for a product...' solo)
              template(v-slot:no-data)
                v-list-item
                  v-list-item-title
                    | Search for a product
              template(v-slot:item='{ item }')
                v-list-item(:to="`/product/show/${item.id}`")
                  v-list-item-content {{ item.name }}

        v-divider

        v-row.mb-12
          v-col(cols="12")
            h1 Categories
          v-col(v-for="(category, index) in categories" cols="6")
            v-card.mx-auto
              v-img(v-if="category.File" height="100px" :src="category.File.url")
              v-card-title.pb-0 {{ category.name }}
              v-card-text.pb-0 {{ category.description }}
              v-card-actions.px-4
                v-btn(dark small color="#343A40" :to="`/category/show/${category.id}`")
                  | Browse
                  v-icon(right) mdi-arrow-right
              v-card-actions.px-4
                v-btn(dark small color="#343A40" :to="`/category/edit/${category.id}`" v-if="$store.state.isUserLoggedIn") Edit
                v-btn(dark small color="#343A40" @click="deleteCategory($event, category, index)" v-if="$store.state.isUserLoggedIn") Delete

        v-divider

        v-row(v-for="category in categories").mt-10
          v-col.text-left(cols="12")
            h1 {{ category.name }}
          v-col(v-for="product in category.products" cols="6")
            v-card.mx-auto
              v-img.white--text.align-end(v-if="product.files && product.files[0]" height="100px" :src="product.files[0].url" gradient="to top right, rgba(0,0,0,.5), rgba(0,0,0,.5)")
                v-card-title(style="text-shadow: 1px 1px 2px #000000;") {{ product.name }}
              v-card-subtitle.pb-0.text-left.font-weight-bold S$ {{ product.price.toFixed(2) }}
              v-card-actions.px-4
                v-btn(dark small color="#343A40" :to="`/product/show/${product.id}`")
                  | Details
                  v-icon(right) mdi-arrow-right
      
      div(v-else)
        v-row.mb-12
          v-col(cols="12")
            h1 Categories
          v-col(v-for="(category, index) in categories" sm="6" md="4" lg="3" xl="2")
            v-card.mx-auto
              v-img(v-if="category.File" height="200px" :src="category.File.url")
              v-card-title.pb-0 {{ category.name }}
              v-card-text.pb-0 {{ category.description }}
              v-card-actions.px-4
                v-btn(dark dense color="#343A40" :to="`/category/show/${category.id}`")
                  | Browse
                  v-icon(right) mdi-arrow-right
              v-card-actions.px-4
                v-btn(dark dense color="#343A40" :to="`/category/edit/${category.id}`" v-if="$store.state.isUserLoggedIn") Edit
                v-btn(dark dense color="#343A40" @click="deleteCategory($event, category, index)" v-if="$store.state.isUserLoggedIn") Delete

        v-divider

        v-row(v-for="category in categories").mt-10
          v-col.text-left(cols="12")
            h1 {{ category.name }}
          v-col(v-for="product in category.products" cols="12" sm="6" md="4" lg="3" xl="2")
            v-card.mx-auto
              v-img.white--text.align-end(v-if="product.files && product.files[0]" height="200px" :src="product.files[0].url" gradient="to top right, rgba(0,0,0,.5), rgba(0,0,0,.5)")
                v-card-title(style="text-shadow: 1px 1px 2px #000000;") {{ product.name }}
              v-card-subtitle.pb-0.text-left.font-weight-bold S$ {{ product.price.toFixed(2) }}
              v-card-actions.px-4
                v-btn(dark dense color="#343A40" :to="`/product/show/${product.id}`")
                  | Details
                  v-icon(right) mdi-arrow-right

</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex'
import ProductService from '@/services/ProductService'
import CategoryService from '@/services/CategoryService'
import FileService from '@/services/FileService'
import _ from 'lodash'

export default {
  name: 'Home',
  data () {
    return {
      isLoading: false,
      items: [],
      model: null,
      search: null,
      categories: []
    }
  },

  watch: {
    model (value) {
      console.log(value)
    },

    search: _.debounce(async function (value) {
      if (value != '' &&  value != undefined) {
        this.isLoading = true
        try {
          this.items = (await ProductService.search(value)).data.products
          this.isLoading = false
        } catch (err) {
          this.isLoading = false
          console.log(err)
        }
      }
    }, 700)
  },

  computed: {
    isPhone () {
      if (this.$vuetify.breakpoint.name == "sm" || this.$vuetify.breakpoint.name == "xs") {
        return true
      } else {
        return false
      }
    },

    ...mapState(['user'])
  },

  methods: {
    async deleteCategory (event, category, index) {
      if (confirm('Are you sure?')) {
        await CategoryService.delete(category.id)
        this.categories.splice(index, 1)
      }
    }
  },

  mounted: async function () {
    this.categories = (await CategoryService.list()).data.categories
    this.categories = await Promise.all(this.categories.map(async category => {
      category.products = await Promise.all((await ProductService.list(category.id)).data.products.map(async product => {
        product.files = (await FileService.list(product.id)).data.files
        return product
      }))
      for (var i in category.products) {
        category.products[i].files = category.products[i].files.sort(function(a, b) {
          return a.position - b.position;
        })
      }
      return category
    }))
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
