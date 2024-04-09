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
          <v-combobox
            clearable
            chips
            multiple
            variant="outlined"
            label="Select Tags"
            v-model="formData.tags"
            :items="tags"
            item-title="name"
            item-value="id"
            :create-item="true"
            return-object
          ></v-combobox>
        </v-col>
        <v-col cols="12" sm="12">
          <v-text-field
            label="Website"
            required
            variant="outlined"
            v-model="formData.tool_link"
            :rules="rules.website"
            @input="resetServerError('website_link')"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12">
          <v-text-field
            label="Price"
            required
            variant="outlined"
            v-model="formData.price"
            placeholder="$10"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12">
          <v-text-field
            label="Plan Type"
            required
            variant="outlined"
            v-model="formData.planType"
            placeholder="Free | Free Trial | Paid"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12">
          <v-checkbox
            label="Is Verified"
            v-model="formData.is_verified"
          ></v-checkbox>
        </v-col>

        <v-col cols="12" sm="12">
          <v-file-input
            label="Image"
            variant="outlined"
            v-model="formData.mainImage"
            :error-messages="serverErrors.mainImage"
            @input="resetServerError('mainImage')"
            accept="image/png, image/jpeg, image/jpg"
          ></v-file-input>
        </v-col>
        <v-col cols="12" sm="12">
          <!-- Display the existing main image separately -->
          <nuxt-img
            v-if="formData.existingMainImage"
            :src="`${appBaseURL}/${formData.existingMainImage}`"
            width="150"
            height="84"
            sizes="xs:150px sm:300px md:450px lg:600px"
            fit="cover"
          ></nuxt-img>
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
const props = defineProps({
  isEditMode: {
    type: Boolean,
    required: false,
  },
});

let showSnackbar = ref(false);
let snackbarText = ref("");
let serverErrors = ref({});

const { tags, getRelatedCategories, getListOfTags } = useDataFetch();

let formData = reactive({
  name: "",
  slug: "",
  short_description: "",
  description: "",
  platform_id: "",
  category_id: "",
  tags: [],
  tool_link: "",
  planType: "",
  mainImage: null,
  price: "",
  is_verified: false,
  existingMainImage: null,
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
  //licenceType: [(v) => !!v || "Licence Type is required"],
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
  //planName: [(v) => !!v || "Plan Name is required"],
  /* planPrice: [
    (v) => !!v || "Plan Price is required",
    (v) => (v && v > 0) || "Plan Price must be greater than 0",
  ], */
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
  }

  const originalMainImageId = formData.existingMainImage
    ? formData.existingMainImage.id
    : null;
  const originalOtherImagesIds = formData.existingOtherImages
    ? formData.existingOtherImages.map((image) => image.id)
    : null;

  // Append non-file data to the form
  Object.keys(formData).forEach((key) => {
    if (key !== "mainImage" && key !== "otherImages" && key !== "tags") {
      form.append(key, formData[key]);
    }
  });

  const existingTagIds = [];
  const newTags = [];

  formData.tags.forEach((tag) => {
    if (typeof tag === "object") {
      existingTagIds.push(tag.id);
    } else {
      newTags.push(tag);
    }
  });

  form.append("existingTags", JSON.stringify(existingTagIds));
  form.append("newTags", JSON.stringify(newTags));
  //form.append("price_plans", JSON.stringify(filteredPlans));
  form.append("originalMainImage", originalMainImageId);
  //form.append("originalOtherImages", JSON.stringify(originalOtherImagesIds));

  try {
    // Make API request
    const res = await $axios.post(url, form);

    if (res.data.success === true) {
      showSnackbarMessage(
        props.isEditMode ? "Updated Successfully." : "Created Successfully."
      );
      navigateTo("/admin/apps");
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
    if (confirm("Are you sure ?")) {
      postData();
    }
  }
}

const showDialog = ref(false);
const currentImageId = ref(null);
const showConfirmDialog = (imageId) => {
  currentImageId.value = imageId;
  showDialog.value = true;
};

const handleConfirm = async (e) => {
  deleteImage(currentImageId.value);
};

const getSingleAppDetails = async () => {
  const toolId = route.params.id;
  const res = await $axios.get(`/api/tool/${toolId}`);

  if (res.data.tags.length > 0) {
    formData.tags = res.data.tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
    }));
  }

  formData.name = res.data.name;
  formData.slug = res.data.slug;
  formData.short_description = res.data.short_description;
  formData.description = res.data.long_description;
  formData.tool_link = res.data.tool_link;
  formData.price = res.data.price;
  formData.planType = res.data.pricing_plans;
  formData.is_verified = Boolean(res.data.is_verified);
  formData.existingMainImage = res.data.image_path;
};

/* this variable is for to prevent running getRelatedCategories function twice */
let isFirstLoad = ref(true);
watchEffect(async () => {
  if (props.isEditMode && formData.platform_id && isFirstLoad.value) {
    await getRelatedCategories(formData.platform_id);
    isFirstLoad.value = false;
  }
  if (props.isEditMode) {
    getSingleAppDetails();
  }
});

async function fetchData() {
  await getListOfTags();
}
fetchData();
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

