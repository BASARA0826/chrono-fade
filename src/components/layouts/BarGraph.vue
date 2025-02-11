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
    };
  },
  async mounted() {
    // 現在の日時を含む1週間を取得
    const today = new Date();
    const startWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const labels = [];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startWeek);
      currentDay.setDate(startWeek.getDate() + i);
      labels.push(`${currentDay.getMonth() + 1}/${currentDay.getDate()}`);
    }

    const taskRef = firebase.firestore().collection("task");
    const snapshot = await taskRef.where("uid", "==", this.uid).get();

    if (!snapshot.empty) {
      this.taskData = snapshot.docs.map((doc) => doc.data());
    }

    console.log("taskData:", this.taskData);

    const { completedTasks, lostTasks } = this.processTaskData(labels);

    console.log("completedTasks:", completedTasks);
    console.log("lostTasks:", lostTasks);

    // グラフの描画
    const ctx = document.getElementById("barChart").getContext("2d");
    new Chart(ctx, barConfig(labels, completedTasks, lostTasks));
  },
  methods: {
    processTaskData(labels) {
      const completedTasks = Array(7).fill(0);
      const lostTasks = Array(7).fill(0);

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();

      this.taskData.forEach((task) => {
        if (task.completedFlg && task.completedDate) {
          // 完了タスク: completedDateがラベルの日付と一致
          const completedDate = new Date(task.completedDate);
          const formattedCompDate = `${
            completedDate.getMonth() + 1
          }/${completedDate.getDate()}`;
          console.log("formattedCompDate:", formattedCompDate);
          const index = labels.indexOf(formattedCompDate);
          if (index !== -1) completedTasks[index]++;
        } else if (!task.completedFlg && task.selectDate) {
          // 消失タスク: selectDateが現在の日付以下 & ラベルの日付と一致
          const selectDateStr = task.selectDate;
          const selectTimeStr = task.selectTime || "00:00";
          const [selectHour, selectMinute] = selectTimeStr
            .split(":")
            .map(Number);

          const isPastDate =
            new Date(selectDateStr) < today ||
            (selectDateStr === todayStr &&
              (selectHour < currentHour ||
                (selectHour === currentHour && selectMinute < currentMinute)));

          if (isPastDate) {
            const formattedSelectdate = `${
              new Date(selectDateStr).getMonth() + 1
            }/${new Date(selectDateStr).getDate()}`;
            console.log("formattedSelectdate:", formattedSelectdate);
            const index = labels.indexOf(formattedSelectdate);
            if (index !== -1) lostTasks[index]++;
          }
        }
      });

      return { completedTasks, lostTasks };
    },
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
</style>
