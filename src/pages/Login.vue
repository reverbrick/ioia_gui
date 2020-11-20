<template>
  <q-layout>
    <q-page-container style="height: 111vh">
      <q-page class="bg-grey full-height row justify-center items-center">
        <div class="column">
          <div class="row">
            <h5 class="text-h5 text-white q-my-md">Witamy w apikacji IOIA</h5>
          </div>
          <div class="row">
            <q-card square bordered class="q-pa-lg shadow-1">
              <q-card-section>
                <q-form autofocus class="q-gutter-md">
                  <q-input square filled clearable v-model="user" type="text" label="użytkownik" />
                  <q-input square filled clearable v-model="password" type="password" label="hasło" />
                </q-form>
              </q-card-section>
              <q-card-actions class="q-px-md">
                <q-btn unelevated @click="click" color="indigo-4" size="lg" class="full-width" label="Zaloguj" />
              </q-card-actions>
              <q-card-section class="text-center q-pa-none">
                <p class="text-grey-6">Przypomnienie hasła</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <Error ref="err"/>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { apolloQueryNoBearer } from '../boot/ioia.js'
import Error from 'components/Error'
export default {
  components: {
    Error
  },
  name: 'Login',
  data () {
    return {
      user: '',
      password: ''
    }
  },
  methods: {
    click () {
      this.loading = true
      apolloQueryNoBearer(
        `mutation ($user: String!, $password: String!) {
          authenticate(input: {email: $user, password: $password}) {
            jwtToken
          }
        }`,
        {
          user: this.user,
          password: this.password
        },
        this.loginCallback
      )
    },
    loginCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Login')
      } else {
        data = data.data
        if (data.authenticate.jwtToken == null) {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Login lub hasło niepoprawne!',
            icon: 'report_problem'
          })
          localStorage.setItem('token', '')
        } else {
          localStorage.setItem('token', data.authenticate.jwtToken)
          // this.$router.push('/')
          window.location.href = '/'
        }
      }
    }
  }
}

</script>

<style>
.q-card {
  width: 360px;
}
</style>
