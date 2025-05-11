// src/plugins/vuetify.js
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const customTheme = {
  dark: true, // ← FORCÉ en dark mode
  colors: {
    background: "#121212",
    surface: "#1E1E1E",
    primary: "#F27438",
    secondary: "#26474E",
    accent: "#F9968B",
    error: "#FF5252",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FFC107",
  },
};

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "customTheme",
    themes: {
      customTheme,
    },
  },
});
