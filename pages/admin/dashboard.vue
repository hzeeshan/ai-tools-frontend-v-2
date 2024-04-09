<template>
  <main>
    <Head>
      <Title>Admin - Dashboard</Title>
    </Head>
    <v-container>
      <div>
        <h1 class="pt-5 pb-3">Dashboard</h1>
      </div>
      <v-row class="text-center">
        <v-col cols="4">
          <v-card variant="outlined">
            <v-card-title> Tools </v-card-title>
            <v-card-text class="font-weight-bold">{{ toolsCount }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card variant="outlined">
            <v-card-title> Tags </v-card-title>
            <v-card-text class="font-weight-bold">
              {{ tagsCount }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "auth",
});
const { $axios } = useNuxtApp();
const toolsCount = ref(0);
const tagsCount = ref(0);

const fetchStats = async () => {
  const { data } = await $axios.get("/api/dashboard/stats");
  toolsCount.value = data.tools;
  tagsCount.value = data.tags;
};

onMounted(() => {
  fetchStats();
});
</script>