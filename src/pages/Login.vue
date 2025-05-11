<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-8" max-width="400" elevation="8">
      <v-card-title class="text-h5 text-center mb-2">🔐 Connexion</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleLogin" class="d-flex flex-column gap-4">
          <v-text-field
            v-model="email"
            label="Adresse email"
            type="email"
            required
            density="comfortable"
            variant="outlined"
          />

          <v-text-field
            v-model="password"
            label="Mot de passe"
            type="password"
            required
            density="comfortable"
            variant="outlined"
          />

          <v-btn :loading="loading" type="submit" color="primary" block>
            Se connecter
          </v-btn>
        </v-form>

        <v-alert v-if="error" type="error" class="mt-4" dense>
          {{ error }}
        </v-alert>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn
          variant="text"
          to="/register"
          size="small"
          class="text-grey-lighten-1"
        >
          Pas encore de compte ? Créez-en un
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const email = ref("siegwald.thomas@gmail.com");
const password = ref("Yolo2015+");
const loading = ref(false);
const error = ref(null);
const router = useRouter();

const handleLogin = async () => {
  error.value = null;
  loading.value = true;

  try {
    const res = await axios.post("http://localhost:3000/api/auth/login", {
      email: email.value,
      password: password.value,
    });

    const token = res.data.token;
    localStorage.setItem("token", token);
    router.push("/dashboard");
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.message || "Erreur lors de la connexion";
  } finally {
    loading.value = false;
  }
};
</script>
