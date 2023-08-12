<template>
  <v-main>
    <section>
      <v-container>
        <h2 class="py-3">Manage Platforms and Categories</h2>
        <v-card class="my-9">
          <v-tabs v-model="tab" bg-color="primary">
            <v-tab value="one"> Platforms</v-tab>
            <v-tab value="two">Catagerios</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="one">
                <div>
                  <v-list>
                    <v-list-item
                      v-for="platform in platforms"
                      :key="platform.id"
                      :title="platform.name"
                    >
                      <v-divider class="my-3"></v-divider>
                    </v-list-item>
                  </v-list>
                </div>
              </v-window-item>

              <v-window-item value="two">
                <div class="d-flex justify-end mt-3 mb-5">
                  <v-btn color="primary" @click="dialog = true"
                    >Create new Catagerios</v-btn
                  >
                </div>
                <v-list>
                  <v-list-item
                    v-for="category in categories"
                    :key="category.id"
                  >
                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <v-list-item-title>
                          Category: {{ category.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          Platform: {{ category.platform.name }}
                        </v-list-item-subtitle>
                      </div>

                      <v-list-item-action>
                        <v-btn icon @click="editCategory(category)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          class="mx-3"
                          icon
                          color="red"
                          @click="deleteCategory(category)"
                        >
                          <v-icon>mdi-close-circle</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </div>

                    <v-divider class="my-3"></v-divider>
                  </v-list-item>
                </v-list>
                <v-pagination
                  v-model="currentPage"
                  :length="lastPage"
                  :total-visible="4"
                  @update:modelValue="changePage"
                ></v-pagination>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-container>
    </section>
    <section>
      <v-dialog v-model="dialog" width="500" persistent>
        <v-card>
          <v-card-text>
            <div>
              <h2 class="py-5">
                {{ isEditMode ? "Edit Category" : "Create New Category" }}
              </h2>
            </div>
            <v-form ref="categoryForm" @submit.prevent="submit">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.categoryName"
                    label="Name"
                    required
                    variant="outlined"
                    :rules="rules.required"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-select
                    :items="platforms"
                    label="Select Platform*"
                    required
                    variant="outlined"
                    v-model="formData.selectedPlatformId"
                    item-title="name"
                    item-value="id"
                    :rules="rules.required"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row class="d-flex justify-start my-3">
                <v-btn color="secondary" @click="closeDialog">Close</v-btn>
                <v-btn color="success" @click="submit" class="ml-3 mb-3">
                  Submit
                </v-btn>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </section>
    <section>
      <Snackbar v-model="showSnackbar" :text="snackbarText" />
    </section>
  </v-main>
</template>

<script setup>
const { $axios } = useNuxtApp();
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

let showSnackbar = ref(false);
let snackbarText = ref("");
let currentPage = ref(1);
let lastPage = ref(0);

let formData = reactive({
  categoryName: "",
  selectedPlatformId: "",
});

let rules = reactive({
  required: [(v) => !!v || "This field is required"],
});

const tab = ref(null);
let dialog = ref(false);
let isEditMode = ref(false);
let selectedCategoryId = ref(null);

const platforms = ref([
  { id: 1, name: "Web Apps" },
  { id: 2, name: "Chrome Extensions" },
  { id: 3, name: "Mobile Apps" },
]);

const categories = ref([]);
const getCategories = async (page) => {
  const { data } = await $axios.get(`/api/categories?page=${page}`);
  const { data: catData, current_page, last_page } = data;

  currentPage.value = current_page;
  lastPage.value = last_page;
  categories.value = catData;
};

const categoryForm = ref(null);

const submit = async () => {
  const { valid } = await categoryForm.value.validate();

  if (valid) {
    try {
      let res;

      if (isEditMode.value) {
        let updatedFormData = {
          ...formData,
          selectedCategoryId: selectedCategoryId.value,
        };
        res = await $axios.post("/api/public/category/update", updatedFormData);
      } else {
        res = await $axios.post("/api/public/category", formData);
      }

      if (res.data.success === true) {
        showSnackbarMessage(
          isEditMode.value ? "Updated Successfully." : "Created Successfully."
        );
      }
      closeDialog();
      getCategories();
    } catch (e) {
      console.log(e.response);

      if (e.response && !e.response.data.success) {
        showSnackbarMessage("There was some error. Please try again later");
        closeDialog();
      }
    }
  }
};

const editCategory = async (category) => {
  console.log(category.id);
  isEditMode.value = true;
  dialog.value = true;
  formData.categoryName = category.name;
  formData.selectedCategoryId = category.id;
  selectedCategoryId.value = category.id;
};

const deleteCategory = async (category) => {
  if (confirm("Are you sure ?")) {
    try {
      const res = await $axios.delete(`/api/public/category/${category.id}`);
      //console.log(res.data.success);
      if (res.data.success == true) {
        showSnackbarMessage("Deleted Successfully");
        getCategories();
      }
    } catch (e) {
      console.log(e);
      showSnackbarMessage("There was some error. Please try again later");
    }
  }
};

const showSnackbarMessage = (message) => {
  snackbarText.value = message;
  showSnackbar.value = true;
};

const resetFormData = () => {
  formData.categoryName = "";
  formData.selectedCategoryId = "";
  selectedCategoryId.value = null;
};

const closeDialog = () => {
  dialog.value = false;
  isEditMode.value = false;
  resetFormData();
};
const changePage = (page) => {
  getCategories(page);
};

getCategories();
</script>

<style>
</style>