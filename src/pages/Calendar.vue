<template>
  <daykeep-calendar calendar-locale="pl" :tab-labels="labels" :showCards="show"/>
</template>

<script>
import { DaykeepCalendar } from '@daykeep/calendar-quasar'
export default {
  components: {
    DaykeepCalendar
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
      }
    }
  }
}
</script>
