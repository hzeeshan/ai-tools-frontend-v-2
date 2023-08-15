<template>
  <v-container>
    <Head>
      <Title>Admin - Apps</Title>
    </Head>
    <section class="d-flex justify-space-between mx-16 my-9">
      <div>
        <h1>All Apps</h1>
      </div>
      <div>
        <v-btn color="primary" to="/admin/apps/create">Create New App</v-btn>
      </div>
    </section>
    <section id="apps">
      <DisplayApps
        @editButtonClicked="editButtonClicked"
        @deleteButtonClicked="showConfirmDialog"
        :apps="apps"
        v-if="apps.length > 0"
      />
      <v-pagination
        v-if="lastPage > 1"
        v-model="currentPage"
        :length="lastPage"
        @update:modelValue="changePage"
      />
      <ConfirmDialog
        v-model="showDialog"
        @confirm="handleConfirm"
        title="Confirm"
        message="Are you sure you want to delete app"
        yes="Yes"
        no="No"
        :options="{}"
      />
    </section>
    <section>
      <Snackbar v-model="showSnackbar" :text="snackbarText" />
    </section>
  </v-container>
</template>

<script setup>
const { $axios } = useNuxtApp();
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

let apps = ref([]);
let currentPage = ref(1);
let lastPage = ref(0);
let selectedAppId = ref(null);
const showSnackbar = ref(false);
const snackbarText = ref("");

const getApps = async (page) => {
  const { data } = await $axios.get(`/api/apps?page=${page}`);
  const { data: appData, current_page, last_page } = data;

  if (appData) {
    apps.value = appData;
    currentPage.value = current_page;
    lastPage.value = last_page;
  }
};
getApps();
const changePage = (page) => {
  getApps(page);
};

const editButtonClicked = (appId) => {
  navigateTo(`/admin/apps/${appId}`);
};

const showDialog = ref(false);
const showConfirmDialog = async (appId) => {
  selectedAppId.value = appId;
  showDialog.value = true;
};

const handleConfirm = async () => {
  const res = await $axios.delete(
    `/api/public/delete-app/${selectedAppId.value}`
  );

  if (res.data.success == true) {
    snackbarText.value = "App Deleted Successfully";
    showSnackbar.value = true;

    getApps();
  }
};
</script>

<style>
</style>
