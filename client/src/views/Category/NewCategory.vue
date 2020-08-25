<template lang="pug">
  v-container
    v-overlay(:value="overlay")
      v-progress-circular(indeterminate size="64")
    v-form(ref="form" @submit.prevent="submit")
      v-row.mb-8.justify-center
        v-col.text-center
          h1.font-weight-black(style="font-size=2.6rem;") Category

      v-row.mb-16.justify-center
        v-col(cols="12" md="8")
          v-text-field.mx-auto(label='Name' type='text' v-model='name' :rules="requiredRules" outlined color="indigo")
        v-col(cols="12" md="8")
          v-textarea.mx-auto(label='Description' type='text' v-model='description' outlined color="indigo")
        v-col(cols='12' md="8")
          v-file-input(v-model="file" label="Upload cover photo..." outlined color="#343A40" accept="image/png, image/jpg, image/jpeg" :rules="requiredRules")

      v-row.justify-center
        v-col.text-center
          v-btn(large color="#343A40" @click='submit' dark) 
            v-icon(left) mdi-plus
            | Create
</template>

<script>
import CategoryService from '@/services/CategoryService'
import FileService from '@/services/FileService'

export default {
  name: 'NewCategory',
  data () {
    return {
      name: '',
      requiredRules: [
        v => !!v || "This field is required"
      ],
      description: '',
      file: null,
      overlay: false
    }
  },

  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        try {
          this.overlay = true
          let category = (await CategoryService.create({
            name: this.name,
            description: this.description
          })).data.category

          var formData = new FormData()
          formData.set('cid', category.id)
          formData.append('file', this.file)
          await FileService.create(formData)
          this.$router.push('/')
        } catch (err) {
          this.overlay = false
        }
      }
    }
  }
}
</script>

<style>
</style>
