const matchNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const ratings_array = [
  2.0, 2.06, 2.03, 2.12, 2.08, 2.18, 2.14, 2.24, 2.3, 2.26, 2.38, 2.45,
];

const title = (tooltipItems) => {
  let firstIndex = tooltipItems[0];
  let matchNumber = firstIndex.dataIndex + 1;
  return "Match " + matchNumber;
};

const label = (tooltipItem) => {
  let matchIndex = tooltipItem.dataIndex;
  return ["rating : " + ratings_array[matchIndex]];
};

const myChart = new Chart("line-chart", {
  type: "line",
  data: {
    labels: matchNumber,
    datasets: [
      {
        label: "Match Number",
        borderColor: "#4487f6",
        data: ratings_array,
        tension: 0.4,
        pointRadius: (ctx) => {
          const lastIndex = ratings_array.length - 1;
          if (ctx.dataIndex === lastIndex) {
            return 5;
          } else {
            return 3;
          }
        },
        pointBackgroundColor: (ctx) => {
          const lastIndex = ratings_array.length - 1;
          if (ctx.dataIndex === lastIndex) {
            return "#2662eb";
          } else {
            return "#3c82f6";
          }
        },
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 30,
        right: 15,
      },
    },
    scales: {
      y: {
        border: {
          color: "#f1f3f7",
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 4,
        },
        title: {
          display: true,
          text: "Rating",
          color: "#969ba3",
        },
        grid: {
          drawOnChartArea: false,
        },
        position: "left",
        display: true,
      },
      x: {
        border: {
          color: "#f1f3f7",
        },
        title: {
          display: true,
          text: "Match Number",
          color: "#969ba3",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        titleColor: "#99a1aaff",
        backgroundColor: "#ffffff",
        bodyColor: "#679ff8",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        bodyFont: {
          weight: "bold",
        },
        callbacks: {
          title: title,
          label: label,
        },
      },
    },
  },
});
