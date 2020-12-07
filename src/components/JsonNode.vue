<template>
  <q-table
    :title="title"
    :data="json_data"
    :columns="json_cols"
    :pagination="pagination"
    row-key="name"
    separator="cell"
    hide-bottom
    hide-no-data
    dense
  >
  <template v-slot:top-right>
    <q-btn-group>
      <q-btn glossy icon="note_add" dense no-caps label="Dodaj wiersz" color="primary" @click="add" />
    </q-btn-group>
  </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="name" :props="props">
          <q-input v-model="props.row.name" dense borderless />
        </q-td>
        <q-td key="label" :props="props">
          <q-input v-model="props.row.label" dense borderless />
        </q-td>
        <q-td key="field" :props="props">
          <q-input v-model="props.row.field" dense borderless />
        </q-td>
        <q-td key="align" :props="props">
          <q-select dense emit-value map-options v-model="props.row.align" :options="align" borderless />
        </q-td>
        <q-td key="sortable" :props="props">
          <q-toggle dense v-model="props.row.sortable" />
        </q-td>
        <q-td key="required" :props="props">
          <q-toggle dense v-model="props.row.required" />
        </q-td>
        <q-td key="type" :props="props">
          <q-select dense emit-value map-options v-model="props.row.type" :options="type" borderless />
        </q-td>
        <q-td key="model" :props="props">
          <q-input v-model="props.row.model" dense borderless />
        </q-td>
        <q-td key="remove" :props="props">
          <q-btn size="sm" color="red" round dense @click="remove(props.key)" icon="remove" />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
export default {
  props: ['data', 'title', 'model'],
  watch: {
    data: function (newVal, oldVal) {
      if (newVal) {
        this.json_data = newVal
      }
    },
    json_data: function (newVal, oldVal) {
      if (newVal) {
        this.$emit('update-node', this.model, newVal)
      }
    }
  },
  data () {
    return {
      json_data: [],
      json_cols: [
        { name: 'name', label: 'Nazwa', field: 'name', align: 'left', style: 'width: 80px' },
        { name: 'label', label: 'Opis', field: 'label', align: 'left', style: 'width: 80px' },
        { name: 'field', label: 'Pole', field: 'field', align: 'left', style: 'width: 80px' },
        { name: 'align', label: 'Wyrównanie', field: 'align', align: 'left', style: 'width: 80px' },
        { name: 'sortable', label: 'Sortowanie', field: 'sortable', align: 'left', style: 'width: 80px' },
        { name: 'required', label: 'Wymagane', field: 'required', align: 'left', style: 'width: 80px' },
        { name: 'type', label: 'Typ', field: 'type', align: 'left', style: 'width: 80px' },
        { name: 'model', label: 'Model', field: 'model', align: 'left', style: 'width: 80px' },
        { name: 'remove', label: 'Usuń', align: 'left', style: 'width: 20px' }
      ],
      align: ['left', 'right', 'center'],
      bool: [true, false],
      type: [null, 'text', 'boolean', 'time', 'date', 'select', 'email', 'tel', 'json_node', 'markdown', 'related_name', 'check'],
      pagination: {
        rowsPerPage: 0
      }
    }
  },
  methods: {
    add () {
      this.json_data.push({ name: `new_${this.json_data.length + 1}` })
    },
    remove (id) {
      for (var i = 0; i < this.json_data.length; i++) {
        if (this.json_data[i].name === id) this.json_data.splice(i, 1)
      }
    }
  }
}
</script>
