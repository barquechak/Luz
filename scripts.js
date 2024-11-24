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

// This code is for handling the digital clock

const timeBlocks = [
  { name: "Nocturno", color: "green", start: "20:01", end: "06:00" },
  { name: "Valle", color: "orange", start: "06:01", end: "10:00" },
  { name: "Punta", color: "red", start: "10:01", end: "12:30" },
  { name: "Valle", color: "orange", start: "12:31", end: "17:30" },
  { name: "Punta", color: "red", start: "17:31", end: "20:00" },
];

function updateClock() {
  const now = new Date();

  // Format current time as HH:mm
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const currentTime = `${hours}:${minutes}`;

  // Display current time
  document.getElementById("current-time").textContent = currentTime;

  // Determine current block
  const currentBlock = getCurrentBlock(currentTime);
  const blockContainer = document.getElementById("current-block");

  if (currentBlock) {
    blockContainer.textContent = `Actualmente: ${currentBlock.name}`;
    blockContainer.className = currentBlock.color;
  } else {
    blockContainer.textContent = "Bloque no determinado";
    blockContainer.className = "";
  }
}

function getCurrentBlock(time) {
  const [hours, minutes] = time.split(":").map(Number);

  // Convert time to minutes since midnight for comparison
  const currentMinutes = hours * 60 + minutes;

  for (const block of timeBlocks) {
    const [startHours, startMinutes] = block.start.split(":").map(Number);
    const [endHours, endMinutes] = block.end.split(":").map(Number);

    // Calculate start and end in minutes since midnight
    const start = startHours * 60 + startMinutes;
    const end = endHours * 60 + endMinutes;

    if (start <= end) {
      // Same-day block
      if (currentMinutes >= start && currentMinutes <= end) {
        return block;
      }
    } else {
      // Overnight block
      if (currentMinutes >= start || currentMinutes <= end) {
        return block;
      }
    }
  }

  return null; // No matching block
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initial call to set clock immediately on load
updateClock();
