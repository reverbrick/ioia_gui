<template>
  <q-dialog v-model="alert" persistent transition-show="scale" transition-hide="scale">
    <q-card class="bg-red text-white" style="width: 500px">
      <q-card-section>
        <div class="text-h6">Wystąpił błąd w komponencie {{component}}!</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        {{error}}
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-red">
        <q-btn flat label="OK" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data () {
    return {
      alert: false,
      error: '',
      component: ''
    }
  },
  methods: {
    display (err, component) {
      this.error = err
      this.component = component
      this.alert = true
    }
  }
}
</script>
