<template>
  <section>
    <v-container>
      <h1>{{ tagSlug }}</h1>

      <ListOfTools :tools="tools" v-if="tools.length > 0" />

      <div v-else>No tools found for this tag.</div>

      <v-row
        v-if="isLoading"
        class="text-center justify-center my-5"
        style="width: 100%"
      >
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
const route = useRoute();
const { $axios } = useNuxtApp();
const tagSlug = ref(route.params.tagSlug);
const tools = ref([]);
const page = ref(1);
const isLoading = ref(false);
const isLastPage = ref(false);

const fetchTools = async () => {
  if (isLoading.value || isLastPage.value) return; // Prevent fetch if loading or last page reached

  isLoading.value = true;
  try {
    const response = await $axios.get(
      `/api/tags/${tagSlug.value}/tools?page=${page.value}`
    );
    if (response.data.data.length > 0) {
      tools.value.push(...response.data.data);
      page.value++;
    } else {
      // If no data is returned, we've hit the last page
      isLastPage.value = true;
    }
  } catch (error) {
    console.error("Error fetching tools:", error);
  } finally {
    isLoading.value = false;
  }
};

const onScroll = () => {
  const nearBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 500;
  if (nearBottom && !isLoading.value) {
    fetchTools();
  }
};

onMounted(() => {
  window.addEventListener("scroll", onScroll);
  fetchTools();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>