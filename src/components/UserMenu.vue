<template>
  <q-btn flat dense :label="data.last_name+' '+data.first_name" icon="person">
    <q-menu>
      <div class="row no-wrap q-pa-md">
        <div class="column">
          <div class="text-h6 q-mb-md">Powiadomienia</div>
          <q-toggle v-model="b1" label="Email" />
          <q-toggle v-model="b2" label="Telegram" />
        </div>
        <q-separator vertical inset class="q-mx-lg" />
        <div class="column items-center">
          <q-avatar size="72px">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div class="text-subtitle1 q-mt-md q-mb-xs">{{data.last_name}} {{data.first_name}}<br/>({{data.username}})</div>
          <q-btn color="primary" label="Wyloguj" @click="logout" push size="sm" v-close-popup />
        </div>
      </div>
    </q-menu>
  </q-btn>
</template>

<script>
export default {
  data () {
    return {
      b1: false,
      b2: true,
      data: {}
    }
  },
  methods: {
    logout (val) {
      localStorage.setItem('access', '')
      localStorage.setItem('refresh', '')
      this.$router.push('/login')
      // location.replace('/logout')
    }
  }
}
</script>
