import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Home from "@/views/Home.vue";
import ResetPassword from "@/views/ResetPassword.vue";
import NewUserPage1 from "@/views/NewUserPage1.vue";
import NewUserPage2 from "@/views/NewUserPage2.vue";
import NewUserPage3 from "@/views/NewUserPage3.vue";
import Connect from "@/views/Connect.vue";
import Messages from "@/views/Messages.vue";
import MyAccount from "@/views/MyAccount.vue";
import MyBuzzes from "@/views/MyBuzzes.vue";
import MainLayout from "@/views/MainLayout.vue";
import Notifications from '@/views/Notifications.vue';
import Privacy from '@/views/Privacy.vue';
import { auth } from "@/firebase";

const routes = [
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'home', name: 'Home', component: Home },
      { path: 'connect', name: 'Connect', component: Connect },
      { path: 'messages', name: 'Messages', component: Messages },
      { path: 'mybuzzes', name: 'MyBuzzes', component: MyBuzzes },
      { path: 'myaccount', name: 'MyAccount', component: MyAccount },
      { path: 'notifications', name: 'Notifications', component: Notifications },
      { path: 'privacy', name: 'Privacy', component: Privacy },
      
    ],
  },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: '/new-user1', name: 'NewUserPage1', component: NewUserPage1, meta: { requiresAuth: true } },
  { path: '/new-user2', name: 'NewUserPage2', component: NewUserPage2, meta: { requiresAuth: true } },
  { path: '/new-user3', name: 'NewUserPage3', component: NewUserPage3, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = auth.currentUser;

  if (requiresAuth && !currentUser) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;