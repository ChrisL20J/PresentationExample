<script setup lang="ts">
const { t, locale } = useI18n()

const targetLocale = ref('')

watch(targetLocale, () => {
  locale.value = targetLocale.value
})
</script>

<template>
  <nav text-xl mt-6>
    <select v-model="targetLocale">
      <option disabled value="">
        {{ t('button.toggle_langs') }}
      </option>
      <option value="en">
        English
      </option>
      <option value="ja">
        日本語
      </option>
      <option value="zh-TW">
        中文
      </option>
    </select>
    <button class="icon-btn mx-2 !outline-none" :title="t('button.toggle_dark')" @click="toggleDark()">
      <div i="carbon-sun dark:carbon-moon" />
    </button>

    <RouterLink class="icon-btn mx-2" rel="noreferrer" to="/" :title="t('button.home')">
      <svg width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 21V9l8-6l8 6v12h-6v-7h-4v7Z" /></svg>
    </RouterLink>

    <!-- <a class="icon-btn mx-2" :title="t('button.toggle_langs')" @click="toggleLocales()">
      <div i-carbon-language />
    </a> -->

    <!-- <a class="icon-btn mx-2" rel="noreferrer" href="ChrisL20J" target="_blank" title="GitHub">
      <div i-carbon-logo-github />
    </a> -->

    <RouterLink class="icon-btn mx-2 mx-5" to="/AUC">
      ROC & AUC
    </RouterLink>
  </nav>
</template>
