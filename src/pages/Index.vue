<template>
  <div>
    <Klient v-if="$route.params.app"/>
    <Metalwit v-else/>
  </div>
</template>

<script>
import Metalwit from 'pages/Index_metalwit'
import Klient from 'pages/Index_klient'
export default {
  components: {
    Metalwit,
    Klient
  }
}
</script>
