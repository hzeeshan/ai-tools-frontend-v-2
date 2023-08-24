<template>
  <div>
    <v-app>
      <SeoKit />
      <NuxtLayout class="bg-ghostWhite">
        <NuxtPage />
      </NuxtLayout>
    </v-app>
  </div>
</template>

<script setup>
const { $generalStore } = useNuxtApp();

onMounted(async () => {
  try {
    await $generalStore.hasSessionExpired();
  } catch (e) {
    console.log(e);
  } finally {
  }
});
</script>