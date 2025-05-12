<template>
  <v-container class="py-10">
    <v-row class="align-center mb-6">
      <v-col cols="12" md="2" class="d-flex justify-center">
        <v-avatar size="80">
          <span class="text-h5">{{ initials }}</span>
        </v-avatar>
      </v-col>
      <v-col cols="12" md="10">
        <h2 class="text-h5 font-weight-bold">
          {{ user.firstName }} {{ user.lastName }}
        </h2>
        <p class="mb-1">{{ user.email }}</p>
        <v-chip
          :color="user.role === 'freemium' ? 'primary' : 'secondary'"
          label
        >
          {{ user.role === "freemium" ? "Compte Freemium" : user.role }}
        </v-chip>
        <p class="text-grey text-caption mt-1">
          Inscrit depuis le {{ formatDate(user.createdAt) }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

const user = ref({});
const initials = ref("");

onMounted(async () => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const resUser = await axios.get("http://localhost:3000/api/auth/me", {
    headers,
  });
  user.value = resUser.data;

  initials.value = `${user.value.firstName?.[0] || ""}${
    user.value.lastName?.[0] || ""
  }`.toUpperCase();
});

const formatDate = (str) => new Date(str).toLocaleDateString();
</script>
