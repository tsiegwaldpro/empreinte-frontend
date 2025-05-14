<template>
  <v-card class="pa-4">
    <div class="d-flex justify-space-between align-center mb-4">
      <v-card-title class="text-h6">🎟️ Codes Premium générés</v-card-title>
      <v-btn color="primary" @click="generateCode" :loading="loadingGen">
        ➕ Générer un code
      </v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="codes"
      :loading="loading"
      class="mt-4"
    >
      <template #item.isUsed="{ item }">
        <v-chip :color="item.isUsed ? 'success' : 'grey'" small>
          {{ item.isUsed ? "Oui" : "Non" }}
        </v-chip>
      </template>

      <template #item.usedBy="{ item }">
        {{ item.usedBy?.email || "—" }}
      </template>

      <template #item.expiresAt="{ item }">
        {{ item.expiresAt ? formatDate(item.expiresAt) : "N/A" }}
      </template>

      <template #item.actions="{ item }">
        <v-btn
          v-if="item.isUsed"
          size="small"
          @click="extendCode(item.code)"
          icon="mdi-clock-plus"
          color="primary"
        />
        <v-btn
          size="small"
          @click="deleteCode(item.code)"
          icon="mdi-delete"
          color="red"
        />
      </template>
    </v-data-table>

    <v-snackbar v-model="snackbar" color="green">{{
      snackbarMessage
    }}</v-snackbar>
  </v-card>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api from "@/api";

const codes = ref([]);
const loading = ref(false);
const loadingGen = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref("");

const headers = [
  { title: "Code", key: "code" },
  { title: "Utilisé", key: "isUsed" },
  { title: "Utilisateur", key: "usedBy" },
  { title: "Expiration", key: "expiresAt" },
  { title: "Actions", key: "actions", sortable: false },
];

const formatDate = (date) =>
  new Date(date).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });

const fetchCodes = async () => {
  loading.value = true;
  try {
    const res = await api.get("/admin/codes");
    codes.value = res.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const generateCode = async () => {
  loadingGen.value = true;
  try {
    const res = await api.post("/admin/generate-code");
    const code = res.data.code;

    // Copier automatiquement dans le presse-papier
    await navigator.clipboard.writeText(code);

    snackbarMessage.value = `✅ Code copié ! Ajoute ce code dans ton profil pour profiter d’un compte premium pendant 24h.`;
    snackbar.value = true;

    await fetchCodes();
  } catch (err) {
    console.error(err);
  } finally {
    loadingGen.value = false;
  }
};

const extendCode = async (code) => {
  try {
    await api.post("/admin/extend-code", { code });
    snackbarMessage.value = `Code ${code} prolongé de 24h.`;
    snackbar.value = true;
    await fetchCodes();
  } catch (err) {
    console.error(err);
  }
};

const deleteCode = async (code) => {
  try {
    await api.delete(`/admin/code/${code}`);
    snackbarMessage.value = `Code ${code} supprimé.`;
    snackbar.value = true;
    await fetchCodes();
  } catch (err) {
    console.error(err);
  }
};

onMounted(fetchCodes);
</script>
