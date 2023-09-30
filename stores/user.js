import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    id: "",
    name: "",
    email: "",
    roles: [],
    permissions: [],
    isLoggedIn: false,
  }),

  actions: {
    async getToken() {
      await axios.get("/sanctum/csrf-cookie");
    },

    async login(email, password) {
      await axios.post("/login", {
        email: email,
        password: password,
      });

      /* after login set state */
      await this.getUser();
    },

    async logout() {
      await axios.post("/logout");
      this.resetState();
    },

    async register(name, email, password, confirmPassword) {
      await axios.post("/register", {
        name: name,
        email: email,
        password: password,
        password_confirmation: confirmPassword,
      });
    },

    async getUser() {
      const response = await axios.get("/api/logged-in-user");
      const { id, name, email, roles, permissions } = response.data;

      this.$state.id = id;
      this.$state.name = name;
      this.$state.email = email;
      this.$state.isLoggedIn = true;

      // store roles and permissions
      this.roles = roles.map((role) => role.name);
      this.permissions = permissions.map((permission) => permission.name);
    },
    resetState() {
      this.$state.id = "";
      this.$state.name = "";
      this.$state.email = "";
      this.$state.isLoggedIn = false;
      this.$state.roles = [];
      this.$state.permissions = [];
    },
  },
  getters: {
    hasRole: (state) => (roleName) => {
      return state.roles.includes(roleName);
    },
    hasPermission: (state) => (permissionName) => {
      return state.permissions.includes(permissionName);
    },
  },
  persist: true,
});
