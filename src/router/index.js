import Vue from "vue";
import VueRouter from "vue-router";
import TaskView from "../views/TaskView.vue";
import TaskDetailView from "@/views/TaskDetailView.vue";
import TaskCreateView from "@/views/TaskCreateView.vue";
import ConfigView from "@/views/ConfigView.vue";
import LoginView from "@/views/LoginView.vue";
import SignUpView from "@/views/SignUpView.vue";
import firebase from "@/firebase/firebase";

Vue.use(VueRouter);

const routes = [
  // ログイン画面
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  // 新規登録画面
  {
    path: "/signup",
    name: "signup",
    component: SignUpView,
  },

  // タスク一覧
  {
    path: "/task",
    name: "task",
    component: TaskView,
    meta: { requiresAuth: true },
  },

  // タスク詳細
  {
    path: "/taskDetail",
    name: "taskDetail",
    component: TaskDetailView,
    meta: { requiresAuth: true },
  },

  // タスク作成
  {
    path: "/create",
    name: "taskCreate",
    component: TaskCreateView,
    meta: { requiresAuth: true },
  },

  // アカウント設定
  {
    path: "/config",
    name: "config",
    component: ConfigView,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth) {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        next({
          path: "/",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    });
  } else {
    next(); // next() を常に呼び出すようにしてください!
  }
});

export default router;
