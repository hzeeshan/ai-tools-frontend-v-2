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
                  :error-messages="serverErrors.review"
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

    <!-- <section>
      <Snackbar v-model="snackbar" :text="snackbarText" />
    </section> -->

    <section class="bg-gray px-3">
      <v-container> </v-container>
    </section>
  </div>
</template>

<script setup>
/* const props = defineProps({
  appId: {
    type: Number,
    required: true,
  },
}); */
const form = reactive({
  rating: null,
  review: "",
  name: "",
  email: "",
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

  if (valid) {
    postData();
  }
}

async function postData() {
  const formData = {
    appId: props.appId,
    rating: form.rating,
    review: form.review,
    name: form.name,
    email: form.email,
  };

  const { data, error } = await useFetch(`${baseUrl}/rating/store`, {
    method: "post",
    body: formData,
  });

  if (data.value.success) {
    showForm.value = false;
    showSnackbar("Thank you. Your review was submitted successfully.");
    //getAppRating(); /* fetch latest reviews */
  }

  if (error.value && error.value.data.errors) {
    serverErrors.value = error.value.data.errors;
  }
}
function submitAnotherReview() {
  showForm.value = true;
}
/* async function getAppRating() {
  const id = props.appId;
  const { data } = await useFetch(`${baseUrl}/app/rating/${id}`);

  appRating.value = data.value;
} */

const showSnackbar = async (message) => {
  snackbarText.value = message;
  snackbar.value = true;
  //await nextTick();
  //snackbar.value = true;
};

onMounted(() => {
  //getAppRating();
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