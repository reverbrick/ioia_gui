<template>
  <q-page>
    <!-- when the query response is not received yet, data from it is undefined,
    so before referring to it we need to use v-if -->
    <div v-if="department">Result:<br />{{ department.name }}</div>
    <div v-else>
      loading...
    </div>
  </q-page>
</template>

<script>
import gql from 'graphql-tag'
export default {
  name: 'PageIndex',
  apollo: {
    department: {
      query: gql`
        query {
          department(id: 5) {
            name
          }
        }
      `
    }
  }
}
</script>
