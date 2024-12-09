import Vue from "vue";
import VueRouter from "vue-router";
import TaskView from "../views/TaskView.vue";
import TaskDetailView from "@/views/TaskDetailView.vue";
import TaskCreateView from "@/views/TaskCreateView.vue";

Vue.use(VueRouter);

const routes = [
  // タスク一覧
  {
    path: "/",
    name: "task",
    component: TaskView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },

  // タスク詳細
  {
    path: "/taskDetail",
    name: "taskDetail",
    component: TaskDetailView,
  },

  // タスク作成
  {
    path: "/create",
    name: "taskCreate",
    component: TaskCreateView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
