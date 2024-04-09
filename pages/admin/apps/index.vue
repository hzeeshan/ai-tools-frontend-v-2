<template>
  <v-container>
    <Head>
      <Title>Admin - Apps</Title>
    </Head>
    <section class="d-flex justify-space-between mx-16 my-9">
      <div>
        <h1>List of Tools</h1>
      </div>
      <div>
        <v-btn color="primary" to="/admin/apps/create">Create New App</v-btn>
      </div>
    </section>
    <section id="apps">
      <ListOfTools
        :tools="tools"
        v-if="tools.length > 0"
        @editButtonClicked="editButtonClicked"
        @deleteButtonClicked="showConfirmDialog"
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

let tools = ref([]);
let currentPage = ref(1);
let lastPage = ref(0);
let selectedAppId = ref(null);
const showSnackbar = ref(false);
const snackbarText = ref("");

const getTools = async (page = 1) => {
  try {
    const response = await $axios.get(`/api/tools?page=${page}`);
    const { data, current_page, last_page } = response.data;

    tools.value = data;
    currentPage.value = current_page;
    lastPage.value = last_page;
  } catch (error) {
    console.error(
      "Error fetching tools:",
      error.response?.data || error.message
    );
  }
};

getTools();
const changePage = (page) => {
  getTools(page);
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
    `/api/public/delete-tool/${selectedAppId.value}`
  );

  if (res.data.success == true) {
    snackbarText.value = "App Deleted Successfully";
    showSnackbar.value = true;

    getTools();
  }
};
</script>

<style>
</style>
