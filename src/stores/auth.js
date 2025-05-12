// src/stores/auth.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(!!localStorage.getItem("token"));

  function login(token) {
    localStorage.setItem("token", token);
    isAuthenticated.value = true;
  }

  function logout() {
    localStorage.removeItem("token");
    isAuthenticated.value = false;
  }

  return {
    isAuthenticated,
    login,
    logout,
  };
});
