<template>
  <v-container class="py-10 home-page text-white">
    <v-alert
      v-if="showBanner"
      type="success"
      variant="tonal"
      class="mb-6"
      border="start"
    >
      📩 Un email de confirmation t’a été envoyé. Clique sur le lien pour
      activer ton compte.
    </v-alert>

    <section class="text-center mb-10">
      <h1 class="text-h3 font-weight-bold mb-2">🌱 Empreinte</h1>
      <p class="text-subtitle-1 mb-1">
        L’audit qui mesure l’impact environnemental de votre site web.
      </p>
      <p class="text-body-2 text-grey-lighten-1">
        ⏱ En moins de 30 secondes, obtenez des recommandations concrètes.
      </p>
    </section>

    <v-form
      @submit.prevent="handleAudit"
      class="d-flex align-center justify-center gap-4 mb-4"
    >
      <v-text-field
        v-model="url"
        :disabled="loading"
        placeholder="Ex : thomassiegwald.fr"
        hide-details
        density="comfortable"
        class="w-50"
        variant="outlined"
        color="primary"
      />
      <v-btn
        :loading="loading"
        type="submit"
        color="primary"
        size="large"
        class="text-none"
      >
        🚀 Auditer mon site
      </v-btn>
    </v-form>

    <p v-if="error" class="text-red mb-10 text-center">{{ error }}</p>

    <section class="mb-10">
      <h2 class="text-h5 mb-2">Pourquoi l’éco-conception web ?</h2>
      <p>
        Le web consomme autant d’énergie que l’aviation civile. Chaque site,
        chaque page, chaque requête a un impact. En réduisant les ressources
        inutiles, on améliore à la fois la planète, l’accessibilité et la
        performance.
      </p>
    </section>

    <section class="mb-10">
      <h2 class="text-h5 mb-2">📊 Quelques chiffres clés</h2>
      <v-list density="compact">
        <v-list-item
          >🌐 4% des émissions mondiales de GES viennent du
          numérique</v-list-item
        >
        <v-list-item
          >📱 80% des données sont inutiles ou redondantes</v-list-item
        >
        <v-list-item
          >⚡ Un site optimisé peut consommer 5 à 10x moins
          d’énergie</v-list-item
        >
      </v-list>
    </section>

    <section class="mb-10">
      <h2 class="text-h5 mb-2">📌 Exemples de recommandations</h2>
      <v-list density="compact">
        <v-list-item>🖼 Convertir les images en format WebP</v-list-item>
        <v-list-item>⚙️ Supprimer les scripts inutilisés</v-list-item>
        <v-list-item
          >🎯 Ajouter des attributs <code>alt</code> pour
          l’accessibilité</v-list-item
        >
        <v-list-item>🌐 Réduire le nombre de requêtes HTTP</v-list-item>
      </v-list>
    </section>

    <section class="mb-10">
      <h2 class="text-h5 mb-2">💡 À propos du projet Empreinte</h2>
      <p>
        Empreinte est un projet open-source imaginé pour rendre l’éco-conception
        accessible à tous. Il vous permet d’auditer n’importe quel site web en
        quelques secondes, avec des recommandations concrètes, compréhensibles
        et actionnables.
      </p>
      <p>
        Construit avec Vue.js et Node.js, Empreinte s’inscrit dans une volonté
        de réduire l’impact du numérique en informant et en formant les
        développeurs, designers et responsables de site à adopter des pratiques
        plus durables.
      </p>
    </section>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const url = ref("https://restaurantaucoqdor.com/");
const loading = ref(false);
const error = ref(null);
const showBanner = ref(false);

const router = useRouter();

onMounted(() => {
  if (localStorage.getItem("showConfirmMessage") === "true") {
    showBanner.value = true;
    localStorage.removeItem("showConfirmMessage");
    setTimeout(() => {
      showBanner.value = false;
    }, 4000);
  }
});

const handleAudit = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    let formattedUrl = url.value.trim();
    if (!formattedUrl.startsWith("http")) {
      formattedUrl = "https://" + formattedUrl;
    }

    const res = await axios.post(
      "http://localhost:3000/api/audit",
      { url: formattedUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const auditWithDate = {
      ...res.data,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("lastAudit", JSON.stringify(auditWithDate));
    router.push({ name: "Dashboard", query: { site: formattedUrl } });
  } catch (err) {
    error.value = "Erreur lors de l'audit. Vérifie l'URL.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>
