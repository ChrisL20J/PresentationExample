<script setup lang="ts">
const { t, locale } = useI18n()

const targetLocale = ref('')

watch(targetLocale, () => {
  locale.value = targetLocale.value
})
</script>

<template>
  <nav text-xl mt-6>
    <RouterLink class="icon-btn mx-2" rel="noreferrer" to="/" :title="t('button.home')">
      <svg width="1em" height="1em"><path fill="currentColor" d="M4 21V9l8-6l8 6v12h-6v-7h-4v7Z" /></svg>
    </RouterLink>

    <RouterLink class="icon-btn mx-2 hover:bg-gray hover:text-black" rel="noreferrer" to="/AUC">
      ROC & AUC
    </RouterLink>

    <select v-model="targetLocale" class="float-right">
      <option disabled value="">
        {{ t('button.toggle_langs') }}
      </option>
      <option value="en">
        English
      </option>
      <option value="zh-TW">
        中文
      </option>
      <!-- <option value="ja">
        日本語
      </option> -->
    </select>
  </nav>
</template>
