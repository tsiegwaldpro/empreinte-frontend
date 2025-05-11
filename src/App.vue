<template>
  <v-app>
    <v-main>
      <v-container class="fill-height d-flex justify-center align-center">
        <v-card class="pa-6" elevation="8" max-width="400">
          <v-card-title class="text-h5"
            >🎉 Vuetify est bien installé !</v-card-title
          >
          <v-card-text>
            Ceci est une carte Vuetify avec un bouton de test.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="counter++">
              Clique-moi ({{ counter }})
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      counter: 0,
    };
  },
};
</script>

<style>
/* Petite amélioration visuelle globale */
body {
  margin: 0;
  font-family: "Roboto", sans-serif;
}
</style>
