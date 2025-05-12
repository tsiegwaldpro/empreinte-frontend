<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-4">🌐 Vos sites audités</h1>

    <v-alert v-if="!sites.length" type="info" variant="tonal">
      Aucun audit trouvé pour l’instant.
    </v-alert>

    <v-list v-else two-line>
      <v-list-item
        v-for="site in sites"
        :key="site.url"
        @click="goToLastAudit(site.url)"
        class="mb-2 rounded"
        color="primary"
        style="cursor: pointer"
      >
        <v-list-item-title class="text-white">{{ site.url }}</v-list-item-title>
        <v-list-item-subtitle class="text-grey-lighten-1">
          {{ site.count }} audit(s)
        </v-list-item-subtitle>

        <v-list-item-action>
          <v-icon color="white">mdi-chevron-right</v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const sites = ref([]);
const router = useRouter();
onMounted(async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:3000/api/grouped", {
      headers: { Authorization: `Bearer ${token}` },
    });

    sites.value = res.data;
  } catch (err) {
    console.error("Erreur lors du chargement des sites audités :", err);
  }
});

const goToLastAudit = (url) => {
  router.push({ name: "DashboardAudit", query: { site: url } });
};
</script>
