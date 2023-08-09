<template>
  <section>
    <v-parallax
      height="50vh"
      src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
    >
      <div
        class="d-flex flex-column fill-height justify-center align-center text-white"
      >
        <h1 class="display-2">TOP APPs POWERED BY AI</h1>
        <p class="subtitle-1">THE BEST AI POWERED WEB APPS</p>
        <v-btn color="primary" class="mt-3" size="large">Explore</v-btn>
      </div>
    </v-parallax>
    <!-- <v-container fluid class="banner">
      <v-row class="fill-height" align="center" justify="center">
        <v-col cols="12" sm="8" md="6">
          <div class="text-center">
            <h1 class="display-2">TOP APPs POWERED BY AI</h1>
            <p class="subtitle-1">THE BEST AI POWERED WEB APPS</p>
            <v-btn color="primary" class="mt-3" size="large" @click="toggleTheme"
              >Explore</v-btn
            >
          </div>
        </v-col>
      </v-row>
    </v-container> -->
  </section>
</template>

<script setup>
</script>

<style scoped>
.banner {
  height: 50vh;
  background-color: var(--v-theme-background);
}
</style>