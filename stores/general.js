import { defineStore } from "pinia";

export const useGeneralStore = defineStore("general", {
  state: () => ({
    isLoading: false,
  }),

  actions: {
    setLoading(state) {
      this.isLoading = state;
    },
  },
  persist: true,
});
