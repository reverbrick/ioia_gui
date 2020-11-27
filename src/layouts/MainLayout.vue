<template>
  <q-layout view="lHh Lpr lFr">
    <q-header elevated>
      <q-toolbar class="bg-grey" style="min-height: 42px">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" icon="menu" aria-label="Menu"/>
        <q-breadcrumbs active-color="white" style="font-size: 16px">
          <q-breadcrumbs-el v-for="(item, i) in breadcrumbs" v-bind:key="i" :label="item.label" :icon="item.icon" :to="item.to" />
          <!--<q-breadcrumbs-el :label="$route.meta.title" />-->
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
      <Menu ref="menu"/>
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
          sources(filter: {name: {equalTo: "about"}}) {
            nodes {
              columns
            }
          }
        }
      `,
      {},
      this.userLoadCallback,
      'userdata'
    )
  },
  data () {
    return {
      leftDrawerOpen: false,
      breadcrumbs: [
        { label: 'Strona główna', icon: 'home', to: '/' }
        // { label: this.$route.meta.title, icon: undefined, click: '' }
      ]
    }
  },
  methods: {
    home () {
      if (this.$route.path !== '/') this.$router.push('/')
    },
    userLoadCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Dane uźytkownika')
      } else {
        data = data.data
        this.$refs.usermenu.data = data.currentUser
        // global app config
        this.$refs.branding.title = data.sources.nodes[0].columns.title
        this.$refs.menu.menu_type = data.sources.nodes[0].columns.menu
        this.$about.home = data.sources.nodes[0].columns.home
        this.$about.title = data.sources.nodes[0].columns.title
        this.$about.menu = data.sources.nodes[0].columns.menu

        if (this.$route.path === '/') this.$router.push(data.sources.nodes[0].columns.home)
      }
    }
  }
}
</script>
