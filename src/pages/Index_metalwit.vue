<template>
  <div class="q-pa-md">
    <daykeep-calendar calendar-locale="pl" :tab-labels="labels" :showCards="show" :event-array="data" />
    <q-dialog v-model="popup">
      <q-card class="col-3">
        <q-card-section class="row items-center q-pb-none">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <img :src=" 'statics/'+file+'.png' ">
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="popup_md">
      <q-card class="col-3">
        <q-card-section class="row items-center q-pb-none">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-markdown :src="markdown" class="fit bordered q-pa-sm" ></q-markdown>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { DaykeepCalendar } from '@daykeep/calendar-quasar'
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
export default {
  components: {
    DaykeepCalendar,
    QMarkdown
  },
  data () {
    return {
      show: [
        'month',
        'week',
        'day',
        'agenda '
      ],
      labels: {
        month: 'Miesiąc',
        week: 'Tydzień',
        day: 'Dzień',
        threeDay: 'Trzy dni',
        agenda: 'Lista'
      },
      popup: false,
      popup_md: false,
      file: '',
      markdown: '',
      data: [
        {
          id: 1,
          summary: 'Karta projektu',
          description: 'Przygotowanie karty projektu',
          start: {
            date: '2021-01-16'
          },
          end: {
            date: '2021-02-27'
          }
        },
        {
          id: 2,
          summary: 'Testowe zdarzenie',
          description: 'Test test...',
          start: {
            dateTime: '2020-11-17' // timezone embedded in dateTime
          },
          end: {
            dateTime: '2020-11-17'
          }
        }
      ]
    }
  },
  methods: {
    showFile (file) {
      this.file = file
      this.popup = true
    },
    showMarkdown (doc) {
      this.loading = true
      this.$axios.get(`${this.api_link}/tresc/${doc}?q=(keys:!(none))`)
        .then((response) => {
          this.markdown = response.data.result.tresc
          this.popup_md = true
          this.loading = false
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Error loading table!',
            icon: 'report_problem'
          })
          this.loading = false
        })
    }
  }
}
</script>
