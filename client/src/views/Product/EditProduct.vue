<template lang="pug">
  v-container(v-if="product")
    v-overlay(:value="overlay")
      v-progress-circular(indeterminate size="64")
    v-form(ref="form" @submit.prevent="submit")
      v-row.mb-8
        v-col.text-center
          h1.font-weight-black(style="font-size=2.6rem;") Product

      v-row.justify-center
        v-col(cols="12" md="8")
          v-select(label='Category' :items="categories" item-text="name" v-model="newProduct.category" outlined color="indigo" :rules="requiredRules")

        v-col(cols="12" md="8")
          v-text-field(label='Name' v-model='newProduct.name' outlined color="indigo" :rules="requiredRules")
        
        v-col(cols="12" md="8")
          v-textarea(label='Description' v-model='newProduct.description' outlined color="indigo")

        v-col(cols="12" md="8")
          v-text-field(label='Price' v-model='newProduct.price' outlined color="indigo" :rules="priceRules")

        v-col(cols="12" md="8")
          h3 Drag and drop to reorder them
          draggable.row(v-model="newProduct.files" ref="draggable" @end="onEnd" :key="rerender")
            v-col.pa-0.ma-2.draggable-item(v-for="(file, idx) in newProduct.files" :key="file.size" cols="4" md="3" lg="2" xl="1" style="border: 1px solid #BDBDBD; position:relative;")
              v-img(:src="file.url" :aspect-ratio="4/3" width="100%" contain v-if="file.type.includes('image')")
              div.video-container(v-else style="background: transparent !important;")
                video.video
                  source(:src="file.url" type="video/quicktime" v-if="file.type.includes('quicktime')")
                  source(:src="file.url" type="video/mp4" v-else)
                div(style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;")
                  img(:src="require('../../assets/play_button.png')" style="position: absolute; width: 30px; height:30px; left: calc(50% - 15px); top: calc(50% - 15px);" color="white" size="62" )

        v-col.pb-0(cols='12' md="8")
          v-file-input(v-model="newProduct.files" label="Upload additional contents..." multiple outlined color="#343A40" accept="file/*")

      v-row.justify-center
        v-col.text-center
          v-btn.mx-2(large color="#343A40" @click='submit' dark)
            v-icon(left) mdi-content-save-outline
            | Save
          v-btn.mx-2(large color="#343A40" to="/" dark) 
            v-icon(left) mdi-cancel
            | Cancel
</template>

<script>
/* eslint-disable */
import CategoryService from '@/services/CategoryService'
import ProductService from '@/services/ProductService'
import FileService from '@/services/FileService'
import draggable from 'vuedraggable'

export default {
  name: 'EditProduct',
  data () {
    return {
      product: null,
      newProduct: {
        name: '',
        price: '',
        description: '',
        category: '',
        files: []
      },
      categories: [{
        id: 1,
        name: 'hey'
      }, {
        id: 2,
        name: 'yo'
      }],
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
      rerender: 1,
      overlay: false
    }
  },

  components: {
    draggable
  },

  methods: {
    async submit () {
      if (!this.newProduct.files[0].type.includes('image')) {
        alert('Please ensure the first resource is an image')
        return
      }
      if (this.$refs.form.validate()) {
        this.overlay = true
        const product = (await ProductService.edit({
          id: this.product.id,
          name: this.newProduct.name,
          price: this.newProduct.price,
          description: this.newProduct.description,
          cid: this.categories.find(cat => cat.name == this.newProduct.category).id
        })).data.product

        for (var i = 0; i < this.newProduct.files.length; i++) {
          this.newProduct.files[i].position = i
          await FileService.edit(this.newProduct.files[i])
        }

        this.$router.push('/')
      }
    },

    async onEnd () {
      this.rerender += 1
    },
  },

  mounted: async function () {
    this.categories = (await CategoryService.list()).data.categories
    this.product = (await ProductService.show(this.$route.params.product_id)).data.product
    this.newProduct.name = this.product.name
    this.newProduct.price = this.product.price.toFixed(2)
    this.newProduct.description = this.product.description
    this.newProduct.category = this.product.Category.name
    this.newProduct.files = this.product.Files.sort(function(a, b) {
      return a.position - b.position;
    })
  }
}
</script>

<style>
</style>
