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
        <!-- ローディング中は Skeleton Loader を表示 -->
        <v-skeleton-loader
          v-if="loading"
          type="image"
          class="task-detail-skeleton"
        ></v-skeleton-loader>

        <v-card v-else class="pa-4 task-detail-view-card" outlined>
          <!-- タスクのタイトル -->
          <v-card-title class="task-detail-view-title">
            {{ featureEnabled ? task.vanish_title : task.title }}
          </v-card-title>

          <!-- タスクの内容 -->
          <v-card-text class="task-detail-view-content">
            <p>{{ featureEnabled ? task.vanish_content : task.content }}</p>
          </v-card-text>

          <!-- タスクの期限 -->
          <v-card-subtitle
            class="task-detail-view-deadline"
            v-if="!task.completedFlg"
          >
            期限：{{ task.selectDate }} {{ task.selectTime }}
          </v-card-subtitle>

          <v-card-subtitle
            class="task-detail-view-deadline"
            v-if="task.completedFlg"
          >
            完了日時：{{ formattedDate }}
          </v-card-subtitle>

          <!-- 完了ボタン -->
          <v-fade-transition>
            <v-card-actions v-if="!task.completedFlg && task.dispFlg">
              <v-spacer></v-spacer>
              <v-btn color="success" dark @click="completeTask">
                <v-icon left>mdi-check</v-icon>
                完了
              </v-btn>
            </v-card-actions>
          </v-fade-transition>
        </v-card>
      </v-container>

      <!-- ポップアップ -->
      <v-dialog v-model="successDialog" persistent max-width="500">
        <v-card class="popup-card">
          <v-card-title class="popup-title">
            タスクを完了しました
          </v-card-title>
          <v-card-actions class="popup-actions">
            <v-spacer></v-spacer>
            <v-btn class="popup-btn" text @click="navToTask"> OK </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
    this.formattedDate = this.$route.query.formattedDate;
    this.loading = true;

    if (this.task_id) {
      const taskRef = firebase
        .firestore()
        .collection("task")
        .where("task_id", "==", this.task_id);

      taskRef.onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          this.task = doc.data();
          this.task.docId = doc.id;
        } else {
          console.error("タスクが存在しません");
        }
      });
    }

    const user = JSON.parse(sessionStorage.getItem("user"));
    const uid = user.uid;

    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.featureEnabled = doc.data().featureEnabled;
        } else {
          console.log("ユーザーデータが見つかりません");
        }
      })
      .catch((error) => {
        console.error("ユーザーデータの取得に失敗", error);
      });

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  },
  data: () => ({
    task_id: "",
    task: {
      title: "",
      content: "",
      selectDate: "",
      selectTime: "",
      dispFlg: true,
    },
    formattedDate: "",
    successDialog: false,
    loading: false,
    featureEnabled: true,
  }),
  methods: {
    async completeTask() {
      const now = new Date().toISOString();
      await firebase
        .firestore()
        .collection("task")
        .doc(this.task.docId)
        .update({
          completedFlg: true,
          completedDate: now,
        });
      this.successDialog = true;
    },
    navToTask() {
      this.$router.push("/task");
    },
  },
};
</script>

<style>
.task-detail-skeleton {
  width: 100%;
  margin: 0 auto;
}

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
