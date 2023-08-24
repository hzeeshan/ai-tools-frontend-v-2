<template>
  <main>
    <section>
      <div v-if="appRating.length === 0">
        <p
          class="bg-gray py-5 px-3"
          :class="{ 'light-bg-color': isLightTheme }"
        >
          There are no reviews yet.
        </p>
      </div>
      <div v-else>
        <v-card
          v-for="(rating, index) in appRating"
          :key="index"
          class="mb-4 bg-gray"
        >
          <v-card-title class="headline d-flex justify-space-between">
            <span>{{ rating.user.name }}</span>
            <span>{{ rating.formattedDate }}</span>
          </v-card-title>
          <v-card-subtitle>
            <v-rating
              v-model="rating.rating"
              readonly
              class="color-amazon"
              dense
            ></v-rating>
          </v-card-subtitle>
          <v-card-text>
            {{ rating.comment }}
          </v-card-text>
        </v-card>
      </div>
    </section>

    <section>
      <Snackbar v-model="snackbar" :text="snackbarText" />
    </section>

    <section class="bg-gray py-5 px-3" style="margin-top: 40px">
      <v-container>
        <div>
          <h3 class="font-weight-bold">Write a review</h3>
          <p>
            Your email address will not be published. Required fields are marked
            *
          </p>
          <br />
          <v-form v-if="showForm" ref="formRef">
            <v-row>
              <v-col>
                <div>
                  <!-- <v-rating
                    v-model="form.rating"
                    color="#fcb900"
                    clearable
                    :rules="[rules.required]"
                  ></v-rating> -->
                  <v-input :value="form.rating">
                    <v-rating v-model="form.rating" color="#fcb900" clearable />
                  </v-input>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-textarea
                  label="Youe Review*"
                  variant="outlined"
                  v-model="form.review"
                  :rules="[rules.required]"
                  :error-messages="serverErrors.review"
                  @input="resetServerError('review')"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  label="Name*"
                  variant="outlined"
                  v-model="form.name"
                  :rules="[rules.required]"
                  :error-messages="serverErrors.name"
                  @input="resetServerError('name')"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  label="Email*"
                  type="email"
                  variant="outlined"
                  v-model="form.email"
                  :rules="[rules.required, rules.email]"
                  :error-messages="serverErrors.email"
                  @input="resetServerError('email')"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn color="primary" @click="submitForm"> submit </v-btn>
              </v-col>
            </v-row>
          </v-form>
          <div v-else>
            <h2 class="py-5">
              Thank you. Your review was submitted successfully.
            </h2>
            <v-btn color="primary" @click="submitAnotherReview"
              >Submit another review</v-btn
            >
          </div>
        </div>
      </v-container>
    </section>
  </main>
</template>

<script setup>
import { useTheme } from "vuetify";
const theme = useTheme();
const isLightTheme = computed(() => theme.global.current.value === "light");

const props = defineProps({
  appId: {
    type: Number,
    required: true,
  },
});
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
    getAppRating(); /* fetch latest reviews */
  }

  if (error.value && error.value.data.errors) {
    serverErrors.value = error.value.data.errors;
  }
}
function submitAnotherReview() {
  showForm.value = true;
}
async function getAppRating() {
  const id = props.appId;
  const { data } = await useFetch(`${baseUrl}/app/rating/${id}`);

  appRating.value = data.value;
}

function resetServerError(fieldName) {
  if (serverErrors.value && serverErrors.value[fieldName]) {
    serverErrors.value[fieldName] = [];
  }
}

const showSnackbar = async (message) => {
  snackbarText.value = message;
  snackbar.value = true;
  //await nextTick();
  //snackbar.value = true;
};

onMounted(() => {
  getAppRating();
});
</script>

<style scoped>
.bg-gray {
  background-color: var(--v-theme-background);
}
.light-bg-color {
  background-color: #f6f6f7;
}
.color-amazon {
  color: #fcb900;
}
</style>