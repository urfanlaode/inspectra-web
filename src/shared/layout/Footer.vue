<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer class="px-6 py-3 text-xs text-muted">{{ t('app.footer') }}</footer>
</template>
