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

const email = ref("siegwald.thomas@gmail.com");
const loading = ref(false);
const message = ref("");
const error = ref("");

const submit = async () => {
  loading.value = true;
  message.value = "";
  error.value = "";

  try {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value }),
    });

    const text = await res.text(); // ✅
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Réponse invalide : " + text); // ✅ message utile
    }

    if (!res.ok) throw new Error(data.message || "Erreur serveur");
    message.value = data.message;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
