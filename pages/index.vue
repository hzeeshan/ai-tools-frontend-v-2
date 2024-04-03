<template>
  <main>
    <HomeBanner @search="handleSearch" />
    <br />
    <section>
      <v-container>
        <v-row class="mx-auto">
          <v-col cols="2" class="align-self-center">
            <Filter />
          </v-col>
          <v-col cols="8" class="align-self-center">
            <TagsSlides />
          </v-col>
          <v-col cols="2" class="align-self-center">
            <SortBy />
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

const getTools = async () => {
  isLoading.value = true;
  try {
    const response = await $axios.get(`/api/tools?page=${page.value}`);
    tools.value.push(...response.data);
    page.value++;
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = (result) => {
  //console.log(result.data);
  tools.value = result.data;
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

<style scoped>
</style>
