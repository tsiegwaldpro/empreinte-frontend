<template>
  <v-row class="mb-6">
    <v-col cols="12" md="4">
      <v-card class="pa-4" elevation="1">
        <div class="text-h6">{{ totalAudits }}</div>
        <div class="text-caption text-grey">Audits réalisés</div>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card class="pa-4" elevation="1">
        <div class="text-h6">{{ totalSites }}</div>
        <div class="text-caption text-grey">Sites différents</div>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card class="pa-4" elevation="1">
        <div class="text-h6">{{ latestAuditDate }}</div>
        <div class="text-caption text-grey">Dernier audit</div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  totalAudits: Number,
  totalSites: Number,
  latestAuditDate: String,
});
</script>
