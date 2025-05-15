<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-4">🌐 Vos sites audités</h1>

    <section class="mb-10">
      <AuditForm />
    </section>

    <AuditStats
      v-if="sites.length"
      :total-audits="totalAudits"
      :total-sites="totalSites"
      :latest-audit-date="latestAuditDate"
    />

    <EmptyState v-if="!sites.length" />
    <SiteList v-else :sites="sites" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/api";

import AuditForm from "@/components/dashboard/AuditForm.vue";
import AuditStats from "@/components/dashboard/AuditStats.vue";
import SiteList from "@/components/dashboard/SiteList.vue";
import EmptyState from "@/components/dashboard/EmptyState.vue";

const sites = ref([]);
const totalAudits = ref(0);
const totalSites = ref(0);
const latestAuditDate = ref("-");

const router = useRouter();

onMounted(async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const resGrouped = await api.get("/grouped", { headers });
    sites.value = resGrouped.data;
    totalSites.value = sites.value.length;
    totalAudits.value = sites.value.reduce((acc, s) => acc + s.count, 0);

    const resAll = await api.get("/history", { headers });
    const audits = resAll.data;
    if (audits.length > 0) {
      const latest = new Date(audits[0].createdAt);
      latestAuditDate.value = latest.toLocaleDateString();
    }
  } catch (err) {
    console.error("Erreur lors du chargement des données dashboard :", err);
  }
});
</script>
