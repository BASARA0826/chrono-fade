<template>
  <v-app id="task-create">
    <v-app-bar app color="primary" dark>
      <!-- 戻るボタン -->
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>タスク作成</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-card class="pa-4" outlined>
          <!-- タイトル入力 -->
          <v-card-title>
            <v-text-field
              label="タスクのタイトル"
              v-model="title"
              outlined
              dense
            ></v-text-field>
          </v-card-title>

          <!-- 内容入力 -->
          <v-card-text>
            <v-textarea
              label="タスクの内容"
              v-model="content"
              outlined
              dense
            ></v-textarea>
          </v-card-text>

          <!-- 期限入力 -->
          <v-card-subtitle>
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="deadline"
                  label="期限"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  dense
                ></v-text-field>
              </template>
              <v-card>
                <v-date-picker
                  class="task-create-view-selectDate"
                  v-model="selectDate"
                  show-adjacent-months
                ></v-date-picker>
                <v-time-picker
                  class="task-create-view-selectTime"
                  v-model="selectTime"
                  scrollable
                ></v-time-picker>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="saveDeadline">OK</v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-card-subtitle>

          <!-- 作成ボタン -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              type="submit"
              :disabled="invalid"
              @click="createTask"
            >
              <v-icon left>mdi-plus</v-icon>
              作成
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    title: "", // タスクのタイトル
    content: "", // タスクの内容
    deadline: "", // タスクの期限(最終保存用)
    selectDate: "", // 日付
    selectTime: "", // 時間
    menu: false, // 日付選択メニューの状態
  }),
  computed: {
    invalid() {
      console.log("invalid call", this.title, this.content, this.deadline);
      if (!this.title || !this.content || !this.deadline) {
        return true;
      }
      return false;
    },
  },
  methods: {
    saveDeadline() {
      if (this.selectDate && this.selectTime) {
        // 日付と時間を結合
        this.deadline = `${this.selectDate} ${this.selectTime}`;
        this.menu = false; // メニューを閉じる
      } else {
        alert("日付と時間を選択してください！");
      }
    },
    createTask() {
      // 作成ボタンの仮の挙動
      alert(
        "タスクが作成されました！\n" +
          `タイトル: ${this.title}\n内容: ${this.content}\n期限: ${this.deadline}`
      );
    },
  },
};
</script>

<style>
.task-create-view-selectDate .v-picker__title {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.task-create-view-selectTime .v-picker__title {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
