import { createRouter, createWebHistory } from "vue-router";

// Layouts
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

// Pages
import Home from "@/pages/Home.vue";
import Audit from "@/pages/Audit.vue";
import Dashboard from "@/pages/Dashboard.vue";
import NotFound from "@/pages/NotFound.vue";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import Confirm from "@/pages/Confirm.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "Home",
        component: Home,
      },
      {
        path: "/login",
        name: "Login",
        component: Login,
      },
      {
        path: "register",
        name: "Register",
        component: Register,
      },
      {
        path: "/confirm/:token",
        name: "Confirm",
        component: Confirm,
      },
      {
        path: "/dashboard",
        component: DashboardLayout,
        name: "Dashboard",
        component: Dashboard,
      },
    ],
  },
  {
    path: "/audit",
    component: DashboardLayout,
    children: [
      {
        path: "",
        name: "Audit",
        component: Audit,
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

export default router;
