<template lang="pug">
  v-container
    v-form(ref="form" @submit.prevent="submit")
      v-row.mb-8.justify-center
        v-col.text-center
          h1.font-weight-black(style="font-size=2.6rem;") Category

      v-row.mb-16.justify-center
        v-col(cols="12" md="8")
          v-text-field.mx-auto(label='Name' type='text' v-model='newCategory.name' :rules="requiredRules" outlined color="indigo")
        v-col(cols="12" md="8")
          v-textarea.mx-auto(label='Description' type='text' v-model='newCategory.description' outlined color="indigo")

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
import CategoryService from '@/services/CategoryService'

export default {
  name: 'NewCategory',
  data () {
    return {
      requiredRules: [
        v => !!v || "This field is required"
      ],
      category: null,
      newCategory: {
        name: '',
        description: ''
      }
    }
  },

  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        await CategoryService.edit({
          id: this.category.id,
          name: this.newCategory.name,
          description: this.newCategory.description
        })
        this.$router.push('/')
      }
    }
  },

  mounted: async function () {
    this.category = (await CategoryService.show(this.$route.params.category_id)).data.category
    this.newCategory.name = this.category.name
    this.newCategory.description = this.category.description
  }
}
</script>

<style>
</style>
