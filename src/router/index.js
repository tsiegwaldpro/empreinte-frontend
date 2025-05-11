import { createRouter, createWebHistory } from "vue-router";

// Layouts
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

// Pages
import Home from "@/pages/Home.vue";
import Audit from "@/pages/Audit.vue";
import Dashboard from "@/pages/Dashboard.vue";
import NotFound from "@/pages/NotFound.vue";

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
    path: "/dashboard",
    component: DashboardLayout,
    children: [
      {
        path: "",
        name: "Dashboard",
        component: Dashboard,
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
