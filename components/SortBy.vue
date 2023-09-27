<template>
  <div>
    <v-container>
      <v-select
        label="Sort By"
        :items="sortOptions"
        item-title="text"
        item-value="text"
        v-model="selectedSortOption"
        variant="outlined"
      ></v-select>
    </v-container>
  </div>
</template>

<script setup>
const { $axios } = useNuxtApp();
const router = useRouter();

const selectedSortOption = ref("Verified");

const sortOptions = ["Verified", "New", "Popular"];

// Watcher for selectedSortOption
watch(selectedSortOption, async (newVal) => {
  if (newVal) {
    // Convert the selected option to lowercase to be used in query params
    const sortParam = newVal.toLowerCase();

    // Update the URL without reloading the page
    router.push({
      path: router.currentRoute.value.path,
      query: { ...router.currentRoute.value.query, sortBy: sortParam },
    });

    // Fetch and handle sorted data
    const queryString = `sortBy=${sortParam}`;
    await fetchSortedData(queryString);
  }
});

// Function to fetch sorted data
const fetchSortedData = async (queryString) => {
  const response = await $axios.get(`/api/tools/search?${queryString}`);
  console.log(response); // Handle the response, update your state, etc.
};
</script>