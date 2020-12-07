<template>
  <div>
    <Table ref="table" v-on:openPopup="openPopup" v-on:editRow="editRow" v-on:registerUser="registerUser" />
    <q-dialog v-model="popup" persistent :full-width="this.$route.params.model=='source' || this.$route.params.model=='static'">
      <Form ref="form" v-on:openPopup="openPopup" v-on:loadData="loadData" />
    </q-dialog>
    <q-dialog v-model="register" persistent>
      <Register v-on:openRegister="openRegister" v-on:loadData="loadData" />
    </q-dialog>
  </div>
</template>

<script>
import Table from 'components/Table'
import Form from 'components/Form'
import Register from 'components/Register'
export default {
  components: {
    Table,
    Form,
    Register
  },
  data () {
    return {
      popup: false,
      register: false
    }
  },
  mounted: function () {
  },
  methods: {
    openPopup (val) {
      this.popup = val
    },
    openRegister (val) {
      this.register = val
    },
    loadData () {
      this.$nextTick(() => { this.$refs.table.loadData() })
    },
    editRow (val) {
      this.popup = true
      this.$nextTick(() => { this.$refs.form.loadForm(val) })
    },
    registerUser () {
      this.register = true
    }
  }
}
</script>
