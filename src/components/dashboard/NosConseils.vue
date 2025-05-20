<template>
  <div class="advice-section">
    <h3 class="text-h5 font-weight-bold mb-6 mt-8">
      💡 Nos conseils pour aller plus loin
    </h3>

    <!-- Filtres par catégorie (group) -->
    <div class="mb-4 d-flex flex-wrap gap-2">
      <v-chip
        :color="selectedGroup === null ? 'primary' : 'grey-darken-3'"
        class="text-white"
        variant="flat"
        size="small"
        @click="selectedGroup = null"
      >
        Toutes
      </v-chip>
      <v-chip
        v-for="g in groupOptions"
        :key="g.key"
        :color="selectedGroup === g.key ? 'primary' : 'grey-darken-3'"
        class="text-white"
        variant="flat"
        size="small"
        @click="selectedGroup = g.key"
      >
        {{ g.label }}
      </v-chip>
    </div>

    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="4"
        v-for="(reco, idx) in pagedRecs"
        :key="`adv-${idx}`"
      >
        <v-card class="mb-4 pa-3 bg-grey-darken-3 advice-card rounded">
          <div class="d-flex justify-space-between align-center mb-2">
            <div class="text-body-1 font-weight-bold">
              {{ reco.title }}
            </div>
            <div class="advice-cat">
              {{ getGroupLabel(reco.group) }}
            </div>
          </div>
          <!-- Description AVEC lien "En savoir plus" à la ligne -->
          <div class="text-grey-lighten-1 mb-1">
            <em v-html="formatDescriptionWithLearnMore(reco.description)"></em>
          </div>
          <div v-if="reco.advice && reco.advice.length">
            <h4 class="text-subtitle-2 mb-1">💡 Conseils</h4>
            <!-- Groupement des conseils par label -->
            <div
              v-for="(group, gIdx) in groupByLabel(reco.advice)"
              :key="gIdx"
              class="mb-2"
            >
              <strong>{{ group.label }}</strong>
              <ul class="pl-4 mb-0">
                <li v-for="(code, cIdx) in group.codes" :key="cIdx">
                  <code class="advice-code">{{ code }}</code>
                </li>
              </ul>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Pagination simple : flèches -->
    <div class="d-flex justify-center align-center mt-2" v-if="pageCount > 1">
      <v-btn
        icon
        variant="text"
        :disabled="currentPage === 1"
        @click="currentPage--"
        class="mx-1"
        aria-label="Page précédente"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <span class="mx-2" style="min-width: 38px">
        {{ currentPage }} / {{ pageCount }}
      </span>
      <v-btn
        icon
        variant="text"
        :disabled="currentPage === pageCount"
        @click="currentPage++"
        class="mx-1"
        aria-label="Page suivante"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

// Props et console log pour les recos sans conseils
const props = defineProps({ recs: { type: Array, required: true } });
const recoSansConseil = props.recs.filter((r) => !r.advice || !r.advice.length);
console.log(
  "%cReco sans conseils (id + title) :",
  "color: orange; font-weight: bold;",
  recoSansConseil.map((r) => ({ id: r.id, title: r.title, group: r.group }))
);

/**
 * Regroupe les conseils par label et collecte leurs codes
 */
function groupByLabel(adviceArray) {
  return adviceArray.reduce((acc, adv) => {
    const existing = acc.find((g) => g.label === adv.label);
    if (existing) {
      existing.codes.push(stripLine(adv.code));
    } else {
      acc.push({ label: adv.label, codes: [stripLine(adv.code)] });
    }
    return acc;
  }, []);
}

/**
 * Supprime le bullet et éventuels retours à la ligne du code conseil
 */
function stripLine(code) {
  return code.replace(/^•\s*/, "").trim();
}

// Filtre et pagination
const selectedGroup = ref(null);
const normalizeGroup = (key) =>
  key?.toLowerCase().replace(/\s+/g, "-") || "general";
const groupLabels = {
  performance: "Performances",
  "best-practices": "Bonnes pratiques",
  accessibility: "Accessibilité",
  seo: "SEO",
  general: "Autres",
};
const getGroupLabel = (key) => groupLabels[normalizeGroup(key)] || key;

const groupOptions = computed(() => {
  const keys = [
    ...new Set(props.recs.map((r) => normalizeGroup(r.group))),
  ].filter((k) => k && k !== "general");
  return keys
    .map((key) => ({ key, label: getGroupLabel(key) }))
    .sort((a, b) => a.label.localeCompare(b.label));
});

const filteredRecs = computed(() =>
  selectedGroup.value
    ? props.recs.filter((r) => normalizeGroup(r.group) === selectedGroup.value)
    : props.recs
);
const perPage = 6;
const currentPage = ref(1);
const pageCount = computed(() =>
  Math.ceil(filteredRecs.value.length / perPage)
);
const pagedRecs = computed(() =>
  filteredRecs.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  )
);

watch(
  () => [filteredRecs.value.length, selectedGroup.value],
  () => {
    currentPage.value = 1;
  }
);

/**
 * Format Markdown links comme précédemment
 */
function formatDescriptionWithLearnMore(description) {
  if (!description) return "";
  return description.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
    '<br /><a href="$2" target="_blank" rel="noopener noreferrer" class="advice-link">En savoir plus</a>'
  );
}
</script>

<style scoped>
.advice-section {
  width: 100%;
}
.advice-card {
  min-height: 210px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  border: 1px solid #353535;
}
.advice-code {
  background: #222;
  color: #aaa;
  border-radius: 3px;
  padding: 2px 6px;
  font-size: 0.95em;
}
.advice-cat {
  background: #334152;
  color: #fff;
  font-size: 0.92em;
  padding: 2px 12px;
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-left: 6px;
  opacity: 0.99;
  border: 1.5px solid #2b3642;
}
.advice-link {
  color: #57bbfa;
  text-decoration: underline;
  word-break: break-all;
  transition: color 0.15s;
  font-weight: 600;
  margin-top: 2px;
  display: inline-block;
}
.advice-link:hover {
  color: #90e1fb;
}
</style>
