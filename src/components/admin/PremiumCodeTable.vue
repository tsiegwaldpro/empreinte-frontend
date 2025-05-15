<template>
  <v-card class="pa-4">
    <div class="d-flex justify-space-between align-center mb-4">
      <v-btn color="primary" @click="generateCode" :loading="loadingGen">
        ➕ Générer un code
      </v-btn>
    </div>

    <!-- 🎛️ Filtres -->
    <div class="mb-4">
      <!--
      <div class="text-subtitle-2 font-weight-medium mb-2">Utilisé</div>
      -->
      <div class="d-flex gap-4">
        <v-checkbox
          v-model="filterUsed"
          :true-value="true"
          :false-value="null"
          label="Oui"
          density="compact"
          hide-details
        />
        <v-checkbox
          v-model="filterUnused"
          :true-value="true"
          :false-value="null"
          label="Non"
          density="compact"
          hide-details
        />
      </div>
    </div>

    <!-- 📋 Tableau -->
    <v-data-table
      :headers="headers"
      :items="filteredCodes"
      :loading="loading"
      :sort-by="[{ key: 'expiresAt', order: 'desc' }]"
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

    <v-snackbar v-model="snackbar" color="green">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-card>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import api from "@/api";

const codes = ref([]);
const loading = ref(false);
const loadingGen = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref("");

// 🎯 Filtres checkboxes
const filterUsed = ref(null);
const filterUnused = ref(null);

const headers = [
  { title: "Code", key: "code" },
  { title: "Utilisé", key: "isUsed" },
  { title: "Utilisateur", key: "usedBy" },
  { title: "Expiration", key: "expiresAt", sortable: true },
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

const filteredCodes = computed(() => {
  return codes.value.filter((c) => {
    const showUsed = filterUsed.value === true && c.isUsed === true;
    const showUnused = filterUnused.value === true && c.isUsed === false;

    if (!filterUsed.value && !filterUnused.value) return true;
    return showUsed || showUnused;
  });
});

const generateCode = async () => {
  loadingGen.value = true;
  try {
    const res = await api.post("/admin/generate-code");
    const code = res.data.code;

    await navigator.clipboard.writeText(code);
    snackbarMessage.value = `✅ Code copié !`;
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
