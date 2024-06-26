<template>
  <main>
    <HomeBanner @search="handleSearch" />
    <br />
    <section>
      <v-container fluid class="px-0">
        <v-row class="mx-auto" no-gutters>
          <v-col cols="12" sm="2" md="2" class="align-self-center pb-3">
            <Filter
              @filter="handleFilterResults"
              @clearFilters="getInitialData"
            />
          </v-col>
          <v-col cols="12" sm="8" md="8" class="align-self-center py-3">
            <TagsSlides />
          </v-col>
          <v-col cols="12" sm="2" md="2" class="align-self-center">
            <SortBy @sortBy="handleSortByResults" />
          </v-col>
        </v-row>
      </v-container>
    </section>
    <section id="list-of-tools">
      <v-container>
        <ListOfTools :tools="tools" v-if="tools.length > 0" />

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
  </main>
</template>

<script setup>
useSeoMeta({
  title: "AI Tools Universe - Discover the Best AI Apps, Extensions & More",
  description:
    "Dive into the universe of AI tools! Browse our curated collection of innovative AI web apps, mobile applications, and extensions. Begin your exploration today!",
});

const { $axios } = useNuxtApp();
let tools = ref([]);
const config = useRuntimeConfig();
const baseUrl = config.public.apiBaseUrl;
const page = ref(1);
const isLoading = ref(false);
const isLastPage = ref(false);

const getTools = async () => {
  if (isLoading.value || isLastPage.value) return;

  isLoading.value = true;
  try {
    const response = await $axios.get(`/api/tools?page=${page.value}`);
    const { data, current_page, last_page } = response.data;
    if (data.length > 0) {
      tools.value.push(...data);
      page.value = current_page + 1; // Prepare for the next page
      isLastPage.value = current_page === last_page;
    } else {
      isLastPage.value = true;
    }
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = (result) => {
  console.log(result);
  tools.value = result.data;
};

const handleFilterResults = (result) => {
  tools.value = result;
};

const handleSortByResults = (result) => {
  tools.value = result;
};

const getInitialData = async () => {
  tools.value = [];
  page.value = 1;
  await getTools();
};

const onScroll = () => {
  const nearBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 500;
  if (nearBottom && !isLoading.value) {
    getTools();
  }
};

onMounted(() => {
  window.addEventListener("scroll", onScroll);
  getTools();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

