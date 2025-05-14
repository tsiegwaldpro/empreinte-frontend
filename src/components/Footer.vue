<template>
  <v-footer app padless color="grey-darken-4">
    <v-container
      class="text-grey-lighten-1 py-4 d-flex flex-column flex-md-row justify-center align-center text-center text-caption"
    >
      <span class="mb-2 mb-md-0">
        © {{ new Date().getFullYear() }} — Empreinte. Tous droits réservés.
      </span>

      <RouterLink
        to="/mentions-legales"
        class="mx-2 text-grey-lighten-1 text-decoration-underline"
        style="cursor: pointer"
      >
        Mentions légales
      </RouterLink>

      <RouterLink
        to="/politique-confidentialite"
        class="mx-2 text-grey-lighten-1 text-decoration-underline"
        style="cursor: pointer"
      >
        Politique de confidentialité
      </RouterLink>

      <RouterLink
        to="/cgu"
        class="mx-2 text-grey-lighten-1 text-decoration-underline"
        style="cursor: pointer"
      >
        CGU
      </RouterLink>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>
