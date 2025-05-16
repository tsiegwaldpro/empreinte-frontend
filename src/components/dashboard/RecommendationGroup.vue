<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRecoStorage } from "@/composables/useRecoStorage";
import RecommendationCard from "./RecommendationCard.vue";

// Libellés groupes
const groupLabels = {
  performance: "Performances",
  "best-practices": "Bonnes pratiques",
  accessibility: "Accessibilité",
  seo: "SEO",
  general: "Autres",
};
const normalizeGroup = (key) =>
  key?.toLowerCase().replace(/\s+/g, "-") || "general";
const getGroupLabel = (key) => groupLabels[normalizeGroup(key)] || key;

// Props
const props = defineProps({
  group: String,
  recs: Array,
  selectedImpact: String,
  auditId: String, // AJOUT ICI
});
const emit = defineEmits(["recoToggled"]);

const { getDoneIds } = useRecoStorage(props.auditId);

const openPanel = ref([0]);
const openPanelGeneral = ref([]);

const site =
  new URLSearchParams(window.location.search).get("site") || "default";
const localKey = `group-open-${site}-${props.group}`;
onMounted(() => {
  if (localStorage.getItem(localKey) === "false") openPanel.value = [];
});
watch(openPanel, (val) => {
  localStorage.setItem(localKey, val.length ? "true" : "false");
});

const actionableRecs = computed(() => {
  let base = props.recs.filter((r) => r.actions && r.actions.length > 0);
  if (props.selectedImpact) {
    base = base.filter((r) => r.impactLevel === props.selectedImpact);
  }
  return base;
});
const generalRecs = computed(() => {
  let base = props.recs.filter((r) => !r.actions || r.actions.length === 0);
  if (props.selectedImpact) {
    base = base.filter((r) => r.impactLevel === props.selectedImpact);
  }
  return base;
});

const actionableTotal = computed(() => actionableRecs.value.length);
const actionableDone = computed(() => {
  const doneIds = getDoneIds(props.group).value;
  return actionableRecs.value.filter((r) => doneIds.has(r.id)).length;
});

function onToggleDone() {
  emit("recoToggled");
}
</script>

<template>
  <div>
    <!-- Bloc RECOMMANDATIONS ACTIONNABLES -->
    <div v-if="actionableRecs.length">
      <h3 class="text-h6 mb-4">🛠 Recommandations actionnables</h3>
      <v-expansion-panels v-model="openPanel" flat multiple>
        <v-expansion-panel>
          <v-expansion-panel-title>
            {{ getGroupLabel(group) }} — {{ actionableDone }} /
            {{ actionableTotal }}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <RecommendationCard
              v-for="(r, i) in actionableRecs"
              :key="`a-${i}`"
              :reco="r"
              :group="group"
              :auditId="auditId"
              @toggleDone="onToggleDone"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div v-else class="text-grey-lighten-1 my-4">
      Aucune recommandation actionnable pour ce groupe.
    </div>

    <!-- Bloc CONSEILS GÉNÉRAUX / AUTRES RECOS -->
    <div v-if="generalRecs.length" class="mt-8">
      <h3 class="text-h6 mb-4">💡 Conseils généraux / Autres recos</h3>
      <v-expansion-panels v-model="openPanelGeneral" flat multiple>
        <v-expansion-panel>
          <v-expansion-panel-title>
            {{ getGroupLabel(group) }}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <RecommendationCard
              v-for="(r, i) in generalRecs"
              :key="`g-${i}`"
              :reco="r"
              :group="group"
              :auditId="auditId"
              @toggleDone="onToggleDone"
            >
              <template #default>
                <v-chip color="grey-darken-2" size="small" class="ml-2">
                  Pas encore actionnable
                </v-chip>
              </template>
            </RecommendationCard>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>
