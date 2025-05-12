<template>
  <v-container class="mt-10" max-width="500">
    <h2 class="text-h5 mb-4">Réinitialise ton mot de passe</h2>
    <v-alert v-if="message" type="success" class="mb-4">{{ message }}</v-alert>
    <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
    <v-form @submit.prevent="submit">
      <v-text-field
        v-model="password"
        label="Nouveau mot de passe"
        type="password"
        required
      />
      <v-btn type="submit" color="primary" :loading="loading">Valider</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api"; // ✅ on utilise l’instance axios centralisée

const route = useRoute();
const router = useRouter();

const password = ref("");
const loading = ref(false);
const message = ref("");
const error = ref("");

const submit = async () => {
  loading.value = true;
  message.value = "";
  error.value = "";

  try {
    const res = await api.post(
      `/api/auth/reset-password/${route.params.token}`,
      {
        newPassword: password.value,
      }
    );

    message.value = res.data.message;

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (err) {
    error.value = err.response?.data?.message || "Erreur serveur";
  } finally {
    loading.value = false;
  }
};
</script>
