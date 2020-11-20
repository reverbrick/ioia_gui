<template>
  <div class="q-px-md">
    <q-table
      title="Szczegóły"
      :columns="columns"
      :data="rows"
      row-key="nodeId"
      separator="cell"
      selection="none"
      :class="tclass"
      hide-header
      hide-bottom
      dense>
      <template v-slot:body-cell="props">
        <q-td v-if="props.col.type=='check'" :props="props">
          <q-icon v-if="props.value==true" name="check_circle" color="green" style="font-size: 20px;" />
        </q-td>
        <q-td v-else-if="props.col.type=='related_name'" :props="props">
          {{check_null_name(props.value)}}
        </q-td>
        <q-td v-else-if="props.col.type=='icon'" :props="props">
          <q-icon v-if="props.value!=null" :name="props.value" style="font-size: 20px;" />
        </q-td>
        <q-td v-else :props="props">
          {{props.value}}
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>

export default {
  props: {
    tclass: { default: 'sticky-header' }
  },
  data () {
    return {
      columns: [
        { name: 'name', field: 'name', align: 'right', classes: 'bg-grey-2', style: 'width: 150px' },
        { name: 'value', field: 'value', align: 'left' }
      ],
      rows: [],
      pagination: {
        offset: 0,
        first: 10,
        rowsPerPage: 50,
        rowsNumber: 0
      }
    }
  },
  methods: {
    showDetails (row, columns) {
      var out = []
      columns.forEach(function (col) {
        if (col.details) out.push({ name: col.label, value: row[col.field] })
      })
      this.rows = out
    }
  }
}
</script>
