<script>
import Slider from '@vueform/slider'
import { ref } from 'vue'

const barValue = ref(0)

export default {
  components: { Slider },
  setup() {
    function barValueUpdate(counter) {
      barValue.value = counter
      console.log(barValue.value)
    }
    return {
      barValueUpdate,
    }
  },
  data: () => ({
    value: 0,
    format: {
      decimals: 2,
    },
    min: 0,
    max: 1,
    step: -1,
    lazy: false,
  }),
}
</script>

<template>
  <Slider v-model="value" class="w-1000px" :format="format" :min="min" :max="max" :step="step" :lazy="lazy" @update="barValueUpdate(value)" />
</template>
