<template>
  <main>
    <HomeBanner />

    <section id="planes">
      <v-container>
        <v-row>
          <v-col cols="4" md="3" lg="3">
            <div class="checkbox-wrapper">
              <v-checkbox
                label="Free"
                color="primary"
                hide-details
                value="Free"
                v-model="selectedCheckboxes"
              ></v-checkbox>
            </div>
          </v-col>
          <v-col cols="4" md="3" lg="3">
            <div class="checkbox-wrapper">
              <v-checkbox
                label="Freemium"
                hide-details
                color="primary"
                value="Freemium"
                v-model="selectedCheckboxes"
              ></v-checkbox>
            </div>
          </v-col>
          <v-col cols="4" md="3" lg="3">
            <div class="checkbox-wrapper">
              <v-checkbox
                label="Paid"
                hide-details
                color="primary"
                value="Paid"
                v-model="selectedCheckboxes"
              ></v-checkbox>
            </div>
          </v-col>
          <v-col cols="4" md="3" lg="3">
            <div class="checkbox-wrapper">
              <v-checkbox
                label="All"
                hide-details
                color="primary"
                value="All"
                v-model="selectedCheckboxes"
              ></v-checkbox>
            </div>
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
useSeoMeta({
  title: "AI Tools Universe - Discover the Best AI Apps, Extensions & More",
  description:
    "Dive into the universe of AI tools! Browse our curated collection of innovative AI web apps, mobile applications, and extensions. Begin your exploration today!",
});

const { $axios } = useNuxtApp();
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

    const { data } = await $axios.get(
      `${baseUrl}apps?page=${page}&license_type=${licenseTypeQueryString}`
    );

    const { data: appData, current_page, last_page } = data;

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

watch(selectedCheckboxes, (newValue) => {
  console.log("Checkboxes changed:", newValue);
  getApps(currentPage.value, newValue);
});

onMounted(async () => {
  try {
    await getApps(currentPage.value);
  } catch (e) {
    console.log(e);
  }
});
</script>

<style scoped>
.section-padding {
  padding-top: 50px;
}
.checkbox-wrapper {
  text-align: center;
  width: 100%;
}

.checkbox-wrapper .v-checkbox {
  display: inline-block;
}
</style>
