<template>
  <div class="q-pa-md">
    <q-img
      :src="url"
      spinner-color="white"
      class="rounded-borders"
      style="max-height: 100vh">
      <div class="absolute-top text-subtitle1 text-center">
        Witamy w apikacji IOIA
      </div>
    </q-img>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: 'statics/alsanit widok 3d.PNG'
    }
  }
}
</script>
