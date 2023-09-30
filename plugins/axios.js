import axios from "axios";
import { useGeneralStore } from "~/stores/general";

export default defineNuxtPlugin((nuxtApp) => {
  const generalStore = useGeneralStore();

  axios.defaults.withCredentials = true;

  if (typeof window !== "undefined") {
    axios.defaults.baseURL = window.location.hostname.includes("localhost")
      ? "http://localhost:8000"
      : "https://api.aiappsuniverse.com";
  } else {
    // Default to development in SSR context, or make a similar check based on server context
    axios.defaults.baseURL = "https://api.aiappsuniverse.com";
  }

  axios.interceptors.request.use(
    (config) => {
      generalStore.setLoading(true);
      return config;
    },
    (error) => {
      generalStore.setLoading(false);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      generalStore.setLoading(false);
      return response;
    },
    (error) => {
      generalStore.setLoading(false);
      console.log(error);
      switch (error.response?.status) {
        case 401:
        case 419:
        case 503:
          // useUserStore().resetState();
          break;
        case 500:
          alert("Oops, something went wrong!");
          break;
        default:
          return Promise.reject(error);
      }
    }
  );

  return {
    provide: {
      axios: axios,
    },
  };
});
