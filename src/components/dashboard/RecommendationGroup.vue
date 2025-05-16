<template>
  <v-expansion-panels v-model="openPanel" flat multiple>
    <v-expansion-panel>
      <v-expansion-panel-title>
        {{ getGroupLabel(group) }} — {{ done }} / {{ total }}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <RecommendationCard
          v-for="(r, i) in filteredRecs"
          :key="i"
          :reco="r"
          :group="group"
          @toggleDone="onToggleDone"
        />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

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
  group: String, // 🔑 Clé du groupe (ex: "best-practices")
  recs: Array, // ✅ Liste des recos du groupe
  selectedImpact: String, // 🎯 Criticité filtrée (facultative)
});
const emit = defineEmits(["recoToggled"]);

const { getDoneIds } = useRecoStorage();

// Panel accordéon
const openPanel = ref([0]);
const site =
  new URLSearchParams(window.location.search).get("site") || "default";
const localKey = `group-open-${site}-${props.group}`;
onMounted(() => {
  if (localStorage.getItem(localKey) === "false") openPanel.value = [];
});
watch(openPanel, (val) => {
  localStorage.setItem(localKey, val.length ? "true" : "false");
});

// Filtrage des recos
const filteredRecs = computed(() =>
  !props.selectedImpact
    ? props.recs
    : props.recs.filter((r) => r.impactLevel === props.selectedImpact)
);

const total = computed(() => props.recs.length);
const done = computed(() => getDoneIds(props.group).value.size);

function onToggleDone() {
  emit("recoToggled");
}
</script>
