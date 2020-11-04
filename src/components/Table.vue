<template>
  <q-table :title="label" :columns="columns" :data="rows" row-key="nodeId" dense virtual-scroll :pagination.sync="pagination" :rows-per-page-options="[0]" style="height: 400px">
    <template v-slot:body-cell="props">
      <q-td v-if="props.value=='#check#'" :props="props">
        <q-icon name="check_circle" color="green" style="font-size: 20px;" />
      </q-td>
      <q-td v-else :props="props">
        {{props.value}}
      </q-td>
    </template>
  </q-table>
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
      columns: [],
      pagination: {
        rowsPerPage: 0
      }
    }
  }
}
</script>
