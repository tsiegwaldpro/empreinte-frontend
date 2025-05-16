<template>
  <v-card color="grey-darken-3" class="pa-4" flat>
    <v-checkbox
      v-model="onlyWithoutActions"
      label="Afficher uniquement celles sans actions"
      class="mb-4 text-white"
    />

    <v-expansion-panels v-model="activePanel" multiple>
      <v-expansion-panel
        v-for="reco in uniqueFilteredRecos"
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
              <v-btn
                icon
                color="primary"
                @click.stop="openAddActionForm(reco)"
                title="Ajouter une action"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>

            <!-- Affichage récapitulatif des actions -->
            <ActionSummary
              v-if="reco.actions?.length"
              :actions="reco.actions"
              @edit="editAction(reco, $event)"
              @delete="deleteAction(reco.id, $event)"
            />
          </div>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <!-- Détails des actions -->
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

    <!-- Modal ajout action inchangé -->
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
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import ActionSummary from "@/components/admin/ActionSummary.vue";

const recos = ref([]);
const onlyWithoutActions = ref(false);
const activePanel = ref([]);

const showAddActionForm = ref(false);
const currentReco = ref(null);
const newActionLabel = ref("");
const newActionCode = ref("");

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

// Computed pour filtrer et enlever les doublons
const filteredRecos = computed(() =>
  onlyWithoutActions.value
    ? recos.value.filter((r) => !r.actions?.length)
    : recos.value
);

const uniqueFilteredRecos = computed(() => {
  const map = new Map();
  filteredRecos.value.forEach((r) => {
    if (!map.has(r.id)) map.set(r.id, r);
  });
  return Array.from(map.values());
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
</style>
