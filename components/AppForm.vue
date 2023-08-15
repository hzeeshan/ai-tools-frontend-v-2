<template>
  <section>
    <v-form @submit.prevent="onSubmit" ref="appForm">
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            label="Name*"
            required
            variant="outlined"
            v-model="formData.name"
            :rules="rules.name"
            :error-messages="serverErrors.name"
            @input="resetServerError('name')"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            label="Slug"
            variant="outlined"
            v-model="formData.slug"
            :rules="rules.slug"
            :error-messages="serverErrors.slug"
            @input="resetServerError('slug')"
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-textarea
            label="Short Description"
            variant="outlined"
            v-model="formData.short_description"
            :rules="rules.short_description"
            :error-messages="serverErrors.short_description"
            @input="resetServerError('short_description')"
          ></v-textarea>
        </v-col>
        <v-col cols="12">
          <Editor v-model="formData.description" :max-limit="1000" />
        </v-col>

        <v-col cols="12" sm="12">
          <v-select
            :items="platforms"
            label="Select Platforms*"
            required
            variant="outlined"
            v-model="formData.platform_id"
            :rules="rules.platform"
            item-title="name"
            item-value="id"
            :error-messages="serverErrors.platform_id"
            @input="resetServerError('platform_id')"
            @update:modelValue="getRelatedCategories"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="12">
          <v-select
            :items="categories"
            label="Select Categories*"
            required
            variant="outlined"
            v-model="formData.category_id"
            :rules="rules.category"
            item-title="name"
            item-value="id"
            :error-messages="serverErrors.category_id"
            @input="resetServerError('category_id')"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="12">
          <v-text-field
            label="Website"
            required
            variant="outlined"
            v-model="formData.website_link"
            :rules="rules.website"
            :error-messages="serverErrors.website_link"
            @input="resetServerError('website_link')"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12">
          <v-select
            :items="licenceTypes"
            label="Select Licence Type*"
            required
            variant="outlined"
            v-model="formData.license_type_id"
            :rules="rules.licenceType"
            item-title="name"
            item-value="id"
            :error-messages="serverErrors.license_type_id"
            @input="resetServerError('license_type_id')"
          ></v-select>
        </v-col>

        <v-col cols="12" sm="12">
          <v-file-input
            label="Main Image"
            variant="outlined"
            v-model="formData.mainImage"
            :error-messages="serverErrors.mainImage"
            @input="resetServerError('mainImage')"
            accept="image/png, image/jpeg, image/jpg"
          ></v-file-input>
        </v-col>
        <v-col cols="12" sm="12">
          <!-- Display the existing main image separately -->
          <v-img
            :width="150"
            aspect-ratio="16/9"
            cover
            v-if="formData.existingMainImage"
            :src="`${appBaseURL}/${formData.existingMainImage.path}`"
          ></v-img>
        </v-col>
        <v-col cols="12" sm="12">
          <v-file-input
            label="Other Images"
            variant="outlined"
            v-model="formData.otherImages"
            chips
            multiple
            :error-messages="serverErrors.otherImages"
            @input="resetServerError('otherImages')"
            accept="image/png, image/jpeg, image/jpg"
          ></v-file-input>
        </v-col>
        <v-col
          v-for="image in formData.existingOtherImages"
          :key="image.id"
          class="d-flex child-flex"
          cols="4"
        >
          <v-img :src="`${appBaseURL}/${image.path}`" aspect-ratio="1" cover>
            <v-icon class="delete-icon" @click="showConfirmDialog(image.id)">
              mdi-close-circle
            </v-icon>
          </v-img>
        </v-col>
      </v-row>
      <v-row v-for="(plan, index) in formData.plans" :key="index">
        <v-col cols="12" sm="5">
          <v-text-field
            v-model="plan.name"
            label="Plan Name"
            required
            variant="outlined"
            :rules="rules.planName"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="5">
          <v-text-field
            v-model="plan.price"
            label="Plan Price"
            type="number"
            required
            variant="outlined"
            :rules="rules.planPrice"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="2" class="d-flex align-center justify-center">
          <v-icon
            class="cursor-pointer"
            size="large"
            color="red"
            icon="mdi-delete"
            @click="deletePlanRow(index)"
          ></v-icon>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-end">
            <v-btn
              @click="addNewPlanRow"
              size="small"
              color="indigo"
              icon="mdi-plus"
              elevation="10"
            ></v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-btn color="secondary" class="ml-3" type="submit"> Submit </v-btn>
      </v-row>
    </v-form>
    <Snackbar v-model="showSnackbar" :text="snackbarText" />
    <ConfirmDialog
      v-model="showDialog"
      @confirm="handleConfirm"
      title="Confirm"
      message="Are you sure you want to delete this Image?"
      yes="Yes"
      no="No"
      :options="{}"
    />
  </section>
</template>

<script setup>
const { $axios } = useNuxtApp();
const config = useRuntimeConfig();
const appBaseURL = config.public.appBaseUrl;

const route = useRoute();
//const emit = defineEmits(["formSubmitted", "clearServerError"]);
const props = defineProps({
  isEditMode: {
    type: Boolean,
    required: false,
  },
});

let showSnackbar = ref(false);
let snackbarText = ref("");
let serverErrors = ref({});

const {
  platforms,
  categories,
  licenceTypes,
  getPlatforms,
  getLicenceTypes,
  getRelatedCategories,
} = useDataFetch();

let formData = reactive({
  name: "",
  slug: "",
  short_description: "",
  description: "",
  platform_id: "",
  category_id: "",
  website_link: "",
  license_type_id: "",
  mainImage: null,
  otherImages: [],
  existingMainImage: null,
  existingOtherImages: [],
  plans: [{ name: "", price: "" }],
});

let rules = reactive({
  name: [
    (v) => !!v || "Name is required",
    (v) => (v && v.length <= 50) || "Name must be less than 50 characters",
  ],
  slug: [
    (v) => !!v || "Slug is required",
    (v) => (v && v.length <= 50) || "Slug must be less than 50 characters",
  ],
  short_description: [(v) => !!v || "Short Description is required"],
  platform: [(v) => !!v || "Platform is required"],
  category: [(v) => !!v || "Category is required"],
  website: [(v) => !!v || "Website is required"],
  licenceType: [(v) => !!v || "Licence Type is required"],
  mainImage: [
    (v) => !!v || "File input is required",
    (v) => {
      if (!v) return true; // if no file, validation passes
      let validFileTypes = ["image/jpeg", "image/png"];
      let isFileTypeValid = v.some((file) =>
        validFileTypes.includes(file.type)
      );
      return isFileTypeValid || "Only jpeg or png files are allowed";
    },
  ],
  planName: [(v) => !!v || "Plan Name is required"],
  planPrice: [
    (v) => !!v || "Plan Price is required",
    (v) => (v && v > 0) || "Plan Price must be greater than 0",
  ],
});

function resetServerError(fieldName) {}

const addNewPlanRow = () => {
  formData.plans.push({ name: "", price: "" });
};

const deletePlanRow = (index) => {
  formData.plans.splice(index, 1);
};

const showSnackbarMessage = (message) => {
  snackbarText.value = message;
  showSnackbar.value = true;
};

const postData = async () => {
  // Filter plans
  const filteredPlans = formData.plans.filter(
    (plan) => plan.name && plan.price
  );

  // Initialize form
  const form = new FormData();

  // Decide on URL and method based on whether form is in edit mode
  const url = props.isEditMode
    ? `/api/public/app/${route.params.id}`
    : "/api/public/store-app";

  // Handle main and other images and store original images separately when the form is in edit mode
  if (
    Array.isArray(formData.mainImage) &&
    formData.mainImage[0] instanceof File
  ) {
    form.append("mainImage", formData.mainImage[0]);
    //console.log(formData.mainImage[0]);
  }

  if (formData.otherImages && formData.otherImages.length > 0) {
    formData.otherImages.forEach((file, index) => {
      if (file instanceof File) {
        form.append(`otherImages[]`, file);
      }
    });
  }

  const originalMainImageId = formData.existingMainImage
    ? formData.existingMainImage.id
    : null;
  const originalOtherImagesIds = formData.existingOtherImages
    ? formData.existingOtherImages.map((image) => image.id)
    : null;

  // Append non-file data to the form
  Object.keys(formData).forEach((key) => {
    if (key !== "mainImage" && key !== "otherImages") {
      form.append(key, formData[key]);
    }
  });

  form.append("price_plans", JSON.stringify(filteredPlans));
  form.append("originalMainImage", originalMainImageId);
  form.append("originalOtherImages", JSON.stringify(originalOtherImagesIds));

  try {
    // Make API request
    const res = await $axios.post(url, form);

    if (res.data.success === true) {
      showSnackbarMessage(
        props.isEditMode ? "Updated Successfully." : "Created Successfully."
      );
    }
  } catch (e) {
    console.log(e);
    showSnackbarMessage("There was some error. Please try again later");

    if (e && e.res.data) {
      const { errors } = e.res.data;
      serverErrors.value = errors;
    }
  }
};

const appForm = ref(null);
async function onSubmit() {
  const { valid } = await appForm.value.validate();
  if (valid) {
    postData();
  }
}

const showDialog = ref(false);
const currentImageId = ref(null);
const showConfirmDialog = (imageId) => {
  console.log(1234567890);
  console.log(imageId);
  currentImageId.value = imageId;
  showDialog.value = true;
};

const handleConfirm = async (e) => {
  deleteImage(currentImageId.value);
};

const deleteImage = async (imageId) => {
  const url = `/api/public/image/${imageId}`;

  try {
    const res = await $axios.delete(url);
    if (res.status === 200) {
      // Remove the image from the formData.existingOtherImages array
      formData.existingOtherImages = formData.existingOtherImages.filter(
        (image) => image.id !== imageId
      );

      showSnackbarMessage("Image Deleted Successfully");
    }
  } catch (error) {
    console.error(error);
    if (error && error.response.status === 400) {
      // console.log(error.response.data.message);
      showSnackbarMessage(error.response.data.message);
      return;
    }
    if (error) {
      showSnackbarMessage("There was some error. Please try again later");
    }
  }
};

const getSingleAppDetails = async () => {
  const appId = route.params.id;
  const res = await $axios.get(`/api/apps/${appId}`);
  //console.log(res.data);
  formData.name = res.data.name;
  formData.slug = res.data.slug;
  formData.short_description = res.data.short_description;
  formData.description = res.data.description;
  formData.platform_id = res.data.platform_id;
  formData.category_id = res.data.category_id;
  formData.website_link = res.data.website_link;
  formData.license_type_id = res.data.license_type.id;
  formData.plans = res.data.price_plans;
  // store existing images separately
  formData.existingMainImage = res.data.main_image;
  formData.existingOtherImages = res.data.images;
};

/* this variable is for to prevent running getRelatedCategories function twice */
let isFirstLoad = ref(true);
watchEffect(async () => {
  if (props.isEditMode && formData.platform_id && isFirstLoad.value) {
    await getRelatedCategories(formData.platform_id);
    isFirstLoad.value = false;
  }
  if (props.isEditMode && !formData.platform_id) {
    getSingleAppDetails();
  }
});

getPlatforms();
getLicenceTypes();
</script>

<style scoped>
.delete-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
  color: red;
  transition: transform 0.3s ease-in-out;
}
.delete-icon:hover {
  transform: scale(1.5);
}
</style>

