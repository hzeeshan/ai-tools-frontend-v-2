<template>
  <main>
    <Head>
      <Title>AI Apps Categories - Ai Apps Universe</Title>
    </Head>
    <section id="categories" style="padding-top: 70px">
      <v-container>
        <v-card>
          <v-card-text>
            <h2 class="text-h5 mb-2 text-center">Select Category</h2>

            <v-chip-group
              class="d-flex justify-center"
              v-model="selectedCategories"
              column
              multiple
              @update:modelValue="handleSelectedCategory"
            >
              <v-chip
                v-for="category in categories"
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
    <section class="pt-9">
      <DisplayApps :apps="apps" v-if="apps.length > 0" />
    </section>
    <v-pagination
      v-if="lastPage > 1"
      v-model="currentPage"
      :length="lastPage"
      @update:modelValue="changePage"
    />
  </main>
</template>

<script setup>
const config = useRuntimeConfig();
const baseUrl = config.public.apiBaseUrl;
const { $axios } = useNuxtApp();

let selectedCategories = ref([]);
let categories = ref([]);
let apps = ref([]);
let currentPage = ref(1);
let lastPage = ref(0);

/* methods */
const getCategories = async () => {
  const { data } = await $axios.get(`${baseUrl}categories`);
  categories.value = data;
};

await getCategories();

async function filterAppsByCategory(id, page = 1) {
  const { data } = await $axios.post(
    `${baseUrl}public/filter-apps/category?page=${page}`,
    { id }
  );

  const { data: items, current_page, last_page } = data;

  apps.value = items;
  currentPage.value = current_page;
  lastPage.value = last_page;
}

const handleSelectedCategory = (id) => {
  filterAppsByCategory(id, currentPage.value);
};

const changePage = (page) => {
  if (selectedCategories.value.length > 0) {
    filterAppsByCategory(selectedCategories.value, page);
  }
};
</script>