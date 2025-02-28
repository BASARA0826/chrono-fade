<template>
  <div class="BarGraph-container"><canvas id="barChart"></canvas></div>
</template>

<script>
import { barConfig } from "@/chart/config";
import firebase from "@/firebase/firebase";
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
} from "chart.js";

Chart.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale
);

export default {
  name: "BarGraph",
  data() {
    return {
      uid: JSON.parse(sessionStorage.getItem("user")).uid,
      taskData: [],
      chartInstance: null,
    };
  },
  async mounted() {
    this.setupGraph();
    await this.fetchData(); // 初回データ取得
  },
  methods: {
    setupGraph() {
      // グラフの描画
      const ctx = document.getElementById("barChart").getContext("2d");
      this.chartInstance = new Chart(ctx, barConfig([], [], []));
    },
    fetchData() {
      // ログインユーザーのタスクを非同期取得
      const taskRef = firebase
        .firestore()
        .collection("task")
        .where("uid", "==", this.uid);

      this.unsubscribe = taskRef.onSnapshot((snapshot) => {
        this.taskData = snapshot.docs.map((doc) => doc.data());
        this.updateGraph();
      });
    },
    updateGraph() {
      // 現在の日時を含む1週間を取得(グラフの横軸)
      const today = new Date();
      const startWeek = new Date(
        today.setDate(today.getDate() - today.getDay())
      );
      const labels = [];

      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startWeek);
        currentDay.setDate(startWeek.getDate() + i);
        labels.push(`${currentDay.getMonth() + 1}/${currentDay.getDate()}`);
      }

      // processTaskDataでcompletedTasksとlostTasksにカウントしたデータ数を取得させる
      const { completedTasks, lostTasks } = this.processTaskData(labels);

      // グラフのデータを更新
      this.chartInstance.data.labels = labels;
      this.chartInstance.data.datasets[0].data = completedTasks;
      this.chartInstance.data.datasets[1].data = lostTasks;
      this.chartInstance.update(); // グラフを再描画
    },
    processTaskData(labels) {
      // 1週間分の完了タスク数と消失タスク数をカウントするための配列を用意
      const completedTasks = Array(7).fill(0);
      const lostTasks = Array(7).fill(0);

      this.taskData.forEach((task) => {
        if (task.completedFlg && task.completedDate) {
          // 完了タスク: completedDateがラベルの日付と一致
          const completedDate = new Date(task.completedDate);
          const formattedCompDate = `${
            completedDate.getMonth() + 1
          }/${completedDate.getDate()}`;

          // ラベルの日付と一致する場合、completedTasksの該当インデックスに+1
          const index = labels.indexOf(formattedCompDate);
          if (index !== -1) completedTasks[index]++;
        } else if (!task.completedFlg && task.dispFlg === false) {
          // 消失タスク: dispFlgがfalse & ラベルの日付と一致
          const formattedSelectDate = `${
            new Date(task.selectDate).getMonth() + 1
          }/${new Date(task.selectDate).getDate()}`;

          // ラベルの日付と一致する場合、lostTasksの該当インデックスに+1
          const index = labels.indexOf(formattedSelectDate);
          if (index !== -1) lostTasks[index]++;
        }
      });

      return { completedTasks, lostTasks };
    },
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe(); // リスナー解除
    }
  },
};
</script>

<style>
.BarGraph-container {
  display: flex;
  justify-content: center;
  height: 500px;
  margin: 30px 0;
}
@media (max-width: 768px) {
  .BarGraph-container {
    height: 300px;
    margin: 15px 0;
  }
}

@media (max-width: 480px) {
  .BarGraph-container {
    height: 250px;
    margin: 10px 0;
  }
}
</style>
