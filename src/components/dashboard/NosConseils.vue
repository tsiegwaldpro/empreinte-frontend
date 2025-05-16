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
          <div class="text-grey-lighten-1 mb-1">
            <em>{{ reco.description }}</em>
          </div>
          <div v-if="reco.advice && reco.advice.length">
            <h4 class="text-subtitle-2 mb-1">💡 Conseils</h4>
            <ul class="pl-4 mb-0">
              <li v-for="(adv, a) in reco.advice" :key="a">
                <strong>{{ adv.label }}</strong>
                <span v-if="adv.code">
                  <br />
                  <code class="advice-code">{{ adv.code }}</code>
                </span>
              </li>
            </ul>
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

const props = defineProps({
  recs: { type: Array, required: true },
});

// Libellés groupes (catégories)
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

// Liste unique des groupes présents dans les conseils
const groupOptions = computed(() => {
  // Prend toutes les catégories présentes dans les recos, triées
  const keys = [
    ...new Set(props.recs.map((r) => normalizeGroup(r.group))),
  ].filter((k) => k && k !== "general");
  return keys
    .map((key) => ({
      key,
      label: getGroupLabel(key),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
});

// Filtre actif
const selectedGroup = ref(null);

// Liste filtrée selon la sélection
const filteredRecs = computed(() =>
  selectedGroup.value
    ? props.recs.filter((r) => normalizeGroup(r.group) === selectedGroup.value)
    : props.recs
);

// Pagination
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

// Reset page si la liste change ou filtre change
watch(
  () => [filteredRecs.value.length, selectedGroup.value],
  () => {
    currentPage.value = 1;
  }
);
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
</style>
