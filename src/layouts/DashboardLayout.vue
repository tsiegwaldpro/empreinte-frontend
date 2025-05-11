<template>
  <v-app>
    <Header />
    <v-navigation-drawer app permanent>
      <v-list dense nav>
        <v-list-item-title class="text-h6 text-center my-4"
          >🌿 Empreinte</v-list-item-title
        >
        <v-divider class="mb-2" />
        <v-list-item link to="/dashboard">
          <v-list-item-title>Tableau de bord</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/audit">
          <v-list-item-title>Lancer un audit</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/historique">
          <v-list-item-title>Historique</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
</script>
