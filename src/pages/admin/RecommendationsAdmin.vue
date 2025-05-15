<template>
  <h2 class="text-h5 font-weight-bold mb-6">🛠️ Recommandations détectées</h2>

  <v-card color="grey-darken-3" variant="flat">
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
          <span v-else class="text-green"> ✅ {{ item.actions.length }} </span>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

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
