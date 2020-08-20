<template lang="pug">
  div
    v-container
      v-row.mt-10
        v-col.text-left(cols="8")
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

      v-divider

      v-row.mb-12
        v-col(cols="12")
          h1 Categories
        v-col(v-for="(category, index) in categories" sm="6" md="4" lg="3" xl="2")
          v-card.mx-auto
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
        v-col(v-for="product in category.products" sm="6" md="4" lg="3" xl="2")
          v-card.mx-auto
            v-img.white--text.align-end(v-if="product.images && product.images[0]" height="200px" :src="product.images[0].url" gradient="to top right, rgba(0,0,0,.5), rgba(0,0,0,.5)")
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
import ImageService from '@/services/ImageService'
import _ from 'lodash'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css';
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';

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

  components: {
    'carousel': VueSlickCarousel
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

  computed: mapState(['user']),

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
        product.images = (await ImageService.list(product.id)).data.images
        return product
      }))
      return category
    }))
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
