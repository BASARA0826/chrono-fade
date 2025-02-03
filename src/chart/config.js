//棒グラフに関する設定。
export const barConfig = (labels, completedTasks, lostTasks) => {
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
      scales: {
        y: {
          beginAtZero: true,
          max: Math.max(...completedTasks, ...lostTasks, 20),
          ticks: {
            stepSize: 5,
          },
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
