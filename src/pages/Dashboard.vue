<template>
  <v-container fluid class="dashboard-view py-6">
    <v-col cols="12" md="12" class="mb-6">
      <v-card elevation="2" class="pa-4">
        <v-card-title class="text-h6 font-weight-bold">
          🛠 Recommandations
        </v-card-title>
        <v-card-subtitle
          class="text-body-2 text-grey-lighten-1"
          v-if="audit?.url"
        >
          pour le site :
          <a :href="audit.url" target="_blank" rel="noopener noreferrer">
            {{ audit.url }}
          </a>
        </v-card-subtitle>
        <v-card-text
          class="text-caption text-grey-lighten-1"
          v-if="audit?.createdAt"
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
        <FootPrint :empreinte="audit.empreinte" />
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

    <v-row dense v-if="audit">
      <v-col cols="12" md="9">
        <CategorySummary :recommendations="allRecs" />
        <RecommendationGroup
          v-for="{ key, label } in groupNames"
          :key="key"
          v-show="!selectedGroup || selectedGroup === key"
          :group="key"
          :recs="groupedRecommandations[key]"
          :selectedImpact="selectedImpact"
          @recoToggled="() => refreshCategorySummary++"
        />
      </v-col>
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
import api from "@/api";

import ScoreList from "@/components/dashboard/ScoreList.vue";
import FootPrint from "@/components/dashboard/FootPrint.vue";
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
const refreshCategorySummary = ref(0);

const groupLabels = {
  performance: "Performances",
  "best-practices": "Bonnes pratiques",
  accessibility: "Accessibilité",
  seo: "SEO",
  general: "Autres",
};

const normalizeKey = (key) =>
  key?.toLowerCase().replace(/\s+/g, "-") || "general";
const getGroupLabel = (key) => groupLabels[normalizeKey(key)] || key;

watch(audit, (val) => {
  allRecs.value = Array.isArray(val?.recommandations)
    ? val.recommandations
    : [];

  // === AJOUTE CE BLOC LOG ICI ===
  if (val?.recommandations) {
    console.log("=== LISTE DES RECOMMANDATIONS (audit) ===");
    val.recommandations.forEach((rec, idx) => {
      console.log(`#${idx + 1} - ${rec.id}`, rec.title, rec, rec.actions || []);
    });
  }
  // Si tu as accès à plus de données (raw lighthouse audits), tu peux en rajouter ici plus tard.
});
const referenceAudit = computed(() =>
  history.value.length ? history.value.at(-1) : null
);

const pastAudits = computed(() =>
  referenceAudit.value
    ? history.value.filter((a) => a._id !== referenceAudit.value._id)
    : []
);

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
  const grouped = {};
  for (const rec of audit.value?.recommandations || []) {
    const key = normalizeKey(rec.group);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(rec);
  }
  return grouped;
});

const groupNames = computed(() =>
  Object.keys(groupedRecommandations.value).map((key) => ({
    key,
    label: getGroupLabel(key),
  }))
);

const groupCounts = computed(() => {
  const counts = {};
  for (const [group, recs] of Object.entries(groupedRecommandations.value)) {
    const doneIds = getDoneIds(group).value;
    const active = recs.filter((r) => !doneIds.has(r.id));
    if (active.length > 0) counts[group] = active.length;
  }
  return counts;
});

const impactCounts = computed(() => {
  const counts = { "💥": 0, "⚠️": 0, "🟢": 0 };
  for (const [group, recs] of Object.entries(groupedRecommandations.value)) {
    const doneIds = getDoneIds(group).value;
    for (const rec of recs) {
      if (!doneIds.has(rec.id) && rec.impactLevel in counts) {
        counts[rec.impactLevel] += 1;
      }
    }
  }
  return counts;
});

const relaunchAudit = async () => {
  if (!audit.value?.url) return;
  isReloading.value = true;
  try {
    const token = localStorage.getItem("token");
    const res = await api.post(
      "/audit",
      { url: audit.value.url },
      { headers: { Authorization: `Bearer ${token}` } }
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

const loadAuditById = async (auditId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Non authentifié");

    const res = await api.get(`/audit/${auditId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    audit.value = res.data;
  } catch (err) {
    console.error("Erreur chargement audit :", err);
  }
};

const loadAudit = (a) => {
  if (a?._id) {
    loadAuditById(a._id);
  } else {
    audit.value = a;
  }
};

const filteredHistory = computed(() =>
  audit.value?.url
    ? history.value.filter(
        (a) => a.url === audit.value.url && a._id !== audit.value._id
      )
    : []
);

const fetchReferenceAudit = async () => {
  try {
    const token = localStorage.getItem("token");
    const siteParam = encodeURIComponent(
      site.value.toLowerCase().replace(/\/+\$/, "")
    );
    const res = await api.get(`/audit/reference?site=${siteParam}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
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
    const res = await api.get(`/audit/history?site=${siteParam}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    history.value = res.data;
    audit.value = history.value.at(-1) || null;
    await fetchReferenceAudit();
    if (!audit.value) {
      const local = localStorage.getItem("lastAudit");
      if (local) {
        audit.value = JSON.parse(local);
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
