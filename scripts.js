// Tarifa AM/PM Bar Graph (Bottom)
const ctxBar = document.getElementById("barGraph").getContext("2d");

const dataBar = {
  labels: [
    "1 AM",
    "2 AM",
    "3 AM",
    "4 AM",
    "5 AM",
    "6 AM",
    "7 AM",
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
    "6 PM",
    "7 PM",
    "8 PM",
    "9 PM",
    "10 PM",
    "11 PM",
    "12 AM",
  ],
  datasets: [
    {
      label: "Costo Tarifa (₡)",
      data: [
        28.3, 28.3, 28.3, 28.3, 28.3, 67.65, 67.65, 67.65, 67.65, 165.01,
        165.01, 165.01, 67.65, 67.65, 67.65, 67.65, 165.01, 165.01, 165.01,
        28.3, 28.3, 28.3, 28.3, 28.3,
      ],
      backgroundColor: [
        "green",
        "green",
        "green",
        "green",
        "green",
        "orange",
        "orange",
        "orange",
        "orange",
        "red",
        "red",
        "red",
        "orange",
        "orange",
        "orange",
        "orange",
        "red",
        "red",
        "red",
        "green",
        "green",
        "green",
        "green",
        "green",
      ],
      borderWidth: 0,
    },
  ],
};

const configBar = {
  type: "bar",
  data: dataBar,
  options: {
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { autoSkip: false },
        title: { display: true, text: "Horario (AM/PM)" },
      },
      y: {
        title: { display: true, text: "Costo (₡)" },
        min: 0,
        max: 200,
        ticks: { stepSize: 50 },
      },
    },
  },
};

new Chart(ctxBar, configBar);
