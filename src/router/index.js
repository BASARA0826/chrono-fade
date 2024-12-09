import Vue from "vue";
import VueRouter from "vue-router";
import TaskView from "../views/TaskView.vue";
import TaskDetailView from "@/views/TaskDetailView.vue";
import TaskCreateView from "@/views/TaskCreateView.vue";
import ConfigView from "@/views/ConfigView.vue";

Vue.use(VueRouter);

const routes = [
  // タスク一覧
  {
    path: "/",
    name: "task",
    component: TaskView,
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

  // アカウント設定
  {
    path: "/config",
    name: "config",
    component: ConfigView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
