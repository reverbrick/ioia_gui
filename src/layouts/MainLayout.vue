<template>
  <q-layout view="lHh Lpr lFr">
    <q-header elevated>
      <q-toolbar class="bg-grey" style="min-height: 42px">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" icon="menu" aria-label="Menu"/>
        <q-breadcrumbs active-color="white" style="font-size: 16px">
          <q-breadcrumbs-el label="Strona główna" icon="home" @click="home"/>
          <q-breadcrumbs-el v-if="$route.params.app" :label="$route.params.app" icon="apps"/>
          <q-breadcrumbs-el :label="$route.meta.title" />
        </q-breadcrumbs>
        <q-space />
        <q-btn flat dense @click="contact" icon="email" label="Kontakt"/>
        <q-btn flat dense @click="meeting" icon="meeting_room" label="Spotkanie"/>
        <UserMenu ref="usermenu"/>
        <q-btn flat dense round color="white" @click="$q.fullscreen.toggle()" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"/>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      content-class="bg-grey-1"
      :breakpoint="800">
      <Menu/>
      <Branding ref="branding"/>
    </q-drawer>
    <q-page-container style="height: 111vh">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import Menu from 'components/Menu'
import UserMenu from 'components/UserMenu'
import Branding from 'components/Branding'
export default {
  name: 'MainLayout',
  components: {
    Menu,
    UserMenu,
    Branding
  },
  mounted: function () {
    this.loadData()
  },
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  methods: {
    home () {
      this.$router.push('/')
    },
    contact () {
      this.$router.push('/kontakt')
    },
    meeting () {
      var win = window.open('https://meet.google.com/maq-ueyr-zzn', '_blank')
      win.focus()
    },
    loadData (props) {
      this.loading = true
      this.$axios.get(`${this.api_link}/userinfo/`)
        .then((response) => {
          this.$refs.usermenu.data = response.data.data
          this.loading = false
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Wystąpił błąd przy ładowaniu elementu Dane użytkownika!',
            icon: 'report_problem'
          })
          this.loading = false
        })
    }
  }
}
</script>
