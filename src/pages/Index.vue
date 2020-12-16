<template>
  <div class="q-pa-md">
    <q-img
      :src="url"
      :ratio="1"
      spinner-color="white"
      class="rounded-borders"
      style="max-height: 100vh">
      <div class="absolute-top text-subtitle1 text-center">
        Witamy w apikacji IOIA
      </div>
    </q-img>
  </div>
</template>

<script>
import { apolloQuery } from '../boot/ioia.js'
export default {
  mounted () {
    apolloQuery(
      `query {
          currentUser {
            email
          }
        }
      `,
      {},
      this.userLoadCallback,
      'email'
    )
  },
  data () {
    return {
      url: ''
    }
  },
  methods: {
    userLoadCallback (data) {
      if (data.errors) {
      } else {
        data = data.data
        if (data.currentUser.email === 'metalkas@ioia.io') {
          this.url = 'statics/metalkas.PNG'
        } else if (data.currentUser.email === 'kaczkan@ioia.io') {
          this.url = 'statics/kaczkan.PNG'
        } else if (data.currentUser.email === 'prodmax@ioia.io') {
          this.url = 'statics/prodmax.PNG'
        } else if (data.currentUser.email === 'alsanit@ioia.io') {
          this.url = 'statics/alsanit.PNG'
        } else {
          this.url = 'statics/metalwit.PNG'
        }
      }
    }
  }
}
</script>
