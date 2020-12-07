<template>
  <q-page class="q-pa-md q-gutter-md">
    <div class="row items-start justify-center q-gutter-md">
      <q-card class="col-3 col-md-3">
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
      <!--
      <q-card class="col-3 col-md-3">
        <q-item style="background-color: #C10015" class="q-pa-none">
          <q-item-section avatar>
            <q-icon color="white" name="settings_applications" size="44px"/>
          </q-item-section>
          <q-item-section class="q-pa-md q-ml-none text-white">
            <q-item-label class="text-white text-h6 text-weight-bolder">Wyłączona</q-item-label>
            <q-item-label>Nie pracuje</q-item-label>
          </q-item-section>
          <q-item-section side class="q-mr-md text-white">
            <q-icon name="fas fa-dollar-sign" color="white" size="44px"></q-icon>
          </q-item-section>
        </q-item>
      </q-card>
      <q-card class="col-3 col-md-3">
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
      <q-card class="col-3 col-md-3">
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
    -->
    </div>
    <div class="row items-start justify-center q-gutter-md">
      <q-card v-for="(item, i) in info" v-bind:key="i" class="col-1 col-md-1">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <q-icon :name="item.icon" size="30px"></q-icon>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{item.value}}</q-item-label>
            <q-item-label caption>
              {{item.title}}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
    </div>
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
    <div class="row items-start justify-center q-gutter-md">
      <q-card v-for="(item, i) in chart" v-bind:key="i" class="col-3 col-md-3">
        <q-item>
          <q-item-section>
            <q-item-label>{{item}}</q-item-label>
          </q-item-section>
        </q-item>
        <IEcharts style="height: 250px" :option="getSalesOptions" :resizable="true"/>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import IEcharts from 'vue-echarts-v3/src/full.js'

export default {
  name: 'Dashboard2',
  components: {
    IEcharts
  },
  watch: {
    $route: function (newVal) {
      this.bread()
    }
  },
  mounted () {
    this.bread()
    // this.$q.loading.show()
  },
  data () {
    return {
      pie: ['Wykres1', 'Wykres2', 'Wykres3', 'Wykres4'],
      chart: ['Dzień', 'Miesiąc', 'Rok'],
      info: [
        { title: 'Dzienny uzysk', value: 0, icon: 'trending_flat' },
        { title: 'Średnio szt/h', value: 0, icon: 'trending_flat' },
        { title: 'Bieżący tydzień', value: 0, icon: 'trending_flat' },
        { title: 'Produkcja listopad', value: 0, icon: 'trending_flat' },
        { title: 'Produkcja 2020', value: 0, icon: 'trending_flat' },
        { title: 'Produkcja całkowita', value: 0, icon: 'trending_flat' }
      ]
    }
  },
  computed: {
    getSalesOptions () {
      return {
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
        series: []
      }
    },
    getPieOptions () {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          bottom: 0,
          left: 'center',
          data: ['Produkt1', 'Produkt2', 'Produkt3', 'Produkt4']
        },
        series: [
          {
            name: 'Sales',
            type: 'pie',
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: 335,
                name: 'Produkt1',
                itemStyle: {
                  color: '#546bfa'
                }
              },
              {
                value: 310,
                name: 'Produkt2',
                itemStyle: {
                  color: '#3a9688'
                }
              },
              {
                value: 234,
                name: 'Produkt3',
                itemStyle: {
                  color: '#02a9f4'
                }
              },
              {
                value: 135,
                name: 'Produkt4',
                itemStyle: {
                  color: '#f88c2b'
                }
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    bread () {
      this.$root.$children[0].$children[0].breadcrumbs = [{ label: 'Strona główna', icon: 'home', to: '/' }]
      if (this.$route.params.app) this.$root.$children[0].$children[0].breadcrumbs.push({ label: this.$route.params.app, icon: undefined, click: '' })
      this.$root.$children[0].$children[0].breadcrumbs.push({ label: 'Dashboard', icon: undefined, click: '' })
    }
  }
}
</script>

<style scoped>

</style>
