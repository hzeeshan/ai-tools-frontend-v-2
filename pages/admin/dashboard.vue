<template>
  <main>
    <Head>
      <Title>Admin - Dashboard</Title>
    </Head>
    <h1>Dashboard</h1>
  </main>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "auth",
});
</script>

<style>
</style>