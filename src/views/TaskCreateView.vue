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
          <v-form ref="form">
            <!-- タイトル入力 -->
            <v-card-title>
              <v-text-field
                label="タスクのタイトル"
                v-model="title"
                :rules="[(v) => !!v || 'タイトルを入力してください']"
                outlined
                dense
              ></v-text-field>
            </v-card-title>

            <!-- 内容入力 -->
            <v-card-text>
              <v-textarea
                label="タスクの内容"
                v-model="content"
                :rules="[(v) => !!v || '内容を入力してください']"
                outlined
                dense
              ></v-textarea>
            </v-card-text>
          </v-form>

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
                  :min="minDate"
                ></v-date-picker>
                <v-time-picker
                  class="task-create-view-selectTime"
                  v-model="selectTime"
                  scrollable
                  format="24hr"
                  :disabled="!selectDate"
                  :min="minTime"
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
          <transition name="fade">
            <v-alert
              dense
              outlined
              type="error"
              class="ml-4 error-message"
              v-if="errorMessage"
            >
              {{ errorMessage }}
            </v-alert>
          </transition>
        </v-card>
      </v-container>

      <!-- ポップアップ -->
      <v-dialog v-model="successDialog" persistent max-width="500">
        <v-card class="popup-card">
          <v-card-title class="popup-title">
            タスクの作成が完了しました
          </v-card-title>
          <v-card-actions class="popup-actions">
            <v-spacer></v-spacer>
            <v-btn class="popup-btn" text @click="redirect">
              タスク作成を続ける
            </v-btn>
            <v-btn class="popup-btn" text @click="navToTask">
              タスク一覧へ戻る
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import firebase from "@/firebase/firebase";

export default {
  data: () => ({
    title: "", // タスクのタイトル
    content: "", // タスクの内容
    deadline: "", // タスクの期限(最終保存用)
    selectDate: "", // 日付
    selectTime: "", // 時間
    menu: false, // 日付選択メニューの状態
    errorMessage: "",
    successDialog: false,
    minDate: new Date().toISOString().substr(0, 10),
    minTime: null,
  }),
  mounted() {
    setInterval(() => {
      this.minDate = new Date().toISOString().substr(0, 10);
    }, 60000);
  },
  computed: {
    invalid() {
      if (!this.title || !this.content || !this.deadline) {
        return true;
      }
      return false;
    },
  },
  watch: {
    selectDate(newDate) {
      const today = new Date().toISOString().substr(0, 10);
      if (newDate === today) {
        const now = new Date();
        this.minTime =
          now.getHours().toString().padStart(2, "0") +
          ":" +
          now.getMinutes().toString().padStart(2, "0");
      } else {
        this.minTime = null;
      }
    },
  },
  methods: {
    saveDeadline() {
      if (this.selectDate && this.selectTime) {
        const now = new Date();
        now.setSeconds(0, 0);
        const selectedDateTime = new Date(
          `${this.selectDate}T${this.selectTime}:00`
        );

        if (selectedDateTime < now) {
          this.menu = false;
          this.errorMessage = "過去の日付は選択できません";
          this.clearMessage();
          return;
        }

        // 日付と時間を結合
        this.deadline = `${this.selectDate} ${this.selectTime}`;
        this.menu = false;
      } else {
        this.menu = false;
        this.errorMessage = "日付と時間は両方とも指定してください";
        this.clearMessage();
      }
    },
    async createTask() {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user) {
          this.errorMessage = "ログインユーザー情報が取得できませんでした";
          this.clearMessage();
          return;
        }

        const uid = user.uid;

        // task_idの生成
        const taskId = firebase.firestore().collection("task").doc().id;

        // 期限の抽出
        const deadline = new Date(`${this.selectDate}T${this.selectTime}`);
        const now = new Date();
        const totalSeconds = (deadline - now) / 1000;

        // タイトルと内容の文字数の合計
        const totalChars = this.title.length + this.content.length;

        // 1文字消えるのにかかる秒数
        const interval = totalSeconds / totalChars;

        // intervalListを作成(タイムアウトしないように500秒分割)
        let intervalList = [];
        let remainingTime = interval;
        while (remainingTime > 0) {
          intervalList.push(Math.min(500, remainingTime));
          remainingTime -= 500;
        }

        // データ登録
        await firebase.firestore().collection("task").doc(taskId).set({
          uid: uid,
          task_id: taskId,
          title: this.title,
          content: this.content,
          vanish_title: this.title,
          vanish_content: this.content,
          selectDate: this.selectDate,
          selectTime: this.selectTime,
          completedFlg: false,
          completedDate: null,
          intervalList: intervalList,
          intervalList2: intervalList,
          dispFlg: true,
          vanishFlg: false,
        });

        this.successDialog = true;
      } catch (error) {
        console.error("エラーが発生しました", error);
        this.errorMessage = "エラーが発生しました";
        this.clearMessage();
      }
    },
    redirect() {
      this.$refs.form.resetValidation();
      this.successDialog = false;
      this.title = "";
      this.content = "";
      this.selectDate = "";
      this.selectTime = "";
      this.deadline = "";
    },
    navToTask() {
      this.$router.push("/task");
    },
    clearMessage() {
      setTimeout(() => {
        this.message = "";
        this.errorMessage = "";
      }, 4000);
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

.popup-card {
  padding: 20px;
}
.popup-title {
  text-align: center;
  font-size: 1.25rem;
  font-weight: bold;
}
.popup-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.popup-btn {
  padding: 10px 20px;
  border-radius: 20px;
  background-color: #1976d2;
  color: white !important;
  text-transform: uppercase;
  font-weight: bold;
  transition: background-color 0.2s ease;
}
.popup-btn:hover {
  background-color: #1565c0;
}
</style>
