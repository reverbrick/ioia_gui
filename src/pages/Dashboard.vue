<template>
  <q-page class="q-pa-md q-gutter-md">
    <div class="row items-start justify-center q-gutter-md">
      <q-card v-if="status==1" class="col-4 col-md-4">
        <q-item style="background-color: red" class="q-pa-none">
          <q-item-section avatar>
            <q-icon color="white" name="settings_applications" size="44px"/>
          </q-item-section>
          <q-item-section class="q-pa-md q-ml-none text-white">
            <q-item-label class="text-white text-h6 text-weight-bolder">Wyłączona</q-item-label>
            <q-item-label>Nie pracuje (ost. {{activity}})</q-item-label>
          </q-item-section>
          <q-item-section side class="q-mr-md text-white">
            <q-icon name="fas fa-dollar-sign" color="white" size="44px"></q-icon>
          </q-item-section>
        </q-item>
      </q-card>
      <q-card v-else-if="status==2" class="col-4 col-md-4">
        <q-item style="background-color: #F2C037" class="q-pa-none">
          <q-item-section avatar>
            <q-icon color="white" name="settings_applications" size="44px"/>
          </q-item-section>
          <q-item-section class="q-pa-md q-ml-none  text-white">
            <q-item-label class="text-white text-h6 text-weight-bolder">Włączona</q-item-label>
            <q-item-label>Nie pracuje</q-item-label>
          </q-item-section>
          <q-item-section side class="q-mr-md text-white">
            <q-icon name="fas fa-dollar-sign" color="white" size="44px"></q-icon>
          </q-item-section>
        </q-item>
      </q-card>
      <q-card v-else-if="status==3" class="col-4 col-md-4">
        <q-item style="background-color: #21BA45" class="q-pa-none">
          <q-item-section avatar>
            <q-icon color="white" name="settings_applications" size="34px"/>
          </q-item-section>
          <q-item-section class="q-pa-md q-ml-none  text-white">
            <q-item-label class="text-white text-h6 text-weight-bolder">Włączona</q-item-label>
            <q-item-label>Pracuje</q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
      <q-card v-else class="col-4 col-md-4">
        <q-item style="background-color: #C0c0c0" class="q-pa-none">
          <q-item-section avatar>
            <q-icon color="white" name="settings_applications" size="44px"/>
          </q-item-section>
          <q-item-section class="q-pa-md q-ml-none text-white">
            <q-item-label class="text-white text-h6 text-weight-bolder">Nieznany</q-item-label>
            <q-item-label>Brak informacji</q-item-label>
          </q-item-section>
          <q-item-section side class="q-mr-md text-white">
            <q-icon name="fas fa-dollar-sign" color="white" size="44px"></q-icon>
          </q-item-section>
        </q-item>
      </q-card>
    </div>
    <q-item>
      <q-item-section class="bg-grey-2" v-for="(item, i) in info" v-bind:key="i">
        <q-item-label>
          {{item.title}}
        </q-item-label>
        <q-item-label caption>
          <q-badge :color="item.color" text-color="black">
            <!--
            <q-icon
              :name="item.icon"
              size="20px"
              class="q-ml-xs"
            />
          -->
            {{item.value}}
          </q-badge>
        </q-item-label>
      </q-item-section>
    </q-item>
    <!--
    <div class="row items-start justify-center q-gutter-md">
      <q-card v-for="(item, i) in pie" v-bind:key="i" class="col-2 col-md-2">
        <q-item>
          <q-item-section>
            <q-item-label>{{item}}</q-item-label>
          </q-item-section>
        </q-item>
        <IEcharts style="height: 250px" :option="getPieOptions" :resizable="true"/>
      </q-card>
    </div>
  -->
    <div v-for="(item, i) in chart" v-bind:key="i" class="row items-start justify-center q-gutter-md">
      <q-card class="col-10 col-md-10 col-sm-12">
        <q-item>
          <q-item-section>
            <q-item-label>{{item}}</q-item-label>
          </q-item-section>
        </q-item>
        <IEcharts v-if="i==0" style="height: 250px" :option="dzien" :resizable="true"/>
        <IEcharts v-else-if="i==1" style="height: 250px" :option="miesiac" :resizable="true"/>
        <IEcharts v-else style="height: 250px" :option="rok" :resizable="true"/>
      </q-card>
    </div>
    <p align="center">*(Dane odświeżane co godzinę)</p>
    <p align="center">
      <download-excel
        :data   = "xls"
        :name    = "$route.params.app+'.xls'">
        <q-icon color="black" name="get_app"/>Dane historyczne
      </download-excel>
    </p>
    <Error ref="err"/>
  </q-page>
</template>

<script>
import IEcharts from 'vue-echarts-v3/src/lite.js'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import VueNativeSock from 'vue-native-websocket'
import Vue from 'vue'
import { date } from 'quasar'
import { apolloQuery } from '../boot/ioia.js'
import Error from 'components/Error'
import JsonExcel from 'vue-json-excel'

Vue.component('downloadExcel', JsonExcel)
Vue.use(VueNativeSock, 'wss://red.ioia.io/ws', { format: 'json', reconnection: true })

export default {
  name: 'Dashboard2',
  components: {
    IEcharts,
    Error
  },
  watch: {
    $route: function (newVal) {
      this.bread()
    }
  },
  mounted () {
    this.bread()
    apolloQuery(
      `query($app: String!) {
          vDashboards(condition: {project: $app}) {
            nodes {
              average
              month
              week
              year
              total
              gDay
              gMonth
              gYear
              history
            }
          }
      }`,
      {
        app: this.$route.params.app
      },
      this.loadCallback
    )
  },
  data () {
    return {
      status: 0,
      years: [],
      activity: '',
      pie: ['Wykres1', 'Wykres2', 'Wykres3', 'Wykres4'],
      chart: ['Dzień (worki)*', 'Miesiąc (tony)*', 'Rok (tony)*'],
      option: ['dzien', 'dzien', 'dzien'],
      info: [
        { title: 'Dzienny uzysk', value: 0, icon: 'trending_flat' },
        { title: 'Średnio szt/h*', value: 0, icon: 'trending_flat' },
        { title: 'Bieżący tydzień*', value: 0, icon: 'trending_flat' },
        { title: 'Bieżący miesiąc*', value: 0, icon: 'trending_flat' },
        { title: 'Bieżący rok*', value: 0, icon: 'trending_flat' },
        { title: 'Produkcja całkowita*', value: 0, icon: 'trending_flat' }
      ],
      rok: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // Coordinate axis indicator, coordinate axis trigger is valid
            type: 'shadow' // The default is a straight line, optional:'line' |'shadow'
          }
        },
        grid: {
          left: '2%',
          right: '2%',
          top: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: 'Produkcja',
            type: 'bar',
            data: [],
            color: '#02a9f4',
            label: {
              show: true
            }
          }
        ]
      },
      miesiac: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // Coordinate axis indicator, coordinate axis trigger is valid
            type: 'shadow' // The default is a straight line, optional:'line' |'shadow'
          }
        },
        grid: {
          left: '2%',
          right: '2%',
          top: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: 'Zmiana 1',
            type: 'bar',
            data: [],
            stack: true,
            label: {
              show: true
            }
          },
          {
            name: 'Zmiana 2',
            type: 'bar',
            data: [],
            stack: true,
            label: {
              show: true
            }
          },
          {
            name: 'Zmiana 3',
            type: 'bar',
            data: [],
            stack: true,
            label: {
              show: true
            }
          }
        ]
      },
      dzien: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // Coordinate axis indicator, coordinate axis trigger is valid
            type: 'shadow' // The default is a straight line, optional:'line' |'shadow'
          }
        },
        grid: {
          left: '2%',
          right: '2%',
          top: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: 'Produkcja',
            type: 'bar',
            data: [],
            color: '#546bfa',
            label: {
              show: true
            }
          }
        ]
      },
      xls: []
    }
  },
  methods: {
    sockopen () {
      this.$socket.send('hey')
    },
    sock (data) {
      data = JSON.parse(data.data)
      if (data.client === this.$route.params.app) {
        this.status = data.status
        var ton = (data.worek * 15.0) / 1000.0
        this.info[0].value = data.worek + ' (' + ton.toFixed(2) + ' ton)'
        this.activity = date.formatDate(Date.parse(data.data), 'YYYY-MM-DD HH:mm')
      }
      // console.log(data)
    },
    loadCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Dashboard')
      } else {
        data = data.data
        var dash = data.vDashboards.nodes
        if (dash.length !== 0) {
          this.info[1].value = dash[0].average
          this.info[2].value = dash[0].week
          this.info[3].value = dash[0].month
          this.info[4].value = dash[0].year
          this.info[5].value = dash[0].total
          var dayL = []
          var dayD = []
          dash[0].gDay.forEach((value) => {
            dayL.push(value.hour)
            dayD.push(value.worki)
          })
          // console.log(dayD, dayL)
          this.dzien.series[0].data = dayD
          this.dzien.xAxis[0].data = dayL
          var mthL = [[], [], []]
          var mthD = [[], [], []]
          dash[0].gMonth.forEach((value) => {
            mthL[value.shift - 1].push(value.day)
            mthD[value.shift - 1].push(value.tony)
          })
          this.dzien.series[0].data = dayD
          this.dzien.xAxis[0].data = dayL
          this.miesiac.series[0].data = mthD[0]
          this.miesiac.series[1].data = mthD[1]
          this.miesiac.series[2].data = mthD[2]
          this.miesiac.xAxis[0].data = mthL[0]
          var yeaL = []
          var yeaD = []
          dash[0].gYear.forEach((value) => {
            yeaL.push(value.day)
            yeaD.push(value.tony)
          })
          this.rok.series[0].data = yeaD
          this.rok.xAxis[0].data = yeaL
          this.xls = dash[0].history
          this.sockopen()
        }
        // this.xls = data.vMr009Data.nodes
      }
      this.loading = false
    },
    bread () {
      this.$root.$children[0].$children[0].breadcrumbs = [{ label: 'Strona główna', icon: 'home', to: '/' }]
      if (this.$route.params.app) this.$root.$children[0].$children[0].breadcrumbs.push({ label: this.$route.params.app, icon: undefined, click: '' })
      this.$root.$children[0].$children[0].breadcrumbs.push({ label: 'Dashboard', icon: undefined, click: '' })
      // websocket
      this.$options.sockets.onmessage = (data) => this.sock(data)
      this.$options.sockets.onopen = (data) => this.sockopen()
      // this.sockopen()
    },
    randomizeFloat (min, max) {
      // return min + (max - min) * Math.random()
      return min + Math.floor((max - min) * Math.random())
    }
  }
}
</script>

<style scoped>

</style>
