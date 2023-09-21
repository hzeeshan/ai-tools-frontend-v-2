<template>
  <section>
    <v-parallax height="40vh" class="parallax">
      <div
        class="d-flex flex-column fill-height justify-center align-center text-white"
      >
        <h1 class="text-h4 font-weight-bold py-3 text-center">
          Discover the Universe of AI Tools
        </h1>
        <p class="subtitle-1 text-center">
          Browse a curated collection of the most innovative AI tools, apps, and
          extensions.
          <br />

          <v-btn to="/platforms" class="my-3 main-action-button" size="large"
            >Dive In</v-btn
          >
        </p>
        <div style="width: 70%" class="pb-5">
          <SearchInput />
        </div>
      </div>
    </v-parallax>
  </section>
</template>

<style scoped>
.parallax {
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(61, 56, 164, 1) 35%,
    rgba(0, 212, 255, 1) 100%
  );
}
.main-action-button {
  background-color: #273139;
  color: white;
}
</style>