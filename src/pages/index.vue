<script setup lang="ts">
import { reactive } from 'vue'
import jsonObj from './home.json'

const { locale } = useI18n()
const introduction = reactive({ S1: '', S2: '', S3: '' })
const introJson = jsonObj

function introUpdate() {
  introduction.S1 = introJson[locale.value].introduction[0]
  introduction.S2 = introJson[locale.value].introduction[1]
  introduction.S3 = introJson[locale.value].introduction[2]
}

onMounted(introUpdate)
watch(locale, introUpdate)
</script>

<template>
  <main class="mt-30">
    <p>
      {{ introduction.S1 }}
      <br>
      {{ introduction.S2 }}
      <br>
      <span v-html="introduction.S3" />
    </p>
  </main>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
