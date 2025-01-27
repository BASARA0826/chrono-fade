<template>
  <div class="BarGraph-container"><canvas id="barChart"></canvas></div>
</template>

<script>
import { barConfig } from "@/chart/config";
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
  mounted() {
    // 現在の日時を含む1週間を取得
    const today = new Date();
    const startWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const labels = [];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startWeek);
      currentDay.setDate(startWeek.getDate() + i);
      labels.push(`${currentDay.getMonth() + 1}/${currentDay.getDate()}`);
    }

    // グラフの描画
    const ctx = document.getElementById("barChart").getContext("2d");
    new Chart(ctx, barConfig(labels));
  },
};
</script>

<style>
.BarGraph-container {
  display: flex;
  justify-content: center;
  height: 500px;
  margin-bottom: 30px;
}
</style>
