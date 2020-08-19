<template lang="pug">
  v-container
    v-form(ref="form" @submit.prevent="submit")
      v-row.mb-8.justify-center
        v-col.text-center
          h1.font-weight-black(style="font-size=2.6rem;") Category

      v-row.mb-16.justify-center
        v-col(cols="12" md="8")
          v-text-field.mx-auto(label='Name' type='text' v-model='name' :rules="requiredRules" outlined color="indigo")
        v-col(cols="12" md="8")
          v-textarea.mx-auto(label='Description' type='text' v-model='description' outlined color="indigo")

      v-row.justify-center
        v-col.text-center
          v-btn(large color="#343A40" @click='submit' dark) 
            v-icon(left) mdi-plus
            | Create
</template>

<script>
import CategoryService from '@/services/CategoryService'

export default {
  name: 'NewCategory',
  data () {
    return {
      name: '',
      requiredRules: [
        v => !!v || "This field is required"
      ],
      description: ''
    }
  },

  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        await CategoryService.create({
          name: this.name,
          description: this.description
        })
        this.$router.push('/')
      }
    }
  }
}
</script>

<style>
</style>
