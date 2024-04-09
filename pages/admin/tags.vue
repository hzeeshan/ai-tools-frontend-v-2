<template>
  <main>
    <Head>
      <Title>Admin - Dashboard - Tags</Title>
    </Head>
    <section>
      <v-container>
        <h2 class="py-3">Manage Tags</h2>
        <v-card class="text-center centered-item pa-5 w-75">
          <div class="d-flex justify-end mt-3 mb-5">
            <v-btn color="primary" @click="dialog = true">Create new Tag</v-btn>
          </div>
          <v-card-text>
            <v-list>
              <v-list-item v-for="tag in tags" :key="tag.id">
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <v-list-item-title> Tag: {{ tag.name }} </v-list-item-title>
                  </div>
                  <v-list-item-action>
                    <v-btn icon @click="editTag(tag)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      class="mx-3"
                      icon
                      color="red"
                      @click="deleteTag(tag)"
                    >
                      <v-icon>mdi-close-circle</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </div>

                <v-divider class="my-3"></v-divider>
              </v-list-item>
            </v-list>
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
                {{ isEditMode ? "Edit Tag" : "Create New Tag" }}
              </h2>
            </div>
            <v-form ref="tagForm" @submit.prevent="submit">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.tagName"
                    label="Name"
                    variant="outlined"
                    :rules="rules.required"
                  ></v-text-field>
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
  </main>
</template>
  
<script setup>
const { $axios } = useNuxtApp();
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const { tags, getListOfTags } = useDataFetch();

let dialog = ref(false);
let isEditMode = ref(false);
let showSnackbar = ref(false);
let snackbarText = ref("");

let formData = reactive({
  tagName: "",
  selectedTagId: "",
});

let rules = reactive({
  required: [(v) => !!v || "This field is required"],
});

const editTag = (tag) => {
  isEditMode.value = true;
  dialog.value = true;
  formData.tagName = tag.name;
  formData.selectedTagId = tag.id;
};
const deleteTag = async (tag) => {
  //console.log(tag.id);
  if (confirm("Are you sure ?")) {
    try {
      const res = await $axios.delete(`/api/tag/delete/${tag.id}`);
      //console.log(res.data.success);
      if (res.data.success == true) {
        showSnackbarMessage("Deleted Successfully");
        getListOfTags();
      }
    } catch (e) {
      console.log(e);
      showSnackbarMessage("There was some error. Please try again later");
    }
  }
};

const tagForm = ref(null);
const submit = async () => {
  let res;
  try {
    if (isEditMode.value) {
      res = await $axios.post(`/api/tag/update`, {
        tagName: formData.tagName,
        tagId: formData.selectedTagId,
      });
    } else {
      res = await $axios.post(`/api/tag/create`, {
        tagName: formData.tagName,
      });
    }
    if (res.data.success === true) {
      isEditMode.value
        ? showSnackbarMessage("Tag updated successfully")
        : showSnackbarMessage("Tag created successfully");

      closeDialog();
      getListOfTags();
    }
    if (res.data.success === false) {
      showSnackbarMessage("Error: " + res.data.message);
    }
  } catch (e) {
    console.log(e);
    showSnackbarMessage("There was some error. Please try again later");
  }
};

const closeDialog = () => {
  dialog.value = false;
  isEditMode.value = false;
  resetFormData();
};

const resetFormData = () => {
  formData.tagName = "";
  formData.selectedTagId = "";
};

const showSnackbarMessage = (message) => {
  snackbarText.value = message;
  showSnackbar.value = true;
};

getListOfTags();
//console.log(tags.value);
</script>
  
  <style>
</style>