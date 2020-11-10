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
      dense>
      <template v-slot:top-right>
        <q-input filled dense v-model="start" mask="date" :rules="['date']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="start">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
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
        <!--
        <q-td v-else-if="props.col.type=='day'" :props="props">
          <q-btn size="xs" round icon="add"/>
        </q-td>
        -->
        <q-td v-else :props="props">
          {{props.value}}
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { date } from 'quasar'

var queries = {
  schedule: 'vSchedules (filter: {or: [{date: {greaterThanOrEqualTo: $start, lessThanOrEqualTo: $end}}, {date: {isNull: true}}]}) {nodes {name department val date typ}}',
  holiday: 'vHolidays (filter: {or: [{date: {greaterThanOrEqualTo: $start, lessThanOrEqualTo: $end}}, {date: {isNull: true}}]}) {nodes {name department val date typ}}'
}

// smth better
var titles = {
  schedule: 'Grafik',
  holiday: 'Urlopy'
}

export default {
  apollo: {
    rows: {
      query () {
        return gql`query ($start: Date!, $end: Date!) {rows: ${this.query}}`
      },
      variables () {
        return {
          start: this.start,
          end: this.end
        }
      },
      errorPolicy: 'all',
      update (data) {
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
          }
        })
        Object.keys(out).forEach(function (row) {
          rows.push(out[row])
        })
        this.loadData()
        this.loading = false
        return rows
      },
      error (error) {
        this.alert = true
        this.error = error
      }
    }
  },
  watch: {
    $route: function (newVal) {
      this.query = queries[this.$route.params.model]
      this.$apollo.queries.rows.refetch()
      this.$route.meta.title = titles[this.$route.params.model]
    }
  },
  mounted: function () {
    this.$route.meta.title = titles[this.$route.params.model]
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
      }
    }
  },
  methods: {
    loadData () {
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation ($start: Date!)
        {fDates(input: {start: $start}) {
          clientMutationId
          results {
            days
            dow
            date
          }
        }}`,
        variables: {
          start: this.start
        }
      }).then((data) => {
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
      }).catch((error) => {
        this.alert = true
        this.error = error
        this.loading = false
      })
    }
  }
}
</script>
