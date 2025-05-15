import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Layouts
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";

// Pages
import Home from "@/pages/Home.vue";
import Audit from "@/pages/Audit.vue";
import DashboardSitesView from "@/pages/DashboardSitesView.vue";
import DashboardHistoryView from "@/pages/DashboardHistoryView.vue";
import NotFound from "@/pages/NotFound.vue";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import Confirm from "@/pages/Confirm.vue";
import Profile from "@/pages/Profile.vue";
import ForgotPassword from "@/pages/ForgotPassword.vue";
import ResetPassword from "@/pages/ResetPassword.vue";
import MentionsLegales from "@/pages/MentionsLegales.vue";
import PolitiqueConfidentialite from "@/pages/PolitiqueConfidentialite.vue";
import CGU from "@/pages/CGU.vue";

// Admin pages
import RecommendationsAdmin from "@/pages/admin/RecommendationsAdmin.vue";
import UsersAdmin from "@/pages/admin/UsersAdmin.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "", name: "Home", component: Home },
      { path: "login", name: "Login", component: Login },
      { path: "register", name: "Register", component: Register },
      { path: "confirm/:token", name: "Confirm", component: Confirm },
      { path: "profile", name: "Profile", component: Profile },
      {
        path: "mentions-legales",
        name: "MentionsLegales",
        component: MentionsLegales,
      },
      {
        path: "politique-confidentialite",
        name: "PolitiqueConfidentialite",
        component: PolitiqueConfidentialite,
      },
      { path: "cgu", name: "CGU", component: CGU },
      {
        path: "forgot-password",
        name: "ForgotPassword",
        component: ForgotPassword,
      },
      {
        path: "reset-password/:token",
        name: "ResetPassword",
        component: ResetPassword,
      },
    ],
  },

  // ✅ Bloc admin imbriqué dans DefaultLayout pour inclure header/footer
  {
    path: "/admin",
    component: DefaultLayout,
    meta: { requiresAdmin: true },
    children: [
      {
        path: "",
        component: AdminLayout,
        children: [
          {
            path: "",
            redirect: "/admin/users",
          },
          {
            path: "users",
            name: "AdminUsers",
            component: UsersAdmin,
          },
          {
            path: "recommandations",
            name: "AdminRecommendations",
            component: RecommendationsAdmin,
          },
        ],
      },
    ],
  },

  {
    path: "/audit",
    component: DashboardLayout,
    children: [{ path: "", name: "Audit", component: Audit }],
  },

  {
    path: "/dashboard",
    component: DefaultLayout,
    children: [
      {
        path: "",
        component: DashboardLayout,
        children: [
          { path: "", name: "Dashboard", component: DashboardSitesView },
          { path: "history", name: "History", component: DashboardHistoryView },
          {
            path: "audit",
            name: "DashboardAudit",
            component: () => import("@/pages/Dashboard.vue"),
          },
        ],
      },
    ],
  },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ Protection des routes admin
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAdmin) {
    if (!auth.isAuthenticated) {
      return next("/login");
    }

    if (auth.user?.role !== "admin") {
      return next("/dashboard");
    }
  }

  next();
});

export default router;
