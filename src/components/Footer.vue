<template>
  <v-footer app padless color="grey-darken-4">
    <v-container
      class="text-center text-grey-lighten-1 py-4 d-flex flex-column flex-md-row justify-center align-center gap-2"
    >
      <span
        >© {{ new Date().getFullYear() }} — Empreinte. Tous droits
        réservés.</span
      >
      <RouterLink
        to="/mentions-legales"
        class="text-grey-lighten-1 text-caption text-decoration-underline"
        style="cursor: pointer"
      >
        Mentions légales
      </RouterLink>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>
