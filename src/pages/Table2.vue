<template>
  <vue-table class="box is-paddingless raises-on-hover is-rounded" :path="path" id="example" source=""/>
</template>

<script>
import Vue from 'vue'
import { VueTable } from '@enso-ui/tables/bulma'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
Vue.component('fa', FontAwesomeIcon)
export default {
  components: {
    VueTable
  },
  data () {
    return {
      path: 'http://localhost/statics/table.json'
    }
  },
  mounted: function () {
  },
  methods: {
  }
}
</script>
