<template>
  <v-app id="task-detail">
    <Sidebar />
    <v-app-bar app color="primary" dark>
      <!-- 戻るボタン -->
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>タスク詳細</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-card class="pa-4 task-detail-view-card" outlined>
          <!-- タスクのタイトル -->
          <v-card-title class="task-detail-view-title">
            {{ task.title }}
          </v-card-title>

          <!-- タスクの内容 -->
          <v-card-text class="task-detail-view-content">
            <p>
              {{ task.content }}
            </p>
          </v-card-text>

          <!-- タスクの期限 -->
          <v-card-subtitle class="task-detail-view-deadline">
            {{ task.deadline }}
          </v-card-subtitle>

          <!-- 完了ボタン -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" dark @click="completeTask">
              <v-icon left>mdi-check</v-icon>
              完了
            </v-btn>
          </v-card-actions>
        </v-card>
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
  async created() {
    this.task_id = this.$route.query.task_id;

    if (this.task_id) {
      const taskRef = firebase.firestore().collection("task");
      // 取得したtask_idと同じ値をフィールド内のtask_idにもつドキュメンテーションを取得
      const snapshot = await taskRef.where("task_id", "==", this.task_id).get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        this.task = doc.data();
      } else {
        console.error("タスクが存在しません");
      }
    }
  },
  data: () => ({
    task_id: "",
    task: {
      title: "",
      content: "",
      deadline: "",
    },
  }),
  methods: {
    completeTask() {
      // 完了処理のロジックを後で追加
      alert("タスクを完了しました！");
    },
  },
};
</script>

<style>
.task-detail-view-card {
  position: relative;
  margin: 0 auto;
}

.task-detail-view-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 16px;
}

.task-detail-view-content {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 32px;
  text-align: left;
  white-space: pre-wrap;
}

.task-detail-view-deadline {
  font-size: 20px;
  position: absolute;
  bottom: 15px;
  right: 120px;
}
</style>
