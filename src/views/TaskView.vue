<template>
  <v-app id="inspire">
    <Sidebar />
    <v-app-bar app hide-on-scroll prominent>
      <v-toolbar-title class="siteTitle">{{ fadedTitle }}</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col v-for="data in filteredTasks" :key="data.task_id" cols="4">
            <router-link
              :to="{ path: '/taskDetail', query: { task_id: data.task_id } }"
            >
              <v-card height="200" class="pa-4 card-container">
                <v-card-title class="task-view-title">
                  {{ data.vanish_title }}
                </v-card-title>
                <v-card-subtitle class="task-view-deadline">
                  期限：{{ data.selectDate }} {{ data.selectTime }}
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
import firebase from "@/firebase/firebase";

export default {
  components: {
    Sidebar,
  },
  created() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const uid = user.uid;

    if (!uid) {
      console.error("uid is not found");
      return;
    }

    const taskRef = firebase
      .firestore()
      .collection("task")
      .where("uid", "==", uid)
      .where("completedFlg", "==", false)
      .orderBy("selectDate", "asc")
      .orderBy("selectTime", "asc");

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
  }),
  computed: {
    filteredTasks() {
      return this.tasks.filter((task) => task.dispFlg);
    },
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
};
</script>

<style>
.siteTitle {
  font-family: "Caveat", cursive;
  font-weight: 500;
  font-style: normal;
  font-size: 80px !important;
  width: 100%;
}

/* タスクタイトル */
.task-view-title {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 24px;
  padding-bottom: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 最大3行まで表示 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* タスク期限 */
.task-view-deadline {
  color: grey;
  font-size: 18px;
  position: absolute;
  bottom: 8px;
  right: 16px;
}

/* カードコンテナ */
.card-container {
  position: relative;
  overflow: hidden;
}

/* 下線を消去 */
.v-application a {
  text-decoration: none !important;
}
.v-card-subtitle {
  text-decoration: none !important;
}
</style>
