<script lang="ts" setup>
  import { enLocale, zhLocale } from '@/i18n/index'
  const { locale: language } = useI18n()

  const locale = computed(() => (language.value === 'en' ? enLocale : zhLocale))
</script>
<template>
  <el-config-provider
    :button="{
      autoInsertSpace: true,
    }"
    :locale="locale"
  >
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </el-config-provider>
</template>
