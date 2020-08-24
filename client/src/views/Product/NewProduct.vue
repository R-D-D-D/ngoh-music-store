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
          v-file-input(v-model="files" label="Upload files and videos..." multiple outlined color="#343A40" accept="image/heic, image/*, video/mp4,video/*" :rules="fileRules")
        
        v-col.pt-0(cols="12" md="8")
          h3 Drag and drop to reorder them
          draggable.row(v-model="files" ref="draggable" @end="onEnd" :key="rerender")
            v-col.pa-0.ma-2.draggable-item(v-for="(file, idx) in files" :key="file.size" cols="4" md="3" lg="2" xl="1" style="border: 1px solid #BDBDBD; position:relative;")
              v-img(:src="window.URL.createObjectURL(file)" :aspect-ratio="4/3" width="100%" contain v-if="file.type.includes('image')")
              div.video-container(v-else style="background: transparent !important;")
                video.video
                  source(:src="window.URL.createObjectURL(file)" type="video/quicktime" v-if="file.type.includes('quicktime')")
                  source(:src="window.URL.createObjectURL(file)" type="video/mp4" v-else)
                div(style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;")
                  img(:src="require('../../assets/play_button.png')" style="position: absolute; width: 30px; height:30px; left: calc(50% - 15px); top: calc(50% - 15px);" color="white" size="62" )

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
import FileService from '@/services/FileService'
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
      files: [],
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
            if (i == 0 && files[0].type.includes('video'))
              return 'First resource must be an image'
            if (files[i].size > 104857600)
              return 'File cannot be larger than 100MB'
          }
          return true
        }
      ],
      overlay: false,
      error: '',
      rerender: 1
    }
  },

  components: {
    draggable
  },

  watch: {
    files (val) {
      console.log(val)
    }
  },

  methods: {
    async onEnd () {
      this.rerender += 1
    },

    async submit () {
      try {
        if (this.$refs.form.validate()) {
          this.overlay = true
          const product = (await ProductService.create({
            name: this.name,
            price: this.price,
            description: this.description,
            cid: this.categories.find(cat => cat.name == this.category).id
          })).data.product
          for (var i = 0; i < this.files.length; i++) {
            var formData = new FormData()
            formData.set('pid', product.id)
            formData.set('position', i)
            formData.append('file', this.files[i])
            await FileService.create(formData)
          }
          this.overlay = false

          // this.$router.push('/')
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
