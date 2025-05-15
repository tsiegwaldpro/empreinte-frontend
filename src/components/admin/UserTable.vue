<template>
  <div>
    <!-- 👥 Tableau des utilisateurs -->
    <v-card class="elevation-1">
      <v-card-title class="font-weight-bold">
        👥 Utilisateurs inscrits
      </v-card-title>

      <!-- 🌛️ Filtres par rôle -->
      <div class="mb-4 ps-4">
        <div class="text-subtitle-2 font-weight-medium mb-2">Rôle</div>
        <div class="d-flex gap-4">
          <v-checkbox
            v-model="filterFreemium"
            :true-value="true"
            :false-value="null"
            label="Freemium"
            density="compact"
            hide-details
          />
          <v-checkbox
            v-model="filterPremium"
            :true-value="true"
            :false-value="null"
            label="Premium"
            density="compact"
            hide-details
          />
          <v-checkbox
            v-model="filterAdmin"
            :true-value="true"
            :false-value="null"
            label="Admin"
            density="compact"
            hide-details
          />
        </div>
      </div>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="filteredUsers"
          item-value="_id"
          dense
        >
          <template #item.role="{ item }">
            <div class="d-flex flex-column">
              <v-chip
                :color="getRoleColor(item.role)"
                dark
                class="mb-1"
                style="width: fit-content"
              >
                {{ item.role }}
              </v-chip>
              <small
                v-if="item.role === 'premium' && item.planExpiresAt"
                class="text-caption text-grey"
              >
                Expire le {{ formatDate(item.planExpiresAt) }}
              </small>
            </div>
          </template>

          <template #item.lastLogin="{ item }">
            {{ formatDate(item.lastLogin) }}
          </template>

          <template #item.actions="{ item }">
            <v-btn
              color="primary"
              size="small"
              @click="goToUserDashboard(item._id)"
            >
              Voir ses audits
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import api from "@/api";

const users = ref([]);
const filterFreemium = ref(true);
const filterPremium = ref(true);
const filterAdmin = ref(false);
const router = useRouter();

const headers = [
  { title: "Prénom", key: "firstName" },
  { title: "Nom", key: "lastName" },
  { title: "Email", key: "email" },
  { title: "Rôle", key: "role" },
  { title: "Dernière connexion", key: "lastLogin" },
  { title: "Actions", key: "actions", sortable: false },
];

// Filtre les utilisateurs selon les rôles sélectionnés
const filteredUsers = computed(() => {
  return users.value.filter((u) => {
    const isFreemium = filterFreemium.value && u.role === "freemium";
    const isPremium = filterPremium.value && u.role === "premium";
    const isAdmin = filterAdmin.value && u.role === "admin";
    return isFreemium || isPremium || isAdmin;
  });
});

// Retourne la couleur à afficher selon le rôle
const getRoleColor = (role) => {
  switch (role) {
    case "admin":
      return "deep-purple-accent-4";
    case "premium":
      return "green";
    case "freemium":
    default:
      return "grey";
  }
};

// Formate une date en format local FR ou affiche "Jamais"
const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString("fr-FR") : "Jamais";
};

// Charge les utilisateurs depuis l'API au montage du composant
onMounted(async () => {
  try {
    const res = await api.get("/admin/users");
    // Gère si le retour est tableau direct ou objet avec clé users
    const data = res.data;
    users.value = Array.isArray(data) ? data : data.users || [];
  } catch (err) {
    console.error("Erreur chargement utilisateurs :", err);
  }
});

// Redirection vers la page dashboard avec le userId en query param
const goToUserDashboard = (userId) => {
  router.push(`/dashboard?user=${userId}`);
};
</script>
