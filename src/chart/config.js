//棒グラフに関する設定。
export const barConfig = () => {
  return {
    type: "bar",
    data: {
      labels: ["a", "b", "c", "d", "e"],
      datasets: [
        {
          backgroundColor: ["red", "orange", "yellow", "green", "blue"],
          data: [30, 20, 30, 40, 50], // 文字列から数値に変更
          borderWidth: 5,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      borderWidth: 0, // plugins の外に移動
    },
  };
};
