<template>
  <div>
    <q-img class="absolute-top glossy" style="height: 170px; background: black;">
      <div class="absolute-middle bg-transparent" >
        <img src="~assets/logo.png">
        <div class="text-weight-bold" style="color:#ffdc00;">{{$route.params.app ? $route.params.app: this.title}}</div>
        <div v-if="deadline">Do oddania projektu pozostało:</div>
        <div v-if="deadline" style="zoom: 0.7;">
          <flip-countdown :deadline="deadline" :showSeconds="false" :labels="labels"></flip-countdown>
        </div>
        <q-chip v-if="!deadline" class="glossy" color="positive" text-color="white" icon-right="info">
          Tutaj informacje
        </q-chip>
        <q-chip v-if="!deadline" class="glossy" color="negative" text-color="white" icon-right="alarm">
          Tutaj powiadomienia
        </q-chip>
      </div>
    </q-img>
    <div @click="clear" class="absolute-bottom glossy" style="height: 30px; background: black; color: white;" >
      <div class="absolute-center">
        &copy;2020 ioia.io
      </div>
    </div>
    <Error ref="err"/>
  </div>
</template>

<script>
import FlipCountdown from 'vue2-flip-countdown'
import { apolloQuery } from '../boot/ioia.js'
import { date } from 'quasar'
import Error from 'components/Error'
export default {
  components: {
    FlipCountdown,
    Error
  },
  watch: {
    '$route.params.app': function (newVal) {
      if (newVal) {
        this.setClock(newVal)
      } else {
        this.deadline = undefined
      }
    }
  },
  mounted () {
    if (this.$route.params.app) this.setClock(this.$route.params.app)
  },
  data () {
    return {
      title: '',
      deadline: undefined,
      labels: {
        days: 'Dni',
        hours: 'Godzin',
        minutes: 'Minut',
        seconds: 'Sekund'
      }
    }
  },
  methods: {
    setClock (app) {
      apolloQuery(
        `query ($name: String!) {
          projects(filter: {name: {equalTo: $name}}) {
            nodes {
              deadline
            }
          }
        }`,
        {
          name: app
        },
        this.clockUpdateCallback
      )
    },
    clockUpdateCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Zegar')
      } else {
        data = data.data.projects.nodes[0]
        if (data) {
          if (data.deadline) {
            this.deadline = date.formatDate(data.deadline, 'YYYY-MM-DD HH:mm')
          } else {
            this.deadline = undefined
          }
        } else {
          this.deadline = undefined
        }
      }
    },
    clear () {
      sessionStorage.clear()
    }
  }
}
</script>
