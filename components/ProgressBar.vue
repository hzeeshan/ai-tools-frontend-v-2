<template>
  <v-progress-linear
    v-if="isLoading"
    indeterminate
    top
    color="amber"
  ></v-progress-linear>
</template>
<script setup>
const { $generalStore } = useNuxtApp();
const isLoading = computed(() => $generalStore.isLoading);
</script>
