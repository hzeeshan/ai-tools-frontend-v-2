<template>
  <div>
    <v-app>
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
  }
});
</script>