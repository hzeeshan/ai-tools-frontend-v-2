<template>
  <div class="mx-auto" max-width="600">
    <v-slide-group show-arrows>
      <v-slide-group-item
        v-for="tag in tags"
        :key="tag.id"
        v-slot="{ isSelected }"
      >
        <v-btn
          class="ma-2"
          rounded
          :color="isSelected ? 'primary' : undefined"
          @click="handleSelectedTag(tag)"
        >
          {{ tag.name }}
        </v-btn>
      </v-slide-group-item>
    </v-slide-group>
  </div>
</template>

<script setup>
const { $axios } = useNuxtApp();
const router = useRouter();
const tags = ref([]);

const getTagsList = async () => {
  const response = await $axios.get(`/api/tags`);
  tags.value = response.data;
};

const handleSelectedTag = (tag) => {
  console.log(tag.slug);
  navigateTo({
    path: `/ai-tools/${tag.slug}`,
  });
};

onMounted(() => {
  getTagsList();
});
</script>