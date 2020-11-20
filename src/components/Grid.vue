<template>
  <div class="q-pa-md">
    <q-table
      :title="$route.meta.title"
      :columns="columns"
      :data="rows"
      separator="cell"
      hide-bottom
      :pagination="pagination"
      wrap-cells
      class="sticky-header"
      :loading="loading"
      virtual-scroll
      style="height: 103vh"
      row-key="id"
      dense>
      <template v-slot:top-right>
        <q-select filled dense emit-value map-options v-model="shift" style="width:200px" :options="shifts" label="Wybierz zmianę" />
        <q-input filled dense v-model="start" mask="date" label="Data początkowa">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="start" no-unset/>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell="props">
        <q-td v-if="props.col.type=='day' && props.value" :props="props">
          <q-btn :color="props.value.typ" style="width:100px; height:70px;" no-caps>
            {{props.value.val}}
          </q-btn>
        </q-td>
        <q-td v-else-if="props.col.type=='day'" :props="props" @click="add(props.col.field, props.key)" />
        <q-td v-else :props="props">
          {{props.value}}
        </q-td>
      </template>
    </q-table>
    <Error ref="err"/>
  </div>
</template>

<script>
import { date } from 'quasar'
import Error from 'components/Error'
import { apolloQuery } from '../boot/ioia.js'

var queries = {
  schedule: 'vSchedules (filter: {or: [{date: {greaterThanOrEqualTo: $start, lessThanOrEqualTo: $end}}, {date: {isNull: true}}]}) {nodes {id name department val date typ}}',
  holiday: 'vHolidays (filter: {or: [{date: {greaterThanOrEqualTo: $start, lessThanOrEqualTo: $end}}, {date: {isNull: true}}]}) {nodes {id name department val date typ}}'
}

// smth better
var titles = {
  schedule: 'Grafik',
  holiday: 'Urlopy'
}

export default {
  components: {
    Error
  },
  mounted () {
    this.loadDates()
    this.loadShifts()
    this.$route.meta.title = titles[this.$route.params.model]
  },
  watch: {
    $route: function (newVal) {
      this.query = queries[this.$route.params.model]
      this.loadDates()
      this.$route.meta.title = titles[this.$route.params.model]
    },
    start: function () {
      this.loadDates()
    }
  },
  data () {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    return {
      loading: false,
      start: date.formatDate(firstDay, 'YYYY/MM/DD'),
      end: date.formatDate(lastDay, 'YYYY/MM/DD'),
      // query: 'vSchedules (filter: {or: [{date: {greaterThanOrEqualTo: $start, lessThanOrEqualTo: $end}}, {date: {isNull: true}}]}) {nodes {name department val date typ}}',
      query: queries[this.$route.params.model],
      rows: [],
      columns: [],
      pagination: {
        rowsPerPage: 0
      },
      shift: null,
      shifts: []
    }
  },
  methods: {
    loadGrid () {
      apolloQuery(
        `query ($start: Date!, $end: Date!) {rows: ${this.query}}`,
        {
          start: this.start,
          end: this.end
        },
        this.gridLoadCallback
      )
    },
    gridLoadCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Grid')
      } else {
        data = data.data
        this.loading = true
        var out = {}
        var rows = []
        data.rows.nodes.forEach(function (row) {
          if (out[row.name]) {
            out[row.name][row.date] = { val: row.val, typ: row.typ }
          } else {
            out[row.name] = {}
            out[row.name][row.date] = { val: row.val, typ: row.typ }
            out[row.name].department = row.department
            out[row.name].name = row.name
            out[row.name].id = row.id
          }
        })
        Object.keys(out).forEach(function (row) {
          rows.push(out[row])
        })
        this.loading = false
        this.rows = rows
      }
    },
    loadDates () {
      this.loading = true
      apolloQuery(
        `mutation ($start: Date!)
        {fDates(input: {start: $start}) {
          clientMutationId
          results {
            days
            dow
            date
          }
        }}`,
        {
          start: this.start
        },
        this.datesLoadCallback
      )
    },
    datesLoadCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Grid')
      } else {
        var cols = data.data.fDates.results
        var columns = [
          { label: 'Pracownik', align: 'left', field: 'name', style: 'min-width: 200px;', name: 'name', sortable: true },
          { label: 'Dział', align: 'left', field: 'department', style: 'min-width: 150px;', name: 'department', sortable: true }
        ]
        cols.forEach(function (col) {
          var out = { field: col.date, label: col.days, align: 'center', style: 'min-width: 100px; height: 100px;', type: 'day', sortable: false }
          if (col.dow === 6 | col.dow === 7) out.classes = 'bg-grey-2'
          columns.push(out)
        })
        this.columns = columns
        this.loading = false
        this.loadGrid()
      }
    },
    loadShifts () {
      apolloQuery(
        `query {shifts {
          nodes {
            id
            timeFrom
            timeTo
          }
        }}`,
        {},
        this.shiftsLoadCallback
      )
    },
    shiftsLoadCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Grid')
      } else {
        data = data.data
        var shifts = [{ value: null, label: null }]
        data.shifts.nodes.forEach(function (shift) {
          shifts.push({ value: shift.id, label: shift.timeFrom + ' - ' + shift.timeTo })
        })
        this.shifts = shifts
      }
    },
    // TODO: REPLACE WITH FUNCTION THAT REPLACES AND/OR REMOVES IF NULL PASSED. FOR NOW WE DO DOUBLE ENTRIES
    add (dat, uid) {
      if (this.shift) {
        apolloQuery(
          'mutation ($data: ScheduleInput!) {createSchedule (input: {schedule: $data}){clientMutationId}}',
          {
            data: {
              userId: uid,
              date: dat,
              shiftId: this.shift
            }
          },
          this.createCallback
        )
      }
    },
    createCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Grid')
      } else {
        this.loadGrid()
      }
    }
  }
}
</script>
