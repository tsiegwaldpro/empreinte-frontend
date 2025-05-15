<template>
  <h2 class="text-h5 font-weight-bold mb-6">👤 Gestion des utilisateurs</h2>

  <v-card class="mb-6" color="indigo-darken-4" variant="flat">
    <v-card-title class="text-white">🎟️ Codes Premium générés</v-card-title>
    <v-card-text class="text-white">
      <PremiumCodeTable />
    </v-card-text>
  </v-card>
</template>

<script setup>
import PremiumCodeTable from "@/components/admin/PremiumCodeTable.vue";
</script>
