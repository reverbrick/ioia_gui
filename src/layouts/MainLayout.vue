<template>
  <q-layout view="lHh Lpr lFr">
    <q-header elevated>
      <q-toolbar class="bg-grey" style="min-height: 42px">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" icon="menu" aria-label="Menu"/>
        <q-breadcrumbs active-color="white" style="font-size: 16px">
          <q-breadcrumbs-el label="Strona główna" icon="home" @click="home"/>
          <q-breadcrumbs-el :label="$route.meta.title" />
        </q-breadcrumbs>
        <q-space />
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
      <Error ref="err"/>
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
import Error from 'components/Error'
import { apolloQuery } from '../boot/ioia.js'
export default {
  name: 'MainLayout',
  components: {
    Menu,
    UserMenu,
    Branding,
    Error
  },
  mounted () {
    apolloQuery(
      `query {
          currentUser {
            lastName
            email
            firstName
          }
          about
        }
      `,
      {},
      this.userLoadCallback
    )
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
    userLoadCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Dane uźytkownika')
      } else {
        data = data.data
        this.$refs.usermenu.data = data.currentUser
        this.$refs.branding.about = data.about
      }
    }
  }
}
</script>
