<template>
  <main>
    <Head>
      <Title>{{ selectedApp.name }}</Title>
    </Head>
    <v-container>
      <div>
        <v-breadcrumbs
          :items="['Home', `${selectedApp?.category?.name}`]"
        ></v-breadcrumbs>
      </div>

      <section v-if="selectedApp">
        <v-row class="pt-5">
          <v-col cols="12" md="6" lg="6" sm="12">
            <div v-if="selectedApp.main_image">
              <nuxt-img
                :src="
                  selectedApp.main_image.path.startsWith('http')
                    ? selectedApp.main_image.path
                    : `${appBaseURL}/${selectedApp.main_image.path}`
                "
                sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:25vw"
                placeholder="blur"
                style="max-width: 100%; height: auto"
              />
            </div>
          </v-col>
          <v-col cols="12" md="6" lg="6" sm="12">
            <h1>{{ selectedApp.name }}</h1>
            <p class="py-5">
              {{ selectedApp.short_description }}
            </p>
            <p v-if="selectedApp.category">
              <b>Category:</b> {{ selectedApp.category.name }}
            </p>
            <br />
            <v-row
              v-if="
                selectedApp.price_plans &&
                Object.keys(selectedApp.price_plans).length > 0
              "
            >
              <v-col cols="12">
                <h2>Pricing Plans</h2>
                <v-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Plan Name</th>
                        <th class="text-left">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(plan, key) in selectedApp.price_plans"
                        :key="key"
                      >
                        <td>{{ plan.name }}</td>
                        <td>{{ plan.price }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-table>
              </v-col>
            </v-row>

            <div class="py-3 d-flex justify-center">
              <v-btn variant="outlined" rounded>
                <a
                  :href="selectedApp.website_link"
                  class="custome-link"
                  target="_blank"
                >
                  <v-icon>mdi-link</v-icon> Explore {{ selectedApp.name }}
                </a>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </section>
      <section id="tabs" class="pt-9">
        <v-card>
          <v-tabs v-model="tab" color="primary">
            <v-tab value="description">description</v-tab>
            <v-tab value="reviews">Reviews</v-tab>
            <v-tab value="tags">Tags</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="description">
                <div v-html="selectedApp.description"></div>
              </v-window-item>

              <v-window-item value="reviews">
                <create-review :appId="selectedAppId"></create-review>
              </v-window-item>

              <v-window-item value="tags">
                <section id="categories">
                  <v-card>
                    <v-card-text>
                      <v-chip-group column multiple>
                        <v-chip
                          v-for="tag in tags"
                          :key="tag.id"
                          filter
                          variant="outlined"
                        >
                          {{ tag.name }}
                        </v-chip>
                      </v-chip-group>
                    </v-card-text>
                  </v-card>
                </section>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </section>
      <section id="related-products" style="padding-top: 50px">
        <h1 class="py-5">Related Apps</h1>
        <v-divider></v-divider>
        <DisplayApps :apps="relatedApps" v-if="relatedApps.length > 0" />
      </section>
    </v-container>
  </main>
</template>

<script setup>
const route = useRoute();
const { $axios } = useNuxtApp();
const appSlug = route.params.slug;
const tab = ref(null);
const selectedApp = ref({});
const selectedAppId = ref(null);
const config = useRuntimeConfig();
const baseUrl = config.public.apiBaseUrl;
const appBaseURL = config.public.appBaseUrl;
const relatedApps = ref([]);
const tags = ref([]);

async function getAppDetails() {
  try {
    const res = await $axios.get(`/api/app/${appSlug}`);

    if (!res.data) {
      throw new Error("No data received");
    }
    //console.log(res.data);
    const { id, category } = res.data;
    selectedApp.value = res.data;
    console.log(selectedApp.value.main_image.path);
    selectedAppId.value = id;

    getAppRelatedTags(id);

    // Call getRelatedApps after categoryId is updated.
    if (category && category.id) {
      getRelatedApps(category.id);
    }
  } catch (error) {
    console.error("Error fetching app details:", error);
    // Handle the error appropriately in your UI
  }
}

async function getRelatedApps(id) {
  if (id) {
    const { data } = await useFetch(`${baseUrl}apps/category/${id}`);
    relatedApps.value = data.value;
  }
}
async function getAppRelatedTags(id) {
  if (id) {
    const { data } = await useFetch(`${baseUrl}app/tags/${id}`);
    tags.value = data.value;
  }
}
onMounted(() => {
  getAppDetails();
});
</script>

<style scoped>
.gradient {
  background: linear-gradient(to right, red, blue);
}
.custome-link {
  text-decoration: none;
}
</style>