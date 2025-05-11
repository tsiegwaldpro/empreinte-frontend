<template>
  <v-card class="footprint-card" elevation="2">
    <v-card-title class="text-subtitle-1 font-weight-bold">
      🌿 Empreinte environnementale
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="12" sm="4" class="text-center">
          <div class="icon text-h3 mb-1">🌍</div>
          <div class="text-caption text-grey-lighten-1">Carbone</div>
          <div class="text-h6">{{ empreinte.gesPerVisit }}</div>
        </v-col>

        <v-col cols="12" sm="4" class="text-center">
          <div class="icon text-h3 mb-1">⚡</div>
          <div class="text-caption text-grey-lighten-1">Énergie</div>
          <div class="text-h6">{{ empreinte.energyPerVisit }}</div>
        </v-col>

        <v-col cols="12" sm="4" class="text-center">
          <div class="icon text-h3 mb-1">💧</div>
          <div class="text-caption text-grey-lighten-1">Eau</div>
          <div class="text-h6">{{ empreinte.waterPerVisit }}</div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-subtitle class="text-center text-grey text-caption">
      Estimation par visite
    </v-card-subtitle>
  </v-card>
</template>

<script setup>
defineProps({
  empreinte: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.footprint-card {
  background-color: #1e1e1e;
  border-radius: 12px;
}
</style>
