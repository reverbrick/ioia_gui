<template>
  <div class="q-pa-md q-gutter-sm fit">
    <qrcode-stream :camera="camera" @decode="onDecode">
    </qrcode-stream>
    <p class="text-subtitle1" v-if="result">Last result: <b>{{ result }}</b></p>
  </div>
</template>

<style>
</style>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
export default {
  name: 'PageIndex',
  components: { QrcodeStream },
  mounted () {
    // this.$q.loading.show()
    this.$root.$children[0].$children[0].breadcrumbs = [
      { label: 'Strona główna', icon: 'home', to: '/' },
      { label: 'Skanuj QR', icon: undefined, click: '' }
    ]
  },
  data () {
    return {
      isValid: undefined,
      camera: 'auto',
      result: null
    }
  },
  methods: {
    async onDecode (content) {
      this.$q.dialog({
        title: 'Znaleziono QR',
        message: content,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.camera = 'auto'
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        this.turnCameraOn()
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
      this.turnCameraOff()
    },
    turnCameraOn () {
      this.camera = 'auto'
    },
    turnCameraOff () {
      this.camera = 'off'
    }
  }
}
</script>
