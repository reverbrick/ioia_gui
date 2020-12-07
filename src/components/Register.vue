<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Rejestracja użytkownika</div>
    </q-card-section>
    <q-form autofocus @submit="onSubmit" class="q-gutter-md" :loading="loading">
      <q-card-section class="q-pt-none q-gutter-md">
        <q-input dense stack-label filled v-model="data.lastName" :rules="[selRequired]" hint="Pole wymagane" label="Nazwisko" type="text"/>
        <q-input dense stack-label filled v-model="data.firstName" :rules="[selRequired]" hint="Pole wymagane" label="Imię" type="text"/>
        <q-input dense stack-label filled v-model="data.email" :rules="[selRequired]" hint="Pole wymagane" label="Email" type="email"/>
        <q-input dense stack-label ref="pw" filled v-model="data.password" :rules="[selRequired]" hint="Pole wymagane" label="Hasło" type="password"/>
        <q-input dense stack-label ref="pw2" filled v-model="data.password2" :rules="[selRequired, pwMatch]" hint="Pole wymagane" label="Hasło (powtórz)" type="password"/>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn label="Zapisz" type="submit" color="positive"/>
        <q-btn label="Anuluj" color="primary" v-close-popup />
      </q-card-actions>
    </q-form>
    <Error ref="err"/>
  </q-card>
</template>

<script>
import { apolloQuery } from '../boot/ioia.js'
import Error from 'components/Error'
export default {
  components: {
    Error
  },
  data () {
    return {
      data: {},
      loading: true
    }
  },
  methods: {
    selRequired (val) {
      if (val === undefined) {
        return 'Pole jest wymagane!'
      }
    },
    pwMatch (val) {
      if (this.$refs.pw.value !== this.$refs.pw2.value) {
        return 'Hasła muszą być zgodne!'
      }
    },
    onSubmit () {
      apolloQuery(
        `mutation ($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
          registerUser(input: {firstName: $firstName, lastName: $lastName, email: $email, password: $password}) {
            clientMutationId
          }
        }`,
        {
          firstName: this.data.firstName,
          lastName: this.data.lastName,
          email: this.data.email,
          password: this.data.password
        },
        this.registerCallback
      )
    },
    registerCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Rejestracja')
      } else {
        this.$emit('loadData')
        this.$emit('openRegister', false)
      }
      this.loading = false
    }
  }
}
</script>
