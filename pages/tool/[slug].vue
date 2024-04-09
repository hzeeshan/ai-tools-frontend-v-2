<template>
  <div>
    <v-container v-if="tool">
      <section>
        <div>
          <v-breadcrumbs
            :items="['Home', `${tool?.tags[0]?.name}`, `${tool?.name}`]"
          ></v-breadcrumbs>
        </div>
      </section>
      <section class="py-3">
        <div class="d-flex align-items-center">
          <h1 class="h1-no-margin text-h5 font-weight-bold">
            {{ tool?.name }}
          </h1>
          <NuxtLink :to="`${tool?.tool_link}`" target="_blank">
            <v-btn class="ml-3 button-align" color="primary">
              Visit <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </NuxtLink>
        </div>
      </section>
      <section class="py-6">
        <v-row>
          <v-col cols="6">
            <NuxtLink :to="`${tool?.tool_link}`" target="_blank">
              <nuxt-img
                v-if="tool?.image_path"
                :src="`${appBaseURL}/${tool?.image_path}`"
                height="200"
                sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:25vw"
                placeholder="true"
                style="width: 100%; height: auto"
              ></nuxt-img>
            </NuxtLink>
          </v-col>
          <v-col cols="6">
            <p>{{ tool.short_description }}</p>
            <p class="pt-3" v-if="tool.is_verified">
              This tool is verified because it is either an established company
              or has good social media presence
            </p>
            <div class="py-5">
              <v-chip>
                {{ tool.pricing_plans }}
              </v-chip>
            </div>
            <div>
              <v-chip-group v-if="features && features.length">
                <v-chip v-for="feature in features" :key="feature">
                  {{ feature }}
                </v-chip>
              </v-chip-group>
            </div>
            <div v-if="tool.social_links.length > 0" id="social-links">
              <p>Social Links</p>
              <div class="d-flex flex-row py-2">
                <span
                  v-for="social_link in tool.social_links"
                  :key="social_link.id"
                >
                  <NuxtLink
                    :to="social_link.link"
                    target="_blank"
                    class="no-link-style"
                  >
                    <v-icon class="icon">
                      {{ getIconName(social_link.type) }}
                    </v-icon>
                  </NuxtLink>
                </span>
              </div>
            </div>
          </v-col>
        </v-row>
      </section>
    </v-container>
    <section v-if="tool">
      <v-container>
        <div class="html-long-description" v-html="tool.long_description"></div>
      </v-container>
    </section>
    <section id="reviews">
      <v-container>
        <CreateReview v-if="tool?.id" :appId="tool.id" />
      </v-container>
    </section>
    <section id="related-tools">
      <ListOfTools
        :tools="relatedTools"
        v-if="relatedTools && relatedTools.length > 0"
      />
    </section>
  </div>
</template>
  
<script setup>
const { $axios } = useNuxtApp();
const route = useRoute();
const config = useRuntimeConfig();
const appBaseURL = config.public.appBaseUrl;

const tool = ref(null);
const features = ref([]);
const relatedTools = ref([]);

const getToolBySlug = async (slug) => {
  try {
    const response = await $axios.get(`/api/tool/${slug}`);
    tool.value = response.data.tool;
    relatedTools.value = response.data.relatedTools;
  } catch (error) {
    console.error(error);
  }
};

const getIconName = (iconType) => {
  const icons = {
    Twitter: "mdi-twitter",
    Instagram: "mdi-instagram",
    Facebook: "mdi-facebook",
    YouTube: "mdi-youtube",
    Discord: "mdi-discord",
    Email: "mdi-email",
    LinkedIn: "mdi-linkedin",
    GitHub: "mdi-github",
    "Chrome Extension": "mdi-google-chrome",
  };

  return icons[iconType] || "mdi-help-circle";
};

watch(tool, (newVal) => {
  if (newVal && newVal.other_features) {
    try {
      features.value = JSON.parse(newVal.other_features);
    } catch (error) {
      console.error("Error parsing other_features JSON:", error);
    }
  }
});
onMounted(async () => {
  const slug = route.params.slug;
  await getToolBySlug(slug);
});
</script>
<style scoped>
.v-breadcrumbs {
  padding-left: 0;
}
.h1-no-margin {
  margin: 0;
}

.button-align {
  margin-top: 0;
}
.html-long-description ::v-deep p {
  padding: 16px 0;
}
#social-links span:not(:last-child) {
  margin-right: 10px;
}

.icon:hover {
  color: rgb(var(--v-theme-primary));
}

.no-link-style {
  color: inherit;
  text-decoration: none;
}
</style>