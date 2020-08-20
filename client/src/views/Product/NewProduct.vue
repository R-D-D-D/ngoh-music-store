<template lang="pug">
  v-container
    v-overlay(:value="overlay")
      v-progress-circular(indeterminate size="64")
    v-form(ref="form" @submit.prevent="submit")
      v-row.mb-8
        v-col.text-center
          h1.font-weight-black(style="font-size=2.6rem;") Product

      v-row.justify-center
        v-col(cols="12" md="8")
          v-select(label='Category' :items="categories" item-text="name" v-model="category" outlined color="indigo" :rules="requiredRules")

        v-col(cols="12" md="8")
          v-text-field(label='Name' v-model='name' outlined color="indigo" :rules="requiredRules")
        
        v-col(cols="12" md="8")
          v-textarea(label='Description' v-model='description' outlined color="indigo")

        v-col(cols="12" md="8")
          v-text-field(label='Price' v-model='price' outlined color="indigo" :rules="priceRules")

        v-col.pb-0(cols='12' md="8")
          v-file-input(v-model="images" label="Upload images..." multiple outlined color="#343A40" accept="image/*")
        
        v-col.pt-0(cols="12" md="8")
          v-list
            draggable(v-model="images")
              transition-group
                v-list-item.draggable-item.elevation-2(v-for="(image, idx) in images" :key="idx")
                  v-list-item-icon
                    v-icon mdi-image
                  v-list-item-content(style="flex-grow: 2;")
                    v-list-item-title {{ image.name }}

      v-row.justify-center
        v-col.text-center
          v-btn(large color="#343A40" @click='submit' dark) 
            v-icon(left) mdi-plus
            | Create
</template>
  
<script>
/* eslint-disable */
import CategoryService from '@/services/CategoryService'
import ProductService from '@/services/ProductService'
import ImageService from '@/services/ImageService'
import draggable from 'vuedraggable'

export default {
  name: 'NewProduct',
  data () {
    return {
      name: '',
      price: '',
      description: '',
      category: '',
      categories: [{
        id: 1,
        name: 'hey'
      }, {
        id: 2,
        name: 'yo'
      }],
      images: [],
      alphanumricRules: [
        v => new RegExp("^[a-zA-Z0-9 !@#$%^*_(){}-]{0,100}$").test(v) || "You can only input alphanumeric characters",
      ],
      requiredRules: [
        v => !!v || "This field is required"
      ],
      priceRules: [
        v => !!v || "Price is required",
        v => new RegExp(/^\d+(?:\.\d{0,2})$/).test(v) || "Price must be a number with maximum 2 decimal places"
      ],
      fileRules: [
        files => {
          for (var i = 0; i < files.length; i++) {
            if (files[i].size > 104857600) {
              return 'File cannot be larger than 100MB'
            }
          }
          return true
        }
      ],
      overlay: false,
      error: ''
    }
  },

  components: {
    draggable
  },

  methods: {
    async submit () {
      try {
        if (this.$refs.form.validate()) {
          this.overlay = true
          console.log(this.categories.find(cat => cat.name == this.category).id)
          const product = (await ProductService.create({
            name: this.name,
            price: this.price,
            description: this.description,
            cid: this.categories.find(cat => cat.name == this.category).id
          })).data.product

          for (let i = 0; i < this.images.length; i++) {
            let formData = new FormData()
            formData.set('pid', product.id)
            formData.append('file', this.images[i])
            await ImageService.create(formData)
          }

          this.$router.push('/')
        }
      } catch (err) {
        this.overlay = false
        this.error = err
      }
    }
  },

  mounted: async function () {
    this.categories = (await CategoryService.list()).data.categories
  }
}
</script>

<style>
.draggable-item:hover {
  cursor: pointer;
}
</style>
