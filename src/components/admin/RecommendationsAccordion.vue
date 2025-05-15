<template>
  <v-card color="grey-darken-3" class="pa-4" flat>
    <v-checkbox
      v-model="onlyWithoutActions"
      label="Afficher uniquement celles sans actions"
      class="mb-4 text-white"
    />

    <v-expansion-panels v-model="activePanel" multiple>
      <v-expansion-panel
        v-for="reco in filteredRecos"
        :key="reco.id"
        class="bg-grey-darken-4 text-white mb-2 rounded"
      >
        <!-- Titre du panneau avec résumé des actions -->
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
            <!-- Résumé des actions dans l'en-tête -->
            <div
              v-if="reco.actions?.length"
              class="mt-2 d-flex flex-wrap gap-2"
            >
              <v-chip
                v-for="(action, idx) in reco.actions"
                :key="idx"
                small
                class="text-white"
              >
                {{ action.label }}
                <v-icon
                  right
                  small
                  class="ml-1"
                  @click.stop="editAction(reco, idx)"
                  title="Modifier l'action"
                  >mdi-pencil</v-icon
                >
                <v-icon
                  right
                  small
                  class="ml-1"
                  @click.stop="deleteAction(reco.id, idx)"
                  title="Supprimer l'action"
                  >mdi-delete</v-icon
                >
              </v-chip>
            </div>
          </div>
        </v-expansion-panel-title>

        <!-- Détails des actions dans la partie dépliée -->
        <v-expansion-panel-text>
          <div
            v-if="reco.actions?.length"
            class="d-flex flex-column gap-4 mt-4"
          >
            <div
              v-for="(action, idx) in reco.actions"
              :key="idx"
              class="pa-4 bg-grey-darken-3 rounded d-flex flex-column"
            >
              <div class="d-flex justify-space-between align-start mb-2">
                <h4 class="text-subtitle-1 font-weight-bold mb-1 text-white">
                  {{ action.label }}
                </h4>
              </div>

              <div
                v-if="action.code"
                class="text-grey-lighten-2 text-caption"
                style="
                  white-space: pre-wrap;
                  background-color: #1f1f1f;
                  padding: 12px;
                  border-radius: 4px;
                "
              >
                {{ action.code }}
              </div>
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- ➕ Modal ajout action -->
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

const recos = ref([]);
const onlyWithoutActions = ref(false);
const activePanel = ref([]);

const showAddActionForm = ref(false);
const currentReco = ref(null);
const newActionLabel = ref("");
const newActionCode = ref("");

// 🔄 Charger les recommandations
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

function editAction(reco, idx) {
  currentReco.value = reco;
  const action = reco.actions[idx];
  newActionLabel.value = action.label;
  newActionCode.value = action.code;
  showAddActionForm.value = true;
}

// ✅ Filtrage si checkbox cochée
const filteredRecos = computed(() =>
  onlyWithoutActions.value
    ? recos.value.filter((r) => !r.actions || r.actions.length === 0)
    : recos.value
);

// ➕ Formulaire ajout action
function openAddActionForm(reco) {
  currentReco.value = reco;
  newActionLabel.value = "";
  newActionCode.value = "";
  showAddActionForm.value = true;
}

async function submitNewAction() {
  if (!newActionLabel.value.trim()) {
    alert("Label requis");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) return;

  const actionToAdd = {
    label: newActionLabel.value.trim(),
    code: newActionCode.value.trim() || "",
  };

  try {
    const res = await axios.post(
      `/api/admin/recommandations/${currentReco.value.id}/actions`,
      actionToAdd,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const index = recos.value.findIndex((r) => r.id === res.data.id);
    if (index !== -1) recos.value[index] = res.data;
    showAddActionForm.value = false;
  } catch (err) {
    console.error("Erreur ajout action :", err);
    alert("Erreur lors de l'ajout de l'action");
  }
}

// ❌ Suppression d'une action
async function deleteAction(recoId, actionIndex) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Non authentifié");

    await axios.delete(
      `/api/admin/recommandations/${recoId}/actions/${actionIndex}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
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
