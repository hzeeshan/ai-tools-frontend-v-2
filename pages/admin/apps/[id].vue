<template>
  <v-main>
    <v-container>
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit app </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <AppForm :isEditMode="true" />
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
