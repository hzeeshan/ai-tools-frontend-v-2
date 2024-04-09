<template>
  <v-app>
    <v-row class="fill-height">
      <v-col cols="3" class="sidebar">
        <SideBar />
      </v-col>
      <v-col cols="9" class="content">
        <div>
          <slot />
        </div>
      </v-col>
    </v-row>
  </v-app>
</template>

<style>
.v-app {
  height: 100vh;
  overflow: hidden;
}

/* Fixed sidebar style */
.sidebar {
  position: fixed;
  width: 25%;
  height: 100vh;
  overflow-y: auto;
}

/* Content area style */
.content {
  margin-left: 25%;
  height: 100vh;
  overflow-y: auto;
}
</style>
