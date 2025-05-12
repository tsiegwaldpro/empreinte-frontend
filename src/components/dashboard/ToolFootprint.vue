<template>
  <v-card class="fill-height w-100 d-flex flex-column" elevation="2">
    <v-card-title class="text-subtitle-1 font-weight-bold">
      🛠 Impact de l’outil
    </v-card-title>

    <v-card-text class="mt-2">
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-card class="pa-3 text-white text-center" elevation="1">
            <div class="text-subtitle-2 font-weight-medium">⚡ Énergie</div>
            <div class="text-h6 font-mono mt-2">0.3 Wh</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card class="pa-3 text-white text-center" elevation="1">
            <div class="text-subtitle-2 font-weight-medium">💧 Eau</div>
            <div class="text-h6 font-mono mt-2">0.005 cl</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="12">
          <v-card class="pa-3 text-white text-center" elevation="1">
            <div class="text-subtitle-2 font-weight-medium">🌍 Carbone</div>
            <div class="text-h6 font-mono mt-2">0.012 gCO2e</div>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-subtitle class="text-center text-grey text-caption mt-2">
      Estimations par audit sur serveur cloud
    </v-card-subtitle>
  </v-card>
</template>

<script setup>
// aucun props ici
</script>
