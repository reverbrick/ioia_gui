<template>
  <div>
    <q-img class="absolute-top glossy" style="height: 170px; background: black;">
      <div class="absolute-middle bg-transparent" >
        <img src="~assets/logo.png">
        <div class="text-weight-bold" style="color:#ffdc00;">{{$route.params.app ? $route.params.app: 'Metalwit'}}</div>
        <div v-if="$route.params.app">Do oddania projektu pozostało:</div>
        <div v-if="$route.params.app" style="zoom: 0.7;">
          <flip-countdown :deadline="deadline" :showSeconds="false" :labels="labels"></flip-countdown>
        </div>
        <q-chip v-if="!$route.params.app" class="glossy" color="positive" text-color="white" icon-right="info">
          Tutaj informacje
        </q-chip>
        <q-chip v-if="!$route.params.app" class="glossy" color="negative" text-color="white" icon-right="alarm">
          Tutaj powiadomienia
        </q-chip>
      </div>
    </q-img>
    <div class="absolute-bottom glossy" style="height: 30px; background: black; color: white;" >
      <div class="absolute-center">
        &copy;2020 ioia.io
      </div>
    </div>
  </div>
</template>

<script>
import FlipCountdown from 'vue2-flip-countdown'
export default {
  components: { FlipCountdown },
  data () {
    return {
      deadline: '2020-12-25 00:00:00',
      labels: {
        days: 'Dni',
        hours: 'Godzin',
        minutes: 'Minut',
        seconds: 'Sekund'
      }
    }
  }
}
</script>
