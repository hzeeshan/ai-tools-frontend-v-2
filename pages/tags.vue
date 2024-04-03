<template>
  <main>
    <section id="categories" style="padding-top: 70px">
      <v-container>
        <v-card class="pa-9">
          <v-card-text>
            <h2 class="text-h5 mb-2 text-center">Select Tags</h2>
            <v-chip-group
              class="d-flex justify-center"
              v-model="selectedCategories"
              column
              multiple
              @update:modelValue="handleSelectedCategory"
            >
              <v-chip
                v-for="category in listOfCategories"
                :key="category.id"
                filter
                variant="outlined"
                :value="category.id"
              >
                {{ category.name }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>
      </v-container>
    </section>
    <section class="py-9">
      <DisplayApps :apps="apps" v-if="apps.length > 0" />

      <v-pagination
        v-if="lastPage > 1"
        v-model="currentPage"
        :length="lastPage"
        @update:modelValue="changePage"
      />
    </section>
  </main>
</template>

<script setup>
useSeoMeta({
  title: "AI Tool Categories - Explore AI Solutions by Specific Needs",
  description:
    "Navigate through diverse AI tool categories, from productivity to entertainment. Find the perfect AI solution tailored to your specific needs and interests.",
});
const { $axios } = useNuxtApp();
const config = useRuntimeConfig();
const baseUrl = config.public.apiBaseUrl;
const { listOfCategories, getListOfCategories } = useDataFetch();

let selectedCategories = ref([]);
let apps = ref([]);
let currentPage = ref(1);
let lastPage = ref(0);

const handleSelectedCategory = (categoryIds) => {
  filterAppsByCategory(categoryIds, currentPage.value);
};

async function filterAppsByCategory(categoryIds, page = 1) {
  try {
    const { data } = await $axios.get(
      `${baseUrl}/apps/filter?category_ids=${categoryIds}&page=${page}`
    );

    const { data: items, current_page, last_page } = data;

    apps.value = items;
    currentPage.value = current_page;
    lastPage.value = last_page;
  } catch (e) {
    console.log(e.response.data);
  }
}

const changePage = (page) => {
  if (selectedCategories.value.length > 0) {
    filterAppsByCategory(selectedCategories.value, page);
  }
};

onMounted(async () => {
  try {
    await getListOfCategories();
  } catch (e) {
    console.log(e);
  }
});
</script>

<style>
</style>