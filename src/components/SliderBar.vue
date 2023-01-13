<script>
import Slider from '@vueform/slider'
import { defineEmits, ref } from 'vue'

const emit = defineEmits(['barValueChange'])

export default {
  components: { Slider },
  props: {
    barCount: Number,
  },
  setup(props, { emit }) {
    function barValueUpdate(counter) {
      console.log(counter)
      emit('barValueChange', counter)
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
  <Slider v-model="value" :format="format" :min="min" :max="max" :step="step" :lazy="lazy" @update="barValueUpdate(value)" />
</template>
