<template>
  <v-container class="py-10 home-page text-white">
    <section class="text-center mb-10">
      <h1 class="text-h3 font-weight-bold mb-2">🌱 Empreinte</h1>
      <p class="text-subtitle-1 mb-1">
        L’outil qui mesure l’impact environnemental de votre site web.
      </p>
      <p class="text-body-2 text-grey-lighten-1 mb-4">
        Obtenez des recommandations concrètes pour éco-concevoir vos pages.
      </p>
      <v-btn
        color="primary"
        class="text-white font-weight-bold text-uppercase"
        to="/register"
      >
        Créer un compte gratuitement
      </v-btn>
    </section>

    <section class="mb-10">
      <h2 class="text-h5 mb-4 text-center">🧾 Comparez nos offres</h2>
      <v-card color="grey-darken-4" elevation="4" class="pa-4">
        <v-table class="text-white" density="comfortable">
          <thead>
            <tr>
              <th></th>
              <th class="text-center">🧢 Freemium</th>
              <th class="text-center">👑 Premium</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Audit de la page d’accueil</td>
              <td class="text-center">✅</td>
              <td class="text-center">✅</td>
            </tr>
            <tr>
              <td>Audit complet via sitemap</td>
              <td class="text-center">❌</td>
              <td class="text-center">✅</td>
            </tr>
            <tr>
              <td>Recommandations personnalisées</td>
              <td class="text-center">✅</td>
              <td class="text-center">✅</td>
            </tr>
            <tr>
              <td>Priorité dans la file d’audit</td>
              <td class="text-center">❌</td>
              <td class="text-center">✅</td>
            </tr>
            <tr>
              <td>Historique des audits</td>
              <td class="text-center">❌</td>
              <td class="text-center">✅</td>
            </tr>
            <tr>
              <td>Actions concrètes pour chaque reco</td>
              <td class="text-center">❌</td>
              <td class="text-center">✅</td>
            </tr>
            <tr>
              <td>Export PDF</td>
              <td class="text-center">❌</td>
              <td class="text-center">✅</td>
            </tr>
            <tr>
              <td class="font-weight-bold">Prix</td>
              <td class="text-center font-weight-bold">Gratuit</td>
              <td class="text-center font-weight-bold">9€/mois</td>
            </tr>
          </tbody>
        </v-table>
        <div class="text-center mt-6">
          <v-btn
            color="primary"
            class="text-white font-weight-bold text-uppercase"
            to="/register"
          >
            Je crée mon compte
          </v-btn>
        </div>
      </v-card>
    </section>

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
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    router.replace({ name: "Dashboard" });
  }
});
</script>
