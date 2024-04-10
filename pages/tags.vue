<template>
  <main>
    <section id="categories" style="padding-top: 70px">
      <v-container>
        <v-card class="pa-9">
          <v-card-text>
            <h2 class="text-h5 mb-2 text-center">Select Tags</h2>
            <v-chip-group
              class="d-flex justify-center"
              v-model="selectedTags"
              column
              multiple
              @update:modelValue="handleSelectedTag"
            >
              <v-chip
                v-for="tag in tags"
                :key="tag.id"
                filter
                variant="outlined"
                :value="tag.id"
              >
                {{ tag.name }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>
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
  title: "AI Tool Tags - Explore AI Solutions by Specific Needs",
  description:
    "Navigate through diverse AI tool tags, from productivity to entertainment. Find the perfect AI solution tailored to your specific needs and interests.",
});
const { $axios } = useNuxtApp();
const config = useRuntimeConfig();
const baseUrl = config.public.apiBaseUrl;
const { tags, getListOfTags } = useDataFetch();

let selectedTags = ref([]);
let tools = ref([]);
let currentPage = ref(1);
const isLoading = ref(false);

const handleSelectedTag = (tagIds) => {
  filterAppsByTag(tagIds, currentPage.value);
};

async function filterAppsByTag(tagIds, page = 1) {
  if (!tagIds || tagIds.length === 0) {
    console.log("No tagIds provided, skipping fetch.");
    return;
  }

  isLoading.value = true;
  try {
    const response = await $axios.get(
      `/api/tools/by-tags?tagIds=${tagIds.join(",")}&page=${page}`
    );

    tools.value = response.data.data;
  } catch (e) {
    console.error("Error fetching tools:", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  try {
    await getListOfTags();
  } catch (e) {
    console.log(e);
  }
});
</script>