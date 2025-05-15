<template>
  <v-container class="py-10">
    <h1 class="text-h4 font-weight-bold mb-8">Espace Admin</h1>

    <!-- 🎟️ Bloc Codes Premium -->
    <v-card class="mb-10" color="indigo-darken-4" variant="flat">
      <v-card-title class="text-white">🎟️ Codes Premium générés</v-card-title>
      <v-card-text class="text-white">
        <PremiumCodeTable />
      </v-card-text>
    </v-card>

    <!-- 🛠️ Bloc Recommandations -->
    <v-card class="mb-6" color="grey-darken-3" variant="flat">
      <v-card-title class="text-white"
        >🛠️ Recommandations détectées</v-card-title
      >
      <v-card-text>
        <v-checkbox
          v-model="onlyWithoutActions"
          label="Afficher uniquement celles sans actions"
          class="mb-4 text-white"
        />

        <v-data-table
          :headers="headers"
          :items="filteredRecos"
          item-value="id"
          class="elevation-1"
          dense
        >
          <template #item.actions="{ item }">
            <span
              v-if="!item.actions || item.actions.length === 0"
              class="text-red"
            >
              ❌ Aucune
            </span>
            <span v-else class="text-green">
              ✅ {{ item.actions.length }}
            </span>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import PremiumCodeTable from "@/components/admin/PremiumCodeTable.vue";

const recos = ref([]);
const onlyWithoutActions = ref(false);

const headers = [
  { title: "ID", key: "id" },
  { title: "Titre", key: "title" },
  { title: "Groupe", key: "group" },
  { title: "Actions", key: "actions" },
];

const filteredRecos = computed(() => {
  return onlyWithoutActions.value
    ? recos.value.filter((r) => !r.actions || r.actions.length === 0)
    : recos.value;
});

onMounted(async () => {
  try {
    const res = await axios.get("/api/admin/recommandations");
    recos.value = res.data;
  } catch (err) {
    console.error("Erreur chargement recommandations :", err);
  }
});
</script>
