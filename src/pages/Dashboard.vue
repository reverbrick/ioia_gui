<template>
  <q-page class="q-pa-md q-gutter-md">
    <div class="row items-start justify-center q-gutter-md">
      <q-card v-if="status==1" class="col-3 col-md-3">
        <q-item style="background-color: red" class="q-pa-none">
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
      <q-card v-else-if="status==2" class="col-3 col-md-3">
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
      <q-card v-else-if="status==3" class="col-3 col-md-3">
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
      <q-card v-else class="col-3 col-md-3">
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
            <q-icon
              :name="item.icon"
              size="20px"
              class="q-ml-xs"
            />
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
    <div class="row items-start justify-center q-gutter-md">
      <q-card v-for="(item, i) in chart" v-bind:key="i" class="col-3 col-md-3">
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
    this.roll()
    // this.$q.loading.show()
  },
  data () {
    return {
      status: 0,
      pie: ['Wykres1', 'Wykres2', 'Wykres3', 'Wykres4'],
      chart: ['Dzień', 'Miesiąc', 'Rok'],
      option: ['dzien', 'dzien', 'dzien'],
      info: [
        { title: 'Dzienny uzysk', value: 0, icon: 'trending_flat' },
        { title: 'Średnio szt/h', value: 0, icon: 'trending_flat' },
        { title: 'Bieżący tydzień', value: 0, icon: 'trending_flat' },
        { title: 'Produkcja listopad', value: 0, icon: 'trending_flat' },
        { title: 'Produkcja 2020', value: 0, icon: 'trending_flat' },
        { title: 'Produkcja całkowita', value: 0, icon: 'trending_flat' }
      ],
      data: [
        [40, 45, 27, 50, 32, 50, 70, 30, 30, 40, 67, 29],
        [40, 45, 27, 50, 32, 50, 70, 30, 30, 40, 67, 29],
        [40, 45, 27, 50, 32, 50, 70, 30, 30, 40, 67, 29]
      ]
    }
  },
  computed: {
    dzien () {
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
            data: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
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
            data: this.data[0],
            color: '#546bfa'
          }
        ]
      }
    },
    miesiac () {
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
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
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
            data: this.data[1],
            color: '#3a9688'
          }
        ]
      }
    },
    rok () {
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
            data: [2014, 2015, 2016, 2017, 2018, 2019, 2020]
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
            data: this.data[2],
            color: '#02a9f4'
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
    bread () {
      this.$root.$children[0].$children[0].breadcrumbs = [{ label: 'Strona główna', icon: 'home', to: '/' }]
      if (this.$route.params.app) this.$root.$children[0].$children[0].breadcrumbs.push({ label: this.$route.params.app, icon: undefined, click: '' })
      this.$root.$children[0].$children[0].breadcrumbs.push({ label: 'Dashboard', icon: undefined, click: '' })
    },
    randomizeFloat (min, max) {
      // return min + (max - min) * Math.random()
      return min + Math.floor((max - min) * Math.random())
    },
    roll () {
      const tr = [
        'trending_up',
        'trending_down',
        'trending_flat'
      ]
      const col = [
        'green',
        'red',
        'grey'
      ]
      this.status = this.randomizeFloat(1, 4)
      for (var i = 0; i < this.info.length; i++) {
        var z = this.randomizeFloat(10, 30)
        if (i === 0) this.info[i].value = z * 12
        else if (i === 1) this.info[i].value = z
        else if (i === 2) this.info[i].value = z * 12 * 7
        else if (i === 3) this.info[i].value = z * 12 * 30
        else if (i === 4) this.info[i].value = z * 12 * 365
        else if (i === 5) this.info[i].value = z * 12 * 365 * 5
        var x = this.randomizeFloat(0, 3)
        this.info[i].icon = tr[x]
        this.info[i].color = col[x]
      }
      for (var j = 0; j < 12; j++) {
        var y = this.randomizeFloat(10, 30) * 12
        this.data[0][j] = y
        this.data[1][j] = y * 30
        this.data[2][j] = y * 365
      }
    }
  }
}
</script>

<style scoped>

</style>
