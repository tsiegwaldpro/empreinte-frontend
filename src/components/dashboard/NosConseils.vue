<template>
  <div class="advice-section">
    <h3 class="text-h5 font-weight-bold mb-6 mt-8">
      💡 Nos conseils pour aller plus loin
    </h3>
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="4"
        v-for="(reco, idx) in recs"
        :key="`adv-${idx}`"
      >
        <v-card
          class="mb-4 pa-3 bg-grey-darken-3 rounded"
          :class="{ 'advice-done': isAdviceDone(reco) }"
        >
          <div class="d-flex align-center mb-2">
            <v-checkbox
              density="compact"
              hide-details
              color="primary"
              class="me-2"
              :model-value="isAdviceDone(reco)"
              @change="() => toggleAdvice(reco)"
            />
            <v-chip
              color="grey-lighten-2"
              text="grey-darken-4"
              size="small"
              class="font-weight-bold"
              style="letter-spacing: 0.02em"
            >
              {{ getGroupLabel(reco.group) }}
            </v-chip>
          </div>
          <div class="text-body-1 font-weight-bold mb-2">
            {{ reco.title }}
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
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRecoStorage } from "@/composables/useRecoStorage";

// Libellés catégories
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

// Pour le done par conseil : on stocke par groupe "advice"
const props = defineProps({
  recs: { type: Array, required: true },
});

const { isRecoDone, toggleReco } = useRecoStorage();
const ADVICE_GROUP = "advice";
const isAdviceDone = (reco) => isRecoDone(ADVICE_GROUP, reco.id);
const toggleAdvice = (reco) => toggleReco(ADVICE_GROUP, reco.id);
</script>

<style scoped>
.advice-code {
  background: #222;
  color: #aaa;
  border-radius: 3px;
  padding: 2px 6px;
  font-size: 0.95em;
}
.advice-done {
  opacity: 0.5;
  filter: grayscale(0.5);
}
</style>
