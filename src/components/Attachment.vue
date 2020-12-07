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
  props: ['model', 'field', 'id', 'max', 'label'],
  watch: {
    id: {
      handler: function () {
        this.upload_url = `${this.backend}?model=${this.model}&id=${this.id}`
      },
      deep: true,
      immediate: true
    }
  },
  mounted: function () {
    this.populate(this.thecallback)
  },
  data () {
    return {
      upload_url: `${this.backend}?model=${this.model}&id=${this.id}`,
      backend: 'https://mrproj2.ioia.io/upload/'
    }
  },
  methods: {
    file_remove (obj) {
      this.$axios.delete(`${this.backend}?model=${this.model}&id=${this.id}`, { data: obj[0].name })
    },
    populate (callback) {
      fetch(`${this.backend}?model=${this.model}&id=${this.id}`)
        .then(response => response.json())
        .then(
          function (data) {
            if (callback) {
              callback(data)
            }
          }
        )
    },
    thecallback (data) {
      this.$refs.attachment.files = data.files
    }
  }
}
</script>
