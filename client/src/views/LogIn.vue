<template lang="pug">
  #login
    panel(title="Log In")
      v-card-text
        v-form.text-center(ref="form" v-on:submit.prevent="login")
          v-text-field(
            label='Email' 
            name='email' 
            prepend-icon='mdi-account' 
            type='text' 
            v-model='email' 
            :rules="emailRules")
          v-text-field#password(
            label='Password' 
            name='password' 
            prepend-icon='mdi-lock' 
            type='password' 
            v-model='password' 
            :rules="passwordRules")
          v-spacer
          v-btn.mt-5(:loading='loading' :disabled="loading" type="submit") Log In
          v-spacer
      v-card-text
        .error.text-center(v-html="error") {{ error }}
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'LogIn',
  data () {
    return {
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required',
      ],
      error: null,
      loading: false
    }
  },
  methods: {
    async login () {
      if (!this.$refs.form.validate())
        return
      this.error = ''
      this.loading = true
      try {
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password
        })

        this.loading = false
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)

        this.$router.push({
          name: 'home'
        })
      } catch (err) {
        // console.log(err)
        this.error = err.response.data.error
        this.loading = false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
