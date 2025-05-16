<template>
  <v-card color="grey-darken-3" class="pa-4" flat>
    <!-- 🟦 Filtres haut : Boutons catégories + switch -->
    <div class="d-flex flex-wrap align-center gap-4 mb-4">
      <div>
        <span class="text-caption mr-2 text-grey-lighten-2">Catégorie :</span>
        <v-btn
          v-for="cat in categories"
          :key="cat"
          :variant="selectedCategory === cat ? 'elevated' : 'tonal'"
          color="primary"
          class="me-2 mb-2 text-capitalize"
          @click="setCategory(cat)"
        >
          {{ cat }}
        </v-btn>
      </div>
      <!-- FILTRE SWITCH -->
      <v-switch
        v-model="onlyWithoutActions"
        inset
        color="deep-orange"
        class="ml-6 mb-0"
        :label="switchLabel"
        hide-details
      />
    </div>

    <!-- 🟦 Pagination (haut) -->
    <div class="d-flex justify-center mb-3">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        color="primary"
        density="comfortable"
      />
    </div>

    <!-- 🟦 Liste des recos paginées -->
    <v-expansion-panels v-model="activePanel" multiple>
      <v-expansion-panel
        v-for="reco in paginatedRecos"
        :key="reco.id"
        class="bg-grey-darken-4 text-white mb-2 rounded"
      >
        <v-expansion-panel-title>
          <div class="d-flex flex-column w-100">
            <div class="d-flex justify-space-between align-center w-100">
              <div>
                <div class="text-h6">{{ reco.title }}</div>
                <div class="text-caption text-grey">{{ reco.group }}</div>
              </div>
              <div class="d-flex align-center gap-2">
                <!-- Badge type d’action -->
                <v-chip
                  v-if="reco.actions?.some((a) => a.type === 'dynamic')"
                  color="info"
                  size="small"
                  class="mr-2"
                  label
                >
                  Actions automatiques
                </v-chip>
                <v-chip
                  v-else-if="reco.actions?.length"
                  color="deep-orange"
                  size="small"
                  class="mr-2"
                  label
                >
                  Actions catalogue
                </v-chip>
                <v-btn
                  icon
                  color="primary"
                  @click.stop="openAddActionForm(reco)"
                  title="Ajouter une action"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </div>
            <ActionSummary
              v-if="reco.actions?.length"
              :actions="reco.actions"
              @edit="editAction(reco, $event)"
              @delete="deleteAction(reco.id, $event)"
            />
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <ActionSummary
            v-if="reco.actions?.length"
            :actions="reco.actions"
            detail
            @edit="editAction(reco, $event)"
            @delete="deleteAction(reco.id, $event)"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- 🟦 Pagination (bas) -->
    <div class="d-flex justify-center mt-4">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        color="primary"
        density="comfortable"
      />
    </div>

    <!-- Modal ajout action -->
    <v-dialog v-model="showAddActionForm" max-width="600px">
      <v-card>
        <v-card-title>
          Ajouter une action à <strong>{{ currentReco?.title }}</strong>
        </v-card-title>

        <v-card-text>
          <v-text-field
            label="Label de l'action"
            v-model="newActionLabel"
            required
            :rules="[(v) => !!v || 'Le label est requis']"
          />
          <v-textarea
            label="Code / Description détaillée (optionnel)"
            v-model="newActionCode"
            rows="4"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showAddActionForm = false">Annuler</v-btn>
          <v-btn color="primary" @click="submitNewAction">Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import ActionSummary from "@/components/admin/ActionSummary.vue";

const recos = ref([]);
const onlyWithoutActions = ref(false);
const activePanel = ref([]);
const selectedCategory = ref("Toutes");

// 🟦 Catégories à filtrer
const categories = [
  "Toutes",
  "Performance",
  "Accessibility",
  "Best Practices",
  "SEO",
];

function setCategory(cat) {
  selectedCategory.value = cat;
}

// Switch label dynamique
const switchLabel = computed(() =>
  onlyWithoutActions.value
    ? "Seulement celles sans actions"
    : "Afficher uniquement celles sans actions"
);

const showAddActionForm = ref(false);
const currentReco = ref(null);
const newActionLabel = ref("");
const newActionCode = ref("");

// 🟦 PAGINATION
const perPage = ref(10);
const currentPage = ref(1);

// 🟦 Reset page si filtre changé
watch([onlyWithoutActions, selectedCategory], () => {
  currentPage.value = 1;
});

onMounted(fetchRecos);
async function fetchRecos() {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Non authentifié");
    const res = await axios.get("/api/admin/recommandations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    recos.value = res.data;
  } catch (err) {
    console.error("Erreur chargement :", err);
  }
}

function openAddActionForm(reco) {
  currentReco.value = reco;
  newActionLabel.value = "";
  newActionCode.value = "";
  showAddActionForm.value = true;
}

function editAction(reco, idx) {
  currentReco.value = reco;
  const action = reco.actions[idx];
  newActionLabel.value = action.label;
  newActionCode.value = action.code;
  showAddActionForm.value = true;
}

const filteredRecos = computed(() => {
  let list = recos.value;
  if (onlyWithoutActions.value) {
    list = list.filter((r) => !r.actions?.length);
  }
  if (selectedCategory.value !== "Toutes") {
    list = list.filter((r) => r.group === selectedCategory.value);
  }
  return list;
});

const uniqueFilteredRecos = computed(() => {
  const map = new Map();
  filteredRecos.value.forEach((r) => {
    if (!map.has(r.id)) map.set(r.id, r);
  });
  return Array.from(map.values());
});

// 🟦 Pagination
const totalPages = computed(() =>
  Math.ceil(uniqueFilteredRecos.value.length / perPage.value)
);

const paginatedRecos = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return uniqueFilteredRecos.value.slice(start, start + perPage.value);
});

async function submitNewAction() {
  if (!newActionLabel.value.trim()) return alert("Label requis");
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const res = await axios.post(
      `/api/admin/recommandations/${currentReco.value.id}/actions`,
      {
        label: newActionLabel.value.trim(),
        code: newActionCode.value.trim() || "",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const idx = recos.value.findIndex((r) => r.id === res.data.id);
    if (idx !== -1) recos.value[idx] = res.data;
    showAddActionForm.value = false;
  } catch (err) {
    console.error("Erreur ajout action :", err);
    alert("Erreur lors de l'ajout de l'action");
  }
}

async function deleteAction(recoId, actionIndex) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Non authentifié");
    await axios.delete(
      `/api/admin/recommandations/${recoId}/actions/${actionIndex}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const reco = recos.value.find((r) => r.id === recoId);
    if (reco) reco.actions.splice(actionIndex, 1);
  } catch (err) {
    console.error("Erreur suppression action :", err);
    alert("Erreur lors de la suppression de l'action");
  }
}
</script>

<style scoped>
.bg-grey-darken-4 {
  background-color: #242424 !important;
}
.text-capitalize {
  text-transform: capitalize;
}
</style>
