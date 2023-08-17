<template>
  <main>
    <Head>
      <Title>AI Apps Platforms - Ai Apps Universe</Title>
    </Head>
    <section id="platforms" style="padding-top: 70px">
      <v-container>
        <v-card>
          <v-card-text>
            <h2 class="text-h5 mb-2 text-center">Select Platform</h2>

            <v-chip-group
              class="d-flex justify-center"
              v-model="selectedPlatforms"
              column
              multiple
              @update:modelValue="handleSelectedPlatform"
            >
              <v-chip
                v-for="platform in platforms"
                :key="platform.id"
                filter
                variant="outlined"
                :value="platform.id"
              >
                {{ platform.name }}
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
const { $axios } = useNuxtApp();
const config = useRuntimeConfig();
const baseUrl = config.public.apiBaseUrl;

let selectedPlatforms = ref([]);
let platforms = ref([]);
let apps = ref([]);
let currentPage = ref(1);
let lastPage = ref(0);

/* methods */
const getPlatforms = async () => {
  const { data } = await $axios.get(`${baseUrl}platforms`);
  platforms.value = data;
};

await getPlatforms();

async function filterAppsByPlatform(id, page = 1) {
  const { data } = await $axios.post(
    `${baseUrl}public/filter-apps/platform?page=${page}`,
    { id }
  );

  const { data: items, current_page, last_page } = data;

  apps.value = items;
  currentPage.value = current_page;
  lastPage.value = last_page;
}

const handleSelectedPlatform = (id) => {
  filterAppsByPlatform(id, currentPage.value);
};

const changePage = (page) => {
  if (selectedPlatforms.value.length > 0) {
    filterAppsByPlatform(selectedPlatforms.value, page);
  }
};
</script>