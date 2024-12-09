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
          <v-card-title class="title"> タスクのタイトル </v-card-title>

          <!-- タスクの内容 -->
          <v-card-text>
            <p>これはタスクの内容です。詳細情報がここに表示されます。</p>
          </v-card-text>

          <!-- タスクの期限 -->
          <v-card-subtitle> 期限: 2024年12月15日 </v-card-subtitle>

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
export default {
  created() {
    this.task_id = this.$route.query.task_id;
    console.log("task_id", this.task_id);
  },
  data: () => ({
    task_id: "",
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
