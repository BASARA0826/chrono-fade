//棒グラフに関する設定。
export const barConfig = (labels, completedTasks, lostTasks) => {
  const maxValue = Math.max(...completedTasks, ...lostTasks, 20);
  const yAxisMax = Math.ceil(maxValue / 5) * 5;

  return {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "完了したタスク",
          backgroundColor: "#1976d2",
          data: completedTasks,
          borderWidth: 1,
        },
        {
          label: "消失したタスク",
          backgroundColor: "gray",
          data: lostTasks,
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "x",
      scales: {
        y: {
          beginAtZero: true,
          max: yAxisMax,
          ticks: {
            stepSize: 5,
          },
        },
      },
      animation: {
        x: { duration: 0 },
        y: {
          duration: 1000,
          easing: "linear",
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  };
};
