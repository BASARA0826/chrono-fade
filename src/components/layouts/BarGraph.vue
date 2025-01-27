<template>
  <canvas id="barChart"></canvas>
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
    const ctx = document.getElementById("barChart").getContext("2d");
    new Chart(ctx, barConfig());
  },
};
</script>
