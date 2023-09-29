<template>
  <section>
    <v-container>
      <h1>{{ tagSlug }}</h1>
    </v-container>
  </section>
</template>

<script setup>
const route = useRoute();
const tagSlug = route.params.tagSlug;
console.log(tagSlug);
</script>