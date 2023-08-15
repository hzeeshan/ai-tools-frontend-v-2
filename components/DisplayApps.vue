<template>
  <section id="apps">
    <v-container>
      <v-row>
        <v-col v-for="app in apps" cols="12" sm="4" md="4" :key="app.id">
          <v-card class="mx-auto app-card" max-width="350">
            <nuxt-img
              v-if="app.main_image"
              :src="
                app.main_image.path.startsWith('http')
                  ? app.main_image.path
                  : `${appBaseURL}/${app.main_image.path}`
              "
              height="200"
              sizes="xs:320px sm:420px md:768px lg:1024px"
              placeholder="true"
              fit="cover"
            ></nuxt-img>

            <!-- Default Image if no main image exists -->
            <v-img v-else height="200px" cover></v-img>

            <v-card-title> {{ app.name }} </v-card-title>

            <v-card-text class="app-card-text">
              {{ app.short_description }}
            </v-card-text>

            <v-card-actions class="d-flex justify-space-between">
              <v-btn
                color="primary"
                variant="outlined"
                :to="`/ai-apps/${app.slug}`"
              >
                Explore
              </v-btn>
              <div
                class="d-flex align-center"
                v-if="$userStore.hasRole('admin')"
              >
                <v-icon
                  @click="emit('editButtonClicked', app.id)"
                  icon="mdi-pencil"
                  class="pr-3"
                ></v-icon>
                <v-icon
                  icon="mdi-delete"
                  @click="emit('deleteButtonClicked', app.id)"
                ></v-icon>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template> 

<script setup>
const { $userStore } = useNuxtApp();
const config = useRuntimeConfig();
const appBaseURL = config.public.appBaseUrl;
const props = defineProps({
  apps: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["editButtonClicked", "deleteButtonClicked"]);
</script>

<style scoped>
.app-card {
  height: 450px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.app-card-text {
  flex-grow: 1;
  overflow: auto;
}
</style>
