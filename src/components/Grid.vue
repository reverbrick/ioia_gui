<template>
  <div class="q-pa-md">
    <q-table
      :title="title"
      :columns="columns"
      :data="rows"
      separator="cell"
      hide-bottom
      :pagination="pagination"
      wrap-cells
      class="sticky-header"
      virtual-scroll
      style="height: 103vh"
      selection="multiple"
      :selected.sync="selected"
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
        <q-td v-if="props.col.type=='day' && props.value" :props="props" @click="add(props.col.field, props.key)">
          <q-btn :color="props.value.typ" style="width:100px; height:70px;" no-caps @click="add(props.col.field, props.key)">
            <q-spinner v-if="props.value.wait==true"
              color="white"
              size="2em"
            />
            {{props.value.val}}
          </q-btn>
        </q-td>
        <q-td class="cursor-pointer" v-else-if="props.col.type=='day'" :props="props" @click="add(props.col.field, props.key)" />
        <q-td v-else :props="props" @click="select(props.key)">
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
    this.$q.loading.show()
    this.loadDates()
    this.loadShifts()
  },
  watch: {
    $route: function (newVal) {
      this.$q.loading.show()
      this.query = queries[this.$route.params.model]
      this.loadDates()
    },
    start: function () {
      this.$q.loading.show()
      const today = new Date(this.start)
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      this.end = date.formatDate(lastDay, 'YYYY/MM/DD')
      this.loadDates()
    }
  },
  data () {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    return {
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
      shifts: [],
      selected: [],
      title: ''
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
        this.rows = rows
        this.title = titles[this.$route.params.model]
        this.$root.$children[0].$children[0].breadcrumbs = [
          { label: 'Strona główna', icon: 'home', to: '/' },
          { label: titles[this.$route.params.model], icon: undefined, click: '' }
        ]
        this.$q.loading.hide()
      }
    },
    loadDates () {
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
    addSchedule (typ, rows, dat, uid) {
      rows.forEach(function (row) {
        var found = false
        if (row.id === uid) {
          found = true
          row[dat] = { typ: typ, wait: true }
        }
        if (found === false) {
          rows.push({ typ: typ, wait: true })
        }
      })
      apolloQuery(
        'mutation ($uid: Int!, $dat: Date!, $shid: Int) {scheduleAdd (input: {uid: $uid, dat: $dat, shid: $shid}){string}}',
        {
          uid: uid,
          dat: dat,
          shid: this.shift
        },
        this.createCallback
      )
      return rows
    },
    add (dat, uid) {
      var typ = 'red'
      if (this.shift) typ = 'blue'
      var rows = this.rows
      if (this.selected.length === 0) { // update clicked
        rows = this.addSchedule(typ, rows, dat, uid)
      } else { // update multiple
        this.selected.forEach((sel) => {
          rows = this.addSchedule(typ, rows, dat, sel.id)
        })
      }
      this.rows = rows
    },
    createCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Grid')
      } else {
        this.loadGrid()
      }
    },
    select (id) {
      // TODO: select rows on click
      // console.log(id, this.selected)
    }
  }
}
</script>
