<template>
  <v-card class="fill-height w-100 d-flex flex-column" elevation="2">
    <v-card-title class="text-subtitle-1 font-weight-bold">
      🌿 Empreinte environnementale
    </v-card-title>

    <v-card-text>
      <v-row dense class="mb-2">
        <v-col cols="6">
          <v-card class="pa-3 text-white text-center" elevation="1">
            <div class="text-subtitle-2 font-weight-medium">⚡ Énergie</div>
            <div class="text-h6 font-mono mt-2">
              {{ empreinte.energyPerVisit }}
            </div>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card class="pa-3 text-white text-center" elevation="1">
            <div class="text-subtitle-2 font-weight-medium">💧 Eau</div>
            <div class="text-h6 font-mono mt-2">
              {{ empreinte.waterPerVisit }}
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12">
          <v-card class="pa-3 text-white text-center" elevation="1">
            <div class="text-subtitle-2 font-weight-medium">🌍 Carbone</div>
            <div class="text-h6 font-mono mt-2">
              {{ empreinte.gesPerVisit }}
            </div>
          </v-card>
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
