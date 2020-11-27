<template>
  <q-page class="q-pa-md q-gutter-md">
    <div class="row items-start justify-center q-gutter-md">
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
  mounted () {
    // this.$q.loading.show()
    this.$root.$children[0].$children[0].breadcrumbs = [
      { label: 'Strona główna', icon: 'home', to: '/' },
      { label: 'Dashboard', icon: undefined, click: '' }
    ]
  },
  data () {
    return {
      pie: ['Wykres1', 'Wykres2', 'Wykres3', 'Wykres4'],
      chart: ['Wykres1', 'Wykres2', 'Wykres3'],
      info: [
        { title: 'Dzienny uzysk', value: 150, icon: 'trending_up' },
        { title: 'Średnio szt/h', value: 19, icon: 'trending_up' },
        { title: 'Bieżący tydzień', value: 400, icon: 'trending_down' },
        { title: 'Produkcja listopad', value: 1000, icon: 'trending_flat' },
        { title: 'Produkcja 2020', value: 2000, icon: 'trending_up' },
        { title: 'Produkcja całkowita', value: 6000, icon: 'trending_up' }
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
            data: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru']
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
            name: 'Produkt1',
            type: 'bar',
            data: [40, 45, 27, 50, 32, 50, 70, 30, 30, 40, 67, 29],
            color: '#546bfa'
          },
          {
            name: 'Produkt2',
            type: 'bar',
            data: [124, 100, 20, 120, 117, 70, 110, 90, 50, 90, 20, 50],
            color: '#3a9688'
          },
          {
            name: 'Produkt3',
            type: 'bar',
            data: [17, 2, 0, 29, 20, 10, 23, 0, 8, 20, 11, 30],
            color: '#02a9f4'
          },
          {
            name: 'Produkt4',
            type: 'bar',
            data: [20, 100, 80, 14, 90, 86, 100, 70, 120, 50, 30, 60],
            color: '#f88c2b'
          }
        ]
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
  }
}
</script>

<style scoped>

</style>
