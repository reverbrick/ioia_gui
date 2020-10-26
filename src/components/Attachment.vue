<template>
  <q-uploader
    :v-bind:key="field"
    :label="label"
    :max-files="max"
    auto-upload
    @removed="file_remove"
    style="max-width: 300px"
    no-thumbnails
    ref="attachment"
    :url="upload_url"
  />
</template>

<script>
export default {
  props: ['model', 'field', 'id', 'list', 'max', 'label'],
  watch: {
    list: {
      handler: function () {
        this.$refs.attachment.files = this.list
      },
      deep: true,
      immediate: false
    },
    id: {
      handler: function () {
        this.upload_url = `${this.api_link}/upload/?model=${this.model}&id=${this.id}`
      },
      deep: true,
      immediate: true
    }
  },
  populate (list) {
    console.log(list)
    this.$refs.attachment.files = list
  },
  data () {
    return {
      upload_url: `${this.api_link}/upload/?model=${this.model}&id=${this.id}`
    }
  },
  methods: {
    file_remove (obj) {
      this.$axios.delete(`${this.api_link}/upload/?model=${this.model}&id=${this.id}`, { data: { name: obj[0].name } })
    }
  }
}
</script>
