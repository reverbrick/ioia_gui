<template>
  <q-splitter v-model="splitterModel" style="height: 670px;">
    <template v-slot:separator>
      <q-avatar color="primary" text-color="white" size="28px" icon="sync_alt" />
    </template>
    <template v-slot:before>
      <div class="q-pa-md">
        <textarea v-model="body" rows="30" class="fit q-pa-sm" />
      </div>
    </template>
    <template v-slot:after>
      <div class="q-pa-md" style="height: 467px;">
        <q-markdown :src="body" class="fit bordered q-pa-sm" ></q-markdown>
      </div>
    </template>
  </q-splitter>
</template>
<style src="@quasar/quasar-ui-qmarkdown/dist/index.css"></style>

<script>
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
export default {
  components: {
    QMarkdown
  },
  props: ['data', 'title', 'model'],
  watch: {
    data: function (newVal, oldVal) {
      if (newVal) {
        this.body = newVal
      }
    },
    body: function (newVal, oldVal) {
      if (newVal) {
        console.log(newVal)
        this.$emit('update-node', this.model, newVal)
      }
    }
  },
  data () {
    return {
      body: '',
      splitterModel: 50
    }
  },
  methods: {
  }
}
</script>
