import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Home from "@/views/Home.vue";
import ResetPassword from "@/views/ResetPassword.vue";
import NewUserPage1 from "@/views/NewUserPage1.vue";
import NewUserPage2 from "@/views/NewUserPage2.vue";
import NewUserPage3 from "@/views/NewUserPage3.vue";
import { auth } from "@/firebase"; // Import your Firebase auth instance

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword,
  },
  {
    path: "/new-user1",
    name: "NewUserPage1",
    component: NewUserPage1,
    meta: { requiresAuth: true },
  },
  {
    path: "/new-user2",
    name: "NewUserPage2",
    component: NewUserPage2,
    meta: { requiresAuth: true },
  },
  {
    path: "/new-user3",
    name: "NewUserPage3",
    component: NewUserPage3,
    meta: { requiresAuth: true },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = auth.currentUser;

  if (requiresAuth && !currentUser) {
    // Redirect to login if the route requires auth and no user is found
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
