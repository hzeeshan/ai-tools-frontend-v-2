<template>
  <v-main>
    <Head>
      <Title>Cerate New App</Title>
    </Head>
    <v-container>
      <v-card>
        <v-card-title>
          <span class="text-h5">Insert new App</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <AppForm :isEditMode="false" />
          </v-container>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "auth",
});
</script>