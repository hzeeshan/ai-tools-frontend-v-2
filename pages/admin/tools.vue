<template>
  <main>
    <section>
      <div class="d-flex justify-space-around py-5">
        <h1>Apps</h1>
        <v-btn color="primary" @click="openDialog">Create New App</v-btn>
      </div>
    </section>
  </main>
</template>
  
<script setup>
const { $axios } = useNuxtApp();
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const dialog = ref(false);

const openDialog = () => {
  dialog.value = true;
  getCategories();
};
</script>
  
<style scoped>
.cursor-pointer:hover {
  cursor: pointer;
}
</style>