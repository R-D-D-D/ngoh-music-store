<template lang="pug">
  v-container(v-if="category && products")
    v-row(v-if="!isPhone")
      v-col.text-center(cols="12")
        h1.font-weight-black(style="font-size:3rem;") {{ category.name }}
      v-col(v-for="(product, index) in products" :key="index" sm="6" md="4" lg="3" xl="2")
        v-card.mx-auto
          v-img.white--text.align-end(v-if="product.files && product.files[0]" height="200px" :src="product.files[0].url" gradient="to top right, rgba(0,0,0,.5), rgba(0,0,0,.5)")
            v-card-title(style="text-shadow: 1px 1px 2px #000000;") {{ product.name }}
          v-card-subtitle.pb-0.text-left.font-weight-bold S$ {{ product.price.toFixed(2) }}
          v-card-actions.px-4
            v-btn(dark dense color="#343A40" :to="`/product/show/${product.id}`")
              | Details
              v-icon(right) mdi-arrow-right
          v-card-actions.px-4
            v-btn(v-if="$store.state.isUserLoggedIn" dark color="#343A40" @click="editProduct($event, product)")
              | Edit
            v-btn(v-if="$store.state.isUserLoggedIn" dark color="#343A40" @click="deleteProduct($event, product, index)")
              | Delete

    v-row(v-else)
      v-col.text-center(cols="12")
        h1.font-weight-black(style="font-size:3rem;") {{ category.name }}
      v-col(v-for="(product, index) in products" :key="index" cols="6")
        v-card.mx-auto
          v-img.white--text.align-end(v-if="product.files && product.files[0]" height="100px" :src="product.files[0].url" gradient="to top right, rgba(0,0,0,.5), rgba(0,0,0,.5)")
            v-card-title(style="text-shadow: 1px 1px 2px #000000;") {{ product.name }}
          v-card-subtitle.pb-0.text-left.font-weight-bold S$ {{ product.price.toFixed(2) }}
          v-card-actions.px-4
            v-btn(dark small color="#343A40" :to="`/product/show/${product.id}`")
              | Details
              v-icon(right) mdi-arrow-right
          v-card-actions.px-4
            v-btn(small v-if="$store.state.isUserLoggedIn" dark color="#343A40" @click="editProduct($event, product)")
              | Edit
            v-btn(small v-if="$store.state.isUserLoggedIn" dark color="#343A40" @click="deleteProduct($event, product, index)")
              | Delete
</template>

<script>
import ProductService from '@/services/ProductService'
import CategoryService from '@/services/CategoryService'
import FileService from '@/services/FileService'

export default {
  name: 'ShowCategory',
  data () {
    return {
      category: null,
      products: [],
      currProduct: null,
    }
  },

  methods: {
    async deleteProduct (event, product, index) {
      if (confirm('Are you sure?')) {
        await ProductService.delete(product.id)
        this.products.splice(index, 1)
      }
    },

    async editProduct (event, product) {
      this.$router.push(`/product/edit/${product.id}`)
    }
  },

  computed: {
    isPhone () {
      if (this.$vuetify.breakpoint.name == "sm" || this.$vuetify.breakpoint.name == "xs") {
        return true
      } else {
        return false
      }
    }
  },

  mounted: async function () {
    this.category = (await CategoryService.show(this.$route.params.category_id)).data.category
    this.products = (await ProductService.list(this.$route.params.category_id)).data.products
    this.products = await Promise.all((await this.products.map(async product => {
      product.files = (await FileService.list(product.id)).data.files
      product.files = product.files.sort(function(a, b) {
        return a.position - b.position;
      })
      return product
    })))
  }
}
</script>

<style>
</style>