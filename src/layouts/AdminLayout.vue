<template>
  <div class="d-flex">
    <!-- ✅ Barre latérale admin -->
    <v-navigation-drawer app permanent color="#26474E" class="text-white">
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

    <!-- ✅ Contenu des sous-vues admin -->
    <v-main class="pa-6">
      <router-view :key="$route.fullPath" />
    </v-main>
  </div>
</template>

<script setup>
const menu = [
  { name: "AdminUsers", label: "👤 Utilisateurs", to: "/admin/users" },
  {
    name: "AdminRecommendations",
    label: "🛠️ Recommandations",
    to: "/admin/recommandations",
  },
];
</script>
