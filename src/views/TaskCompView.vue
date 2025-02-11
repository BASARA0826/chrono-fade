<template>
  <v-app id="inspire">
    <Sidebar />
    <v-app-bar app hide-on-scroll prominent>
      <v-toolbar-title class="siteTitle">{{ fadedTitle }}</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-card class="memory-card">
          <div class="card-content">
            <v-card-title class="card-title"
              >思い出せなくなってしまった記録</v-card-title
            >
            <v-card-text class="card-text">10</v-card-text>
          </div>
        </v-card>

        <BarGraph />

        <v-row>
          <v-col v-for="(data, index) in tasks" :key="index" cols="4">
            <router-link
              :to="{
                path: '/taskDetail',
                query: {
                  task_id: data.task_id,
                  formattedDate: formatDate(data.completedDate),
                },
              }"
            >
              <v-card height="200" class="pa-4 card-container">
                <v-card-title class="task-view-title">
                  {{ getDisplayTitle(data) }}
                </v-card-title>
                <v-card-subtitle class="task-view-deadline">
                  完了日時：{{ formatDate(data.completedDate) }}
                </v-card-subtitle>
              </v-card>
            </router-link>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Sidebar from "@/components/layouts/Sidebar.vue";
import BarGraph from "@/components/layouts/BarGraph.vue";
import firebase from "@/firebase/firebase";
import { format } from "date-fns";

export default {
  components: {
    Sidebar,
    BarGraph,
  },
  created() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const uid = user.uid;

    if (!uid) {
      console.error("uid is not found");
      return;
    }

    firebase
      .firestore()
      .collection("users")
      .doc(this.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.featureEnabled = doc.data().featureEnabled;
        }
      });

    const taskRef = firebase
      .firestore()
      .collection("task")
      .where("uid", "==", uid)
      .where("completedFlg", "==", true)
      .orderBy("completedDate", "desc");

    taskRef.onSnapshot((snapshot) => {
      this.tasks = [];
      snapshot.forEach((doc) => {
        this.tasks.push(doc.data());
      });
    });
  },
  data: () => ({
    tasks: [],
    siteTitle: "ChronoFade",
    featureEnabled: true,
  }),
  computed: {
    fadedTitle() {
      return this.siteTitle
        .split("")
        .map((char) => {
          if (Math.random() < 0.1) {
            return char === "C" || char === "F" ? "  " : " ";
          }
          return char;
        })
        .join("");
    },
  },
  methods: {
    formatDate(date) {
      if (!date) {
        return "";
      }
      const formattedDate = format(new Date(date), "yyyy/MM/dd HH:mm");
      return formattedDate;
    },
    getDisplayTitle(task) {
      return this.featureEnabled ? task.vanish_title : task.title;
    },
  },
};
</script>

<style>
.memory-card {
  padding: 16px;
  margin-bottom: 16px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.card-title {
  font-size: 1.5rem; /* タイトルのフォントサイズ */
  font-weight: bold;
}

.card-text {
  font-size: 1.5rem; /* テキストのフォントサイズ */
  color: #4caf50; /* 色を変更する場合 */
  width: 100px;
  margin-left: 16px;
  padding-bottom: 0;
}
</style>
