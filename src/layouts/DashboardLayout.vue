<template>
  <div class="d-flex">
    <!-- Barre latérale -->
    <v-navigation-drawer app permanent>
      <v-list nav dense>
        <v-list-item
          v-for="item in menu"
          :key="item.name"
          :to="item.to"
          router
          active-class="bg-primary text-white"
        >
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Contenu des sous-vues -->
    <v-main class="pa-6">
      <router-view :key="$route.fullPath" />
    </v-main>
  </div>
</template>

<script setup>
const menu = [
  { name: "Dashboard", label: "📊 Dashboard", to: "/dashboard" },
  { name: "History", label: "🕘 Historique", to: "/dashboard/history" },
];
</script>
