<template>
  <v-container>
    <v-row>
      <v-col v-for="tool in tools" cols="12" sm="4" md="4" :key="tool.id">
        <v-card class="mx-auto my-auto flex-card" max-width="374">
          <NuxtLink :to="`/tool/${tool.slug}`">
            <nuxt-img
              v-if="tool.image_path"
              :src="`${appBaseURL}/${tool.image_path}`"
              height="200"
              sizes="xs:320px sm:420px md:768px lg:1024px"
              placeholder="true"
              fit="cover"
            ></nuxt-img>
          </NuxtLink>

          <v-card-item>
            <v-card-title>
              {{ tool.name }}
              <v-icon color="#179CF3" v-if="tool.is_verified"
                >mdi-check-circle</v-icon
              >
            </v-card-title>
          </v-card-item>

          <v-card-text
            style="height: 100px; overflow: hidden; text-overflow: ellipsis"
          >
            <v-row align="center" class="mx-0"> </v-row>

            <div class="py-5 text-subtitle-1" v-if="tool.price">
              {{ tool.price }}
            </div>
            <div class="my-4 text-subtitle-1" v-else>&nbsp;</div>

            <div>
              {{ tool.short_description }}
            </div>
          </v-card-text>

          <v-card-actions class="d-flex justify-space-between">
            <!-- <v-btn
              color="primary"
              variant="outlined"
              :to="`/tool/${tool.slug}`"
            >
              Explore
            </v-btn> -->
            <v-spacer></v-spacer>
            <div class="d-flex align-center" v-if="$userStore.hasRole('admin')">
              <v-icon
                @click="emit('editButtonClicked', tool.id)"
                icon="mdi-pencil"
                class="pr-3"
                color="surface-variant"
              ></v-icon>
              <v-icon
                icon="mdi-delete"
                color="surface-variant"
                class="delete-button"
                @click="emit('deleteButtonClicked', tool.id)"
              ></v-icon>
            </div>
          </v-card-actions>

          <v-divider class="mx-4 mb-1"></v-divider>

          <div
            class="px-4"
            style="height: 80px; overflow: hidden; text-overflow: ellipsis"
          >
            <v-chip-group>
              <v-chip v-for="tag in tool.tags" :key="tag.id">
                <NuxtLink :to="`/ai-tools/${tag.slug}`">
                  <v-icon start icon="mdi-tag"></v-icon>{{ tag.name }}
                </NuxtLink>
              </v-chip>
            </v-chip-group>
          </div>

          <v-card-actions>
            <!-- v-btn color="primary" variant="outlined"> Explore </v-btn> -->
            <NuxtLink :to="`/tool/${tool.slug}`">
              <v-btn variant="outlined" color="primary">
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </NuxtLink>
            <!-- <v-btn variant="outlined" color="secondary" class="ml-3">
              <v-icon
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="24"
                  viewBox="0 0 13 24"
                >
                  <path
                    fill="currentColor"
                    d="M0 2.089v21.912l6.546-6.26l6.545 6.26V2.089A2.11 2.11 0 0 0 10.982 0l-.077.001h.004h-8.726L2.11 0A2.109 2.109 0 0 0 .001 2.088v.001z"
                  /></svg
              ></v-icon>
            </v-btn> -->
            <!--  <v-btn color="secondary" variant="elevated">
              Add to Favorite
            </v-btn> -->
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const emit = defineEmits(["editButtonClicked", "deleteButtonClicked"]);
const config = useRuntimeConfig();
const appBaseURL = config.public.appBaseUrl;
const props = defineProps({
  tools: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.delete-button:hover {
  cursor: pointer;
  color: red;
}
</style>
