<template>
  <v-app id="task-detail">
    <v-app-bar app color="primary" dark>
      <!-- 戻るボタン -->
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>タスク詳細</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-card class="pa-4" outlined>
          <!-- タスクのタイトル -->
          <v-card-title class="title">
            {{ task.title }}
          </v-card-title>

          <!-- タスクの内容 -->
          <v-card-text>
            <p>
              {{ task.content }}
            </p>
          </v-card-text>

          <!-- タスクの期限 -->
          <v-card-subtitle>
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
import firebase from "@/firebase/firebase";

export default {
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
.title {
  font-size: 24px;
  font-weight: bold;
}
</style>
