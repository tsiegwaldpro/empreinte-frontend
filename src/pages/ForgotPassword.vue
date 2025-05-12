<template>
  <v-container class="mt-10" max-width="500">
    <h2 class="text-h5 mb-4">Mot de passe oublié</h2>
    <v-alert v-if="message" type="success" class="mb-4">{{ message }}</v-alert>
    <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
    <v-form @submit.prevent="submit">
      <v-text-field
        v-model="email"
        label="Adresse e-mail"
        type="email"
        required
      />
      <v-btn type="submit" color="primary" :loading="loading">Envoyer</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import api from "@/api"; // ✅ on utilise l'instance centralisée

const email = ref("siegwald.thomas@gmail.com");
const loading = ref(false);
const message = ref("");
const error = ref("");

const submit = async () => {
  loading.value = true;
  message.value = "";
  error.value = "";

  try {
    const res = await api.post("/api/auth/forgot-password", {
      email: email.value,
    });

    message.value = res.data.message;
  } catch (err) {
    error.value = err.response?.data?.message || "Erreur lors de l'envoi.";
  } finally {
    loading.value = false;
  }
};
</script>
