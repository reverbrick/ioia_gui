<template>
  <div>
    <q-table
        :columns="columns"
        :data="tableData"
        row-key="id"
        dense
    />
  </div>
</template>

<script>
import gql from 'graphql-tag'
export default {
  name: 'BooksSubscribeToMore',
  apollo: {
    departments: {
      query: gql`
        query {
          departments {
            nodes {
              id
              nodeId
              name
            }
          }
        }
      `
    }
  },
  watch: {
    departments () {
      this.tableData = []
      this.departments.nodes.forEach((value) => {
        this.tableData.push(value)
      })
    }
  },
  data () {
    return {
      columns: [
        { name: 'id', label: 'ID', field: 'id', sortable: true, required: true },
        { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true }
      ],
      tableData: []
    }
  }
}
</script>
