<template>
  <div>
    <v-container>
      <div v-if="selectedFilterCount > 0">
        <v-badge :content="selectedFilterCount" color="primary">
          <v-btn @click="openFilterDialog" variant="outlined">
            Filters
            <v-icon>mdi-filter-outline</v-icon> </v-btn
          ><br />
        </v-badge>
        <div>
          <span class="clear-filter-button" @click="clearFilter"> Clear </span>
        </div>
      </div>
      <v-btn v-else @click="openFilterDialog" variant="outlined">
        Filters
        <v-icon>mdi-filter-outline</v-icon>
      </v-btn>

      <v-row justify="center">
        <v-dialog v-model="dialog" persistent width="600">
          <v-card>
            <v-card-title>
              <span>Select Filters to Apply</span>
            </v-card-title>
            <v-card-text>
              <v-container class="custom-checkbox-container">
                <span>Pricing</span>
                <v-row class="ma-0 pa-0" no-gutters>
                  <v-col cols="6" align-self="end">
                    <v-checkbox
                      v-model="pricing.free"
                      class="no-margin-checkbox"
                    >
                      <template v-slot:label>
                        <v-icon class="pr-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="64"
                            height="64"
                            viewBox="0 0 64 64"
                          >
                            <path
                              fill="currentColor"
                              d="M52 2H12C6.477 2 2 6.477 2 12v40c0 5.523 4.477 10 10 10h40c5.523 0 10-4.477 10-10V12c0-5.523-4.477-10-10-10zM18 26h-5.09v4.5H18v3h-5.09V41H10V23h8v3zm12.475 15h-3.021l-2.471-7.5h-1.125V41H21V23h5c2.758 0 5 2.355 5 5.25c0 2.197-1.293 4.084-3.121 4.865L30.475 41zM42 26h-5.09v4.5H42v3h-5.09V38H42v3h-8V23h8v3zm12 0h-5.09v4.5H54v3h-5.09V38H54v3h-8V23h8v3z"
                            />
                            <path
                              fill="currentColor"
                              d="M26 26h-2.143v4.5H26c1.182 0 2.143-1.01 2.143-2.25S27.182 26 26 26z"
                            />
                          </svg>
                        </v-icon>
                        Free
                      </template>
                    </v-checkbox>
                  </v-col>

                  <v-col cols="6" align-self="end">
                    <!-- Another Checkbox -->
                    <v-checkbox
                      v-model="pricing.freemium"
                      class="no-margin-checkbox"
                    >
                      <template v-slot:label>
                        <v-icon class="pr-1">mdi-lock-open-outline</v-icon>
                        Freemium
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>
                <v-row class="ma-0 pa-0" no-gutters>
                  <v-col cols="6">
                    <v-checkbox
                      v-model="pricing.freeTrial"
                      class="no-margin-checkbox"
                    >
                      <template v-slot:label>
                        <v-icon class="pr-1"
                          >mdi-checkbox-marked-circle-outline</v-icon
                        >
                        Free Trail
                      </template>
                    </v-checkbox>
                  </v-col>

                  <v-col cols="6">
                    <!-- Another Checkbox -->
                    <v-checkbox
                      v-model="pricing.paid"
                      class="no-margin-checkbox"
                    >
                      <template v-slot:label>
                        <v-icon class="pr-1">mdi-cash</v-icon>
                        Paid
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>
                <v-row class="ma-0 pa-0" no-gutters>
                  <v-col cols="6">
                    <v-checkbox
                      v-model="pricing.contactForPricing"
                      class="no-margin-checkbox"
                    >
                      <template v-slot:label>
                        <v-icon class="pr-1">mdi-cash</v-icon>
                        Contact for Pricing
                      </template>
                    </v-checkbox>
                  </v-col>

                  <v-col cols="6">
                    <!-- Another Checkbox -->
                    <v-checkbox
                      v-model="pricing.deals"
                      class="no-margin-checkbox"
                    >
                      <template v-slot:label>
                        <v-icon class="pr-1">mdi-tag</v-icon>
                        Deals
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>
              </v-container>

              <v-container class="custom-checkbox-container">
                <span>Features</span>
                <v-row class="ma-0 pa-0" no-gutters>
                  <v-col cols="6" align-self="end">
                    <v-checkbox
                      v-model="features.waitlist"
                      class="no-margin-checkbox"
                    >
                      <template v-slot:label>
                        <v-icon class="pr-1">mdi-email</v-icon>
                        Waitlist
                      </template>
                    </v-checkbox>
                  </v-col>

                  <v-col cols="6" align-self="end">
                    <!-- Another Checkbox -->
                    <v-checkbox
                      v-model="features.openSource"
                      class="no-margin-checkbox"
                    >
                      <template v-slot:label>
                        <v-icon class="pr-1">mdi-github</v-icon>
                        Open Source
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>
                <v-row class="ma-0 pa-0" no-gutters>
                  <v-col cols="6">
                    <v-checkbox
                      v-model="features.mobileApp"
                      class="no-margin-checkbox"
                    >
                      <template v-slot:label>
                        <v-icon class="pr-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="512"
                            height="512"
                            viewBox="0 0 512 512"
                          >
                            <path
                              fill="currentColor"
                              d="M380 16H132a32.036 32.036 0 0 0-32 32v416a32.036 32.036 0 0 0 32 32h248a32.036 32.036 0 0 0 32-32V48a32.036 32.036 0 0 0-32-32Zm0 32v32H132V48Zm0 64l.011 224H132V112Zm0 352H132v-96h248.016v96Z"
                            />
                            <path fill="currentColor" d="M240 400h32v32h-32z" />
                          </svg>
                        </v-icon>
                        Mobile App
                      </template>
                    </v-checkbox>
                  </v-col>

                  <v-col cols="6">
                    <!-- Another Checkbox -->
                    <v-checkbox
                      v-model="features.discordCommunity"
                      class="no-margin-checkbox"
                    >
                      <template v-slot:label>
                        <v-icon class="pr-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"
                            />
                          </svg>
                        </v-icon>
                        Discord Community
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>
                <v-row class="ma-0 pa-0" no-gutters>
                  <v-col cols="6">
                    <v-checkbox
                      v-model="features.noSignupRequired"
                      class="no-margin-checkbox"
                    >
                      <template v-slot:label>
                        <v-icon class="pr-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                          >
                            <circle cx="25" cy="20" r="1" fill="currentColor" />
                            <path
                              fill="currentColor"
                              d="M19.414 30H15v-4.414l5.034-5.034A4.607 4.607 0 0 1 20 20a5 5 0 1 1 4.448 4.966zM17 28h1.586l5.206-5.206l.54.124a3.035 3.035 0 1 0-2.25-2.25l.124.54L17 26.414zM6 8h2v8H6zM2 8h2v8H2zm16 0h2v6h-2zm-4 8h-2a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2zm-2-2h2v-4h-2zM2 18h2v8H2zm12 0h2v4h-2zm-4 8H8a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2zm-2-2h2v-4H8zM2 2h2v4H2zm12 0h2v4h-2zm4 0h2v4h-2zm-8 4H8a2 2 0 0 1-2-2V2h2v2h2V2h2v2a2 2 0 0 1-2 2z"
                            />
                          </svg>
                        </v-icon>
                        No Singup Required
                      </template>
                    </v-checkbox>
                  </v-col>

                  <v-col cols="6">
                    <!-- Another Checkbox -->
                    <v-checkbox
                      v-model="features.api"
                      class="no-margin-checkbox"
                    >
                      <template v-slot:label>
                        <v-icon class="pr-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1024"
                            height="1024"
                            viewBox="0 0 1024 1024"
                          >
                            <path
                              fill="currentColor"
                              d="m917.7 148.8l-42.4-42.4c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-76.1 76.1a199.27 199.27 0 0 0-112.1-34.3c-51.2 0-102.4 19.5-141.5 58.6L432.3 308.7a8.03 8.03 0 0 0 0 11.3L704 591.7c1.6 1.6 3.6 2.3 5.7 2.3c2 0 4.1-.8 5.7-2.3l101.9-101.9c68.9-69 77-175.7 24.3-253.5l76.1-76.1c3.1-3.2 3.1-8.3 0-11.4zM769.1 441.7l-59.4 59.4l-186.8-186.8l59.4-59.4c24.9-24.9 58.1-38.7 93.4-38.7c35.3 0 68.4 13.7 93.4 38.7c24.9 24.9 38.7 58.1 38.7 93.4c0 35.3-13.8 68.4-38.7 93.4zm-190.2 105a8.03 8.03 0 0 0-11.3 0L501 613.3L410.7 523l66.7-66.7c3.1-3.1 3.1-8.2 0-11.3L441 408.6a8.03 8.03 0 0 0-11.3 0L363 475.3l-43-43a7.85 7.85 0 0 0-5.7-2.3c-2 0-4.1.8-5.7 2.3L206.8 534.2c-68.9 69-77 175.7-24.3 253.5l-76.1 76.1a8.03 8.03 0 0 0 0 11.3l42.4 42.4c1.6 1.6 3.6 2.3 5.7 2.3s4.1-.8 5.7-2.3l76.1-76.1c33.7 22.9 72.9 34.3 112.1 34.3c51.2 0 102.4-19.5 141.5-58.6l101.9-101.9c3.1-3.1 3.1-8.2 0-11.3l-43-43l66.7-66.7c3.1-3.1 3.1-8.2 0-11.3l-36.6-36.2zM441.7 769.1a131.32 131.32 0 0 1-93.4 38.7c-35.3 0-68.4-13.7-93.4-38.7a131.32 131.32 0 0 1-38.7-93.4c0-35.3 13.7-68.4 38.7-93.4l59.4-59.4l186.8 186.8l-59.4 59.4z"
                            />
                          </svg>
                        </v-icon>
                        API
                      </template>
                    </v-checkbox>
                  </v-col>
                  <v-col cols="6">
                    <!-- Another Checkbox -->
                    <v-checkbox
                      v-model="features.browserExtension"
                      class="no-margin-checkbox"
                    >
                      <template v-slot:label>
                        <v-icon class="pr-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M8.8 21H5q-.825 0-1.413-.588T3 19v-3.8q1.2 0 2.1-.762T6 12.5q0-1.175-.9-1.937T3 9.8V6q0-.825.588-1.413T5 4h4q0-1.05.725-1.775T11.5 1.5q1.05 0 1.775.725T14 4h4q.825 0 1.413.588T20 6v4q1.05 0 1.775.725T22.5 12.5q0 1.05-.725 1.775T20 15v4q0 .825-.588 1.413T18 21h-3.8q0-1.25-.787-2.125T11.5 18q-1.125 0-1.913.875T8.8 21Z"
                            />
                          </svg>
                        </v-icon>
                        Browser Extension
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions class="mr-7">
              <v-spacer></v-spacer>

              <v-btn variant="text" @click="dialog = false"> Close </v-btn>
              <v-btn
                color="primary"
                variant="outlined"
                @click="handleApplyFilters"
              >
                Apply filters
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";

const { $axios } = useNuxtApp();
const router = useRouter();
let dialog = ref(false);
const emit = defineEmits(["filter", "clearFilters"]);

// Pricing checkboxes
const pricing = reactive({
  free: false,
  freemium: false,
  freeTrial: false,
  paid: false,
  contactForPricing: false,
  deals: false,
});

// Features checkboxes
const features = reactive({
  waitlist: false,
  openSource: false,
  mobileApp: false,
  discordCommunity: false,
  noSignupRequired: false,
  api: false,
  browserExtension: false,
});

const openFilterDialog = () => {
  dialog.value = true;
};

const fetchFilteredData = async (queryString) => {
  try {
    const response = await $axios.get(`/api/tools/search?${queryString}`);
    const { data } = response.data;
    if (response.status === 200) {
      emit("filter", data);
    }
    return response;
  } catch (error) {
    console.error("Failed to fetch filtered data:", error);
  }
};

const updateFiltersFromQueryParams = async () => {
  const query = router.currentRoute.value.query;

  if (query.pricing) {
    const pricingValues = Array.isArray(query.pricing)
      ? query.pricing
      : [query.pricing];
    pricingValues.forEach((value) => {
      if (pricing[value] !== undefined) {
        pricing[value] = true;
      }
    });
  }

  if (query.feature) {
    const featureValues = Array.isArray(query.feature)
      ? query.feature
      : [query.feature];
    featureValues.forEach((value) => {
      if (features[value] !== undefined) {
        features[value] = true;
      }
    });
  }

  if (Object.keys(query).length > 0) {
    const queryString = new URLSearchParams(query).toString();
    await fetchFilteredData(queryString);
  }
};

const handleApplyFilters = async () => {
  let featureParams = [];
  let pricingParams = [];

  // Collecting selected pricing and feature options
  for (const [key, value] of Object.entries(pricing)) {
    if (value) {
      pricingParams.push(key);
    }
  }
  for (const [key, value] of Object.entries(features)) {
    if (value) {
      featureParams.push(key);
    }
  }

  const featureQueryString = featureParams.map((f) => `feature=${f}`).join("&");
  const pricingQueryString = pricingParams.map((p) => `pricing=${p}`).join("&");
  const queryString = [featureQueryString, pricingQueryString]
    .filter(Boolean)
    .join("&");

  const paramsArray = queryString.split("&").map((param) => param.split("="));
  const queryObject = paramsArray.reduce((obj, [key, value]) => {
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
    return obj;
  }, {});

  // Update the URL without reloading the page
  router.push({
    path: router.currentRoute.value.path,
    query: queryObject,
  });

  // Fetch and handle filtered data
  await fetchFilteredData(queryString);
  dialog.value = false;
};

const selectedFilterCount = computed(() => {
  const query = router.currentRoute.value.query;
  let count = 0;

  if (query.pricing) {
    count += Array.isArray(query.pricing) ? query.pricing.length : 1;
  }

  if (query.feature) {
    count += Array.isArray(query.feature) ? query.feature.length : 1;
  }

  return count;
});

const clearFilter = async () => {
  // Reset the state of reactive objects
  for (const key in pricing) {
    pricing[key] = false;
  }

  for (const key in features) {
    features[key] = false;
  }

  await router.push({ path: router.currentRoute.value.path, query: {} });

  emit("clearFilters");
};

onMounted(() => {
  updateFiltersFromQueryParams();
});
</script>
<style scoped>
.custom-checkbox-container .v-input--density-default {
  --v-input-control-height: 0;
}
.clear-filter-button {
  text-decoration: underline;
  color: #0060df;
  cursor: pointer;
}
</style>