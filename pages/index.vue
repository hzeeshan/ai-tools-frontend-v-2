<template>
  <main>
    <Head>
      <Title>AI Apps Universe - Home</Title>
    </Head>

    <HomeBanner />

    <section id="planes">
      <v-container>
        <v-row>
          <v-col cols="12" sm="3" md="3">
            <v-checkbox
              label="Free"
              color="primary"
              hide-details
              value="Free"
              v-model="selectedCheckboxes"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-checkbox
              label="Freemium"
              hide-details
              color="primary"
              value="Freemium"
              v-model="selectedCheckboxes"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-checkbox
              label="Paid"
              hide-details
              color="primary"
              value="Paid"
              v-model="selectedCheckboxes"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-checkbox
              label="All"
              hide-details
              color="primary"
              value="All"
              v-model="selectedCheckboxes"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <br />

    <DisplayApps :apps="apps" v-if="apps.length > 0" />

    <section class="pb-9">
      <v-pagination
        v-model="currentPage"
        :length="lastPage"
        @update:modelValue="changePage"
      />
    </section>
  </main>
</template>

<script setup>
let apps = ref([]);
let currentPage = ref(1);
let lastPage = ref(0);
const config = useRuntimeConfig();
const baseUrl = config.public.apiBaseUrl;
let selectedCheckboxes = ref([]);

const getApps = async (page, licenseTypes = []) => {
  try {
    const licenseTypeQueryString = licenseTypes
      .map(encodeURIComponent)
      .join(",");

    const { data } = await useFetch(
      `${baseUrl}apps?page=${page}&license_type=${licenseTypeQueryString}`
    );

    const { data: appData, current_page, last_page } = data.value;

    if (appData) {
      apps.value = appData;
      currentPage.value = current_page;
      lastPage.value = last_page;
    }
  } catch (e) {
    console.log(e + " error");
  }
};

const changePage = (page) => {
  getApps(page);
};

await getApps(currentPage.value);

watch(selectedCheckboxes, (newValue) => {
  console.log("Checkboxes changed:", newValue);
  getApps(currentPage.value, newValue);
});
</script>

<style scoped>
.section-padding {
  padding-top: 50px;
}
</style>
