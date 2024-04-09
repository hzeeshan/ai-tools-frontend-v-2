<template>
  <div>
    <v-card elevated>
      <v-container>
        <div>
          <h3 class="font-weight-bold">Leave a review for the community</h3>
          <v-form v-if="showForm" ref="formRef">
            <v-row>
              <v-col>
                <div>
                  <v-input :value="form.rating">
                    <v-rating v-model="form.rating" color="#fcb900" clearable />
                  </v-input>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  label="Write your comments*"
                  variant="outlined"
                  v-model="form.review"
                  :rules="[rules.required]"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-btn color="primary" @click="submitForm"> submit </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </div>
      </v-container>
    </v-card>

    <section>
      <Snackbar v-model="snackbar" :text="snackbarText" />
    </section>

    <section class="bg-gray px-3">
      <v-container> </v-container>
    </section>
  </div>
</template>

<script setup>
const { $userStore } = useNuxtApp();
const { $axios } = useNuxtApp();
const props = defineProps(["appId"]);
const form = reactive({
  rating: null,
  review: "",
});

const rules = {
  ratingValidation: (value) => !!value || "Rating is required",
  required: (value) => !!value || "This field is Required",
  email: (value) => {
    const pattern = /.+@.+\..+/;
    return pattern.test(value) || "Invalid e-mail.";
  },
};

const formRef = ref(null);
const config = useRuntimeConfig();
const baseUrl = config.public.apiBaseUrl;
const serverErrors = ref({});
const appRating = ref([]);
const showForm = ref(true);

const snackbar = ref(false);
const snackbarText = ref("");

async function submitForm() {
  const { valid } = await formRef.value.validate();
  if (!$userStore.isLoggedIn) {
    showSnackbar("Please log in to submit your review.");
    return;
  }
  if (valid) {
    postData();
  }
}

async function postData() {
  const formData = {
    toolId: props.appId,
    rating: form.rating,
    review: form.review,
    userId: $userStore.id,
  };

  const response = await $axios.post("/api/public/rating/store", formData);

  if (response.data.success === true) {
    showSnackbar("Thank you. Your review was submitted successfully.");
    //resetState();
  } else {
    showSnackbar("Something went wrong. Please try again later.");
  }
}

const showSnackbar = async (message) => {
  snackbarText.value = message;
  snackbar.value = true;
};

const resetState = () => {
  form.rating = null;
  form.review = "";

  formRef.value.resetValidation();
};

onMounted(() => {
  //getAppRating();
  //console.log(props.appId);
});
</script>

<style scoped>
.bg-gray {
  background-color: var(--v-theme-background);
}
.color-amazon {
  color: #fcb900;
}
</style>