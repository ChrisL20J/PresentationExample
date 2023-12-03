<script setup lang="ts">
const { t, locale } = useI18n()

const targetLocale = ref('')
const show_me = ref(false)
const show_mo = ref(false)
const show_lf = ref(false)

watch(targetLocale, () => {
  locale.value = targetLocale.value
})
</script>

<template>
  <nav text-xl mt-6>
    <RouterLink class="icon-btn mx-2" rel="noreferrer" to="/" :title="t('button.home')">
      <svg width="1em" height="1em"><path fill="currentColor" d="M4 21V9l8-6l8 6v12h-6v-7h-4v7Z" /></svg>
    </RouterLink>

    <div class="icon-btn mx-2">
      <div class="icon-btn mx-2 hover:bg-gray hover:text-black" @click="show_me = !show_me">
        Metrics
      </div>
      <div v-if="show_me">
        <ul>
          <li>
            <RouterLink class="icon-btn hover:bg-gray hover:text-black" rel="noreferrer" to="/AUC" @click="show_me = !show_me">
              ROC & AUC
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="icon-btn mx-2">
      <div class="icon-btn mx-2 hover:bg-gray hover:text-black" @click="show_lf = !show_lf">
        Loss Function
      </div>
      <div v-if="show_lf">
        <ul>
          <li>
            <RouterLink class="icon-btn hover:bg-gray hover:text-black" rel="noreferrer" to="" @click="show_lf = !show_lf">
              coming soon
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="icon-btn mx-2">
      <div class="icon-btn mx-2 hover:bg-gray hover:text-black" @click="show_mo = !show_mo">
        Model
      </div>
      <div v-if="show_mo">
        <ul>
          <li>
            <RouterLink class="icon-btn hover:bg-gray hover:text-black" rel="noreferrer" to="" @click="show_mo = !show_mo">
              coming soon
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>

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
