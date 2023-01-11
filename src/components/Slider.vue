<script>
import Slider from '@vueform/slider'

export default {
  components: { Slider },
  data: () => ({
    value: 20,
  }),
}
</script>

<template>
  <Slider v-model="threshold.count" class="w-1000px" />
</template>
