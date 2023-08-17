<template>
  <main>
    <Head>
      <Title>AI Apps Categories - Ai Apps Universe</Title>
    </Head>
    <section id="categories" style="padding-top: 70px">
      <v-container>
        <v-card class="pa-9">
          <v-card-text>
            <h2 class="text-h5 mb-2 text-center">Select Categories</h2>
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
const { $axios } = useNuxtApp();
const config = useRuntimeConfig();
const baseUrl = config.public.apiBaseUrl;
const { listOfCategories, getListOfCategories } = useDataFetch();

let selectedCategories = ref([]);
let apps = ref([]);
let currentPage = ref(1);
let lastPage = ref(0);

await getListOfCategories();

const handleSelectedCategory = (categoryIds) => {
  filterAppsByCategory(categoryIds, currentPage.value);
};

async function filterAppsByCategory(categoryIds, page = 1) {
  try {
    const { data } = await $axios.get(
      `${baseUrl}apps/filter?category_ids=${categoryIds}&page=${page}`
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
</script>

<style>
</style>