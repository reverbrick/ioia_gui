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
                <q-form autofocus class="q-gutter-md"><!-- v-touch-repeat.enter="click">-->
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
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
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
      this.$axios.post(`${this.api_link}/security/login`, { username: this.user, password: this.password, provider: 'db', refresh: true }
      )
        .then((response) => {
          this.loading = false
          localStorage.setItem('access', response.data.access_token)
          localStorage.setItem('refresh', response.data.refresh_token)
          this.$router.push('/')
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Wystąpił problem z logowaniem!',
            icon: 'report_problem'
          })
          this.loading = false
        })
    }
  }
}
</script>

<style>
.q-card {
  width: 360px;
}
</style>
