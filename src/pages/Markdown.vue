<template>
  <div class="q-pa-md">
    <q-markdown :src="markdown" class="fit bordered q-pa-sm" ></q-markdown>
  </div>
</template>

<script>
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
export default {
  components: {
    QMarkdown
  },
  mounted: function () {
    this.loadData()
  },
  watch: {
    $route: {
      handler: function () {
        this.loadData()
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      markdown: ''
    }
  },
  methods: {
    loadData () {
      this.loading = true
      this.$axios.get(`${this.api_link}/tresc/get/${this.$route.params.app}/${this.$route.params.id}`)
        .then((response) => {
          this.markdown = response.data.data
          this.loading = false
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Error loading table!',
            icon: 'report_problem'
          })
          this.loading = false
        })
    }
  }
}
</script>
