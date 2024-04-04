<template>
  <div class="mb-5">
    <v-text-field
      :loading="loading"
      v-model="searchQuery"
      variant="solo"
      :label="currentPlaceholder"
      append-inner-icon="mdi-magnify"
      single-line
      hide-details
      @click:append-inner="triggerSearch"
      @keydown.enter="triggerSearch"
    ></v-text-field>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";
const emit = defineEmits(["search"]);
const { $axios } = useNuxtApp();
const loading = ref(false);
const searchQuery = ref("");

const triggerSearch = async () => {
  const query = searchQuery.value.trim();

  if (query !== "") {
    try {
      loading.value = true;
      const response = await $axios.get(`/api/tools/search?query=${query}`);
      emit("search", response.data);
      loading.value = false;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};

const placeholders = ["Search", "ChatGPT", "Midjourney"];
const currentPlaceholder = ref(placeholders[0]);
let index = 0;
const isFocused = ref(false);

let interval; // Declare the interval variable

onMounted(() => {
  interval = setInterval(() => {
    index = (index + 1) % placeholders.length; // Increment the index, and wrap around when reaching the end
    currentPlaceholder.value = placeholders[index];
  }, 2000); // 2000 milliseconds = 2 seconds
});

onBeforeUnmount(() => {
  clearInterval(interval); // Clear the interval to prevent memory leaks
});
</script>
<style>
</style>