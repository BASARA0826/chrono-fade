//棒グラフに関する設定。
export const barConfig = (labels) => {
  return {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "完了したタスク",
          backgroundColor: "#1976d2",
          data: [3, 20, 0, 4, 10, 9, 18],
          borderWidth: 1,
        },
        {
          label: "消失したタスク",
          backgroundColor: "gray",
          data: [5, 0, 10, 6, 5, 1, 2],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 20,
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
