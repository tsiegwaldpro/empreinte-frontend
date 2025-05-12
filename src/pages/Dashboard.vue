<template>
  <v-container fluid class="dashboard-view py-6">
    <!-- Ligne du haut : Résumés -->
    <v-col cols="12" md="12" class="mb-6">
      <v-card elevation="2" class="pa-4">
        <v-card-title class="text-h6 font-weight-bold">
          🛠 Recommandations
        </v-card-title>

        <v-card-subtitle
          class="text-body-2 text-grey-lighten-1"
          v-if="audit && audit.url"
        >
          pour le site :
          <a :href="audit.url" target="_blank" rel="noopener noreferrer">
            {{ audit.url }}
          </a>
        </v-card-subtitle>

        <v-card-text
          class="text-caption text-grey-lighten-1"
          v-if="audit && audit.createdAt"
        >
          Audit réalisé le {{ formatDate(audit.createdAt) }}
        </v-card-text>
      </v-card>
    </v-col>

    <v-row dense class="mb-6" align="stretch" v-if="audit">
      <v-col cols="12" md="3" class="d-flex">
        <ScoreList
          :performance="audit.performance"
          :accessibility="audit.accessibility"
          :bestPractices="audit.bestPractices"
          :seo="audit.seo"
          :referenceScores="referenceScores"
        />
      </v-col>

      <v-col cols="12" md="3" class="d-flex">
        <Footprint :empreinte="audit.empreinte" />
      </v-col>

      <v-col cols="12" md="3" class="d-flex">
        <FiltersAndCriticity
          :groups="groupNames"
          :groupCounts="groupCounts"
          :impactCounts="impactCounts"
          :levels="impactLevels"
          :selectedGroup="selectedGroup"
          :selectedImpact="selectedImpact"
          @update:selectedGroup="selectedGroup = $event"
          @update:selectedImpact="selectedImpact = $event"
        />
      </v-col>

      <v-col cols="12" md="3" class="d-flex">
        <ToolFootprint />
      </v-col>
    </v-row>

    <!-- Ligne du bas : recommandations et historique -->
    <v-row dense v-if="audit">
      <!-- Zone recommandations -->
      <v-col cols="12" md="9">
        <CategorySummary :recommendations="allRecs" />

        <RecommendationGroup
          v-for="(recs, group) in groupedRecommandations"
          :key="group"
          v-show="!selectedGroup || selectedGroup === group"
          :group="group"
          :recs="recs"
          :selectedImpact="selectedImpact"
          @recoToggled="updateCounts"
        />
      </v-col>

      <!-- Zone outils -->
      <v-col cols="12" md="3">
        <AuditHistory
          :referenceAudit="referenceAudit"
          :pastAudits="pastAudits"
          :currentAuditId="audit?._id"
          :lastAuditId="history.at(-1)?._id"
          :isReloading="isReloading"
          @relaunch="relaunchAudit"
          @select="loadAudit"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import ScoreList from "@/components/dashboard/ScoreList.vue";
import Footprint from "@/components/dashboard/FootPrint.vue";
import FiltersAndCriticity from "@/components/dashboard/FiltersAndCriticity.vue";
import RecommendationGroup from "@/components/dashboard/RecommendationGroup.vue";
import ToolFootprint from "@/components/dashboard/ToolFootprint.vue";
import CategorySummary from "@/components/dashboard/CategorySummary.vue";
import AuditHistory from "@/components/dashboard/AuditHistory.vue";

import { useRecoStorage } from "@/composables/useRecoStorage";
const { getDoneIds } = useRecoStorage();

const route = useRoute();
const site = computed(() => route.query.site || "default");

const audit = ref(null);
const history = ref([]);
const selectedGroup = ref(null);
const selectedImpact = ref(null);
const isReloading = ref(false);
const referenceScores = ref(null);
const allRecs = ref([]);

watch(audit, (val) => {
  if (val?.recommandations && Array.isArray(val.recommandations)) {
    allRecs.value = val.recommandations;
  } else {
    allRecs.value = [];
  }
});

const referenceAudit = computed(() => {
  return history.value.length ? history.value.at(-1) : null;
});

const pastAudits = computed(() => {
  if (!referenceAudit.value) return [];
  return history.value.filter((a) => a._id !== referenceAudit.value._id);
});

const impactLevels = [
  { icon: "💥", label: "Critique" },
  { icon: "⚠️", label: "Moyenne" },
  { icon: "🟢", label: "Faible" },
];

const formatDate = (iso) => {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const groupedRecommandations = computed(() => {
  if (!audit.value?.recommandations) return {};
  const grouped = {};
  for (const rec of audit.value.recommandations) {
    if (!grouped[rec.group]) grouped[rec.group] = [];
    grouped[rec.group].push(rec);
  }
  return grouped;
});

const relaunchAudit = async () => {
  if (!audit.value?.url) return;
  isReloading.value = true;

  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "http://localhost:3000/api/audit",
      { url: audit.value.url },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const auditWithDate = {
      ...res.data,
      createdAt: new Date().toISOString(),
    };

    history.value.push(auditWithDate);
    audit.value = auditWithDate;

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error("Erreur lors du nouvel audit :", err);
  } finally {
    isReloading.value = false;
  }
};

const groupNames = computed(() => Object.keys(groupedRecommandations.value));

const groupCounts = computed(() => {
  const counts = {};
  for (const [group, recs] of Object.entries(groupedRecommandations.value)) {
    const doneIds = getDoneIds(group);
    const active = recs.filter((r) => !doneIds.has(r.id));
    if (active.length > 0) counts[group] = active.length;
  }
  return counts;
});

const impactCounts = computed(() => {
  const counts = { "💥": 0, "⚠️": 0, "🟢": 0 };
  for (const [group, recs] of Object.entries(groupedRecommandations.value)) {
    const doneIds = getDoneIds(group);
    for (const rec of recs) {
      if (!doneIds.has(rec.id) && rec.impactLevel in counts) {
        counts[rec.impactLevel] += 1;
      }
    }
  }
  return counts;
});

const loadAudit = (a) => {
  audit.value = a;
};

const filteredHistory = computed(() => {
  if (!audit.value?.url) return [];
  return history.value.filter(
    (a) => a.url === audit.value.url && a._id !== audit.value._id
  );
});

const fetchReferenceAudit = async () => {
  try {
    const token = localStorage.getItem("token");
    const siteParam = encodeURIComponent(
      site.value.toLowerCase().replace(/\/+\$/, "")
    );
    const res = await axios.get(
      `http://localhost:3000/api/audit/reference?site=${siteParam}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    referenceScores.value = {
      performance: res.data.performance,
      accessibility: res.data.accessibility,
      bestPractices: res.data.bestPractices,
      seo: res.data.seo,
    };
  } catch (err) {
    console.error("Erreur référence :", err);
  }
};

const fetchAuditData = async () => {
  try {
    const token = localStorage.getItem("token");
    const siteParam = encodeURIComponent(
      site.value.replace(/\/+\$/, "").toLowerCase()
    );

    const res = await axios.get(
      `http://localhost:3000/api/audit/history?site=${siteParam}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    history.value = res.data.reverse();
    audit.value = history.value.at(-1) || null;

    await fetchReferenceAudit();

    if (!audit.value) {
      const local = localStorage.getItem("lastAudit");
      if (local) {
        audit.value = JSON.parse(local);
        console.log("⚠️ Audit chargé depuis localStorage (fallback)");
      }
    }
  } catch (err) {
    console.error("Erreur de récupération des audits", err);
  }
};

onMounted(() => {
  fetchAuditData();
});

watch(site, () => {
  fetchAuditData();
});
</script>
