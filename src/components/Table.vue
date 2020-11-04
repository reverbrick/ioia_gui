<template>
  <div class="q-pa-md">
    <q-table
      @request="loadData"
      @row-click="editRow"
      :title="label"
      :columns="columns"
      :data="rows"
      :loading="this.$apollo.queries.rows.loading"
      :pagination.sync="pagination" :rows-per-page-options="[0]"
      row-key="nodeId"
      dense virtual-scroll style="height: 400px">
      <template v-slot:top-right>
        <q-btn-group>
          <q-btn glossy icon="note_add" dense no-caps label="Dodaj" color="primary" @click="openPopup(true)" />
          <q-input class="q-ml-sm" dense debounce="300" ref="search" v-model="filter" placeholder="Szukaj" v-on:change.prevent="loadData()">
            <template v-slot:append>
              <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetSearch" />
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn-dropdown glossy icon="search" dense no-caps label="Filtry" color="primary">
            <q-form class="q-gutter-md">
              <q-card-section class="q-pt-none q-gutter-md">
                <template v-for="(item, i) in filters">
                  <q-toggle v-if="item.type=='boolean'" stack-label :required="item.required" v-bind:key="item.field" v-model="data[fields[i].field]" :label="item.label" :type="item.type"/>
                  <q-input v-else stack-label :required="item.required" v-bind:key="item.field" filled v-model="data[fields[i].field]" :label="item.label" :type="item.type"/>
                </template>
              </q-card-section>
              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn label="Zapisz" type="submit" color="primary"/>
                <q-btn label="Anuluj" type="reset" color="primary" v-close-popup />
              </q-card-actions>
            </q-form>
          </q-btn-dropdown>
          <q-btn glossy icon="file_copy" dense no-caps label="Eksport" color="primary" @click="csv"/>
        </q-btn-group>
      </template>
      <template v-slot:body-cell="props">
        <q-td v-if="props.value=='#check#'" :props="props">
          <q-icon name="check_circle" color="green" style="font-size: 20px;" />
        </q-td>
        <q-td v-else :props="props">
          {{props.value}}
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import gql from 'graphql-tag'
export default {
  apollo: {
    sourceByName: {
      query: gql`query ($model: String!) {
        sourceByName(name: $model) {
          label
          query
          columns
        }
      }`,
      variables () {
        return {
          model: this.$route.params.model
        }
      },
      update (data) {
        if (data.sourceByName !== null) {
          this.query = data.sourceByName.query
          this.label = data.sourceByName.label
          if (data.sourceByName.columns) {
            this.columns = data.sourceByName.columns
          } else {
            this.columns = undefined
          }
          this.$nextTick(() => { this.$apollo.queries.rows.skip = false })
        } else {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: `Wystąpił błąd przy ładowaniu definicji elementu ${this.$route.params.model}!`,
            caption: 'Nie znaleziono elementu.',
            icon: 'report_problem'
          })
        }
        return data
      },
      error (error) {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: `Wystąpił błąd przy ładowaniu definicji elementu ${this.$route.params.model}!`,
          caption: error.toString(),
          icon: 'report_problem'
        })
      }
    },
    rows: {
      query () {
        return gql`query {rows: ${this.query}}`
      },
      update (data) {
        return data.rows.nodes
      },
      error (error) {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: `Wystąpił błąd przy ładowaniu elementu ${this.$route.params.model}!`,
          caption: error.toString(),
          icon: 'report_problem'
        })
      },
      skip () {
        return this.skipQuery
      }
    }
  },
  data () {
    return {
      query: '',
      label: '',
      filter: '',
      columns: [],
      filters: [],
      pagination: {
        rowsPerPage: 0
      }
    }
  },
  methods: {
    loadData (props) {
      console.log(props)
      /*
      if (typeof props !== 'undefined') {
        this.pagination = props.pagination
      }
      var q = ''
      var dir = 'asc'
      if (this.pagination.descending) {
        dir = 'desc'
      }
      if (this.pagination.sortBy) {
        q = `?q=(order_column:${this.pagination.sortBy},order_direction:${dir})`
      }
      axiosGet(this, this.model, 'data', `${this.model}/${q}`, this.loadCallback)
      */
    },
    openPopup (val) {
      // this.$emit('openPopup', val)
      // this.$emit('editRow', '0')
    },
    editRow (evt, row, index) {
      this.$emit('editRow', row.nodeId)
    },
    csv () {
      this.$q.notify({
        message: 'Export',
        color: 'info'
      })
    },
    resetSearch () {
      this.filter = ''
      this.loadData({
        pagination: this.pagination,
        filter: ''
      })
      this.$refs.search.focus()
    }
  }
}
</script>
