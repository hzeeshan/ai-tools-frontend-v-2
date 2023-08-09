<template>
  <v-main>
    <section>
      <v-container>
        <h2 class="py-3">Manage Categories and subcategories</h2>
        <v-card class="my-9">
          <v-tabs v-model="tab" bg-color="primary">
            <v-tab value="one"> Categories</v-tab>
            <v-tab value="two">Subcatagerios</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="one">
                <div>
                  <v-list>
                    <v-list-item
                      v-for="category in categories"
                      :key="category.id"
                      :title="category.name"
                    >
                      <v-divider class="my-3"></v-divider>
                    </v-list-item>
                  </v-list>
                </div>
              </v-window-item>

              <v-window-item value="two">
                <div class="d-flex justify-end mt-3 mb-5">
                  <v-btn color="primary" @click="dialog = true"
                    >Create new Subcatagerios</v-btn
                  >
                </div>
                <v-list>
                  <v-list-item
                    v-for="subcategory in subcategories"
                    :key="subcategory.id"
                  >
                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <v-list-item-title>
                          Subcategory: {{ subcategory.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          Category: {{ subcategory.category.name }}
                        </v-list-item-subtitle>
                      </div>

                      <v-list-item-action>
                        <v-btn icon @click="editSubCategory(subcategory)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          class="mx-3"
                          icon
                          color="red"
                          @click="deleteSubCategory(subcategory)"
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
                {{ isEditMode ? "Edit Subcategory" : "Create New Subcategory" }}
              </h2>
            </div>
            <v-form ref="subcategoryForm" @submit.prevent="submit">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.subcategoryName"
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
                    :items="categories"
                    label="Select Category*"
                    required
                    variant="outlined"
                    v-model="formData.selectedCategoryId"
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
  subcategoryName: "",
  selectedCategoryId: "",
});

let rules = reactive({
  required: [(v) => !!v || "This field is required"],
});

const tab = ref(null);
let dialog = ref(false);
let isEditMode = ref(false);
let selectedSubcategoryId = ref(null);

const categories = ref([
  { id: 1, name: "Web Apps" },
  { id: 2, name: "Chrome Extensions" },
  { id: 3, name: "Mobile Apps" },
]);

const subcategories = ref([]);
const getSubCategories = async (page) => {
  const { data } = await $axios.get(`/api/subcategories?page=${page}`);
  //console.log(data);
  const { data: subcatData, current_page, last_page } = data;

  currentPage.value = current_page;
  lastPage.value = last_page;
  subcategories.value = subcatData;
};

const subcategoryForm = ref(null);

const submit = async () => {
  const { valid } = await subcategoryForm.value.validate();

  if (valid) {
    try {
      let res;

      if (isEditMode.value) {
        let updatedFormData = {
          ...formData,
          selectedSubcategoryId: selectedSubcategoryId.value,
        };
        res = await $axios.post(
          "/api/public/subcategory/update",
          updatedFormData
        );
      } else {
        res = await $axios.post("/api/public/subcategory", formData);
      }

      if (res.data.success === true) {
        showSnackbarMessage(
          isEditMode.value ? "Updated Successfully." : "Created Successfully."
        );
      }
      closeDialog();
      getSubCategories();
    } catch (e) {
      console.log(e.response);

      if (e.response && !e.response.data.success) {
        showSnackbarMessage("There was some error. Please try again later");
        closeDialog();
      }
    }
  }
};

const editSubCategory = async (subcategory) => {
  isEditMode.value = true;
  dialog.value = true;
  formData.subcategoryName = subcategory.name;
  formData.selectedCategoryId = subcategory.category.id;
  selectedSubcategoryId.value = subcategory.id;
};

const deleteSubCategory = async (subcategory) => {
  //console.log(subcategory.id);
  if (confirm("Are you sure ?")) {
    try {
      const res = await $axios.delete(
        `/api/public/subcategory/${subcategory.id}`
      );
      //console.log(res.data.success);
      if (res.data.success == true) {
        showSnackbarMessage("Deleted Successfully");
        getSubCategories();
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
  formData.subcategoryName = "";
  formData.selectedCategoryId = "";
  selectedSubcategoryId.value = null;
};

const closeDialog = () => {
  dialog.value = false;
  isEditMode.value = false;
  resetFormData();
};
const changePage = (page) => {
  getSubCategories(page);
};

getSubCategories();
</script>

<style>
</style>