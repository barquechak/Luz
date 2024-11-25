const timeBlocks = [
  { name: "₡28.30 por kWh", color: "green", start: "20:01", end: "06:00" },
  { name: "₡67.65 por kWh", color: "orange", start: "06:01", end: "10:00" },
  { name: "₡165.01 por kWh", color: "red", start: "10:01", end: "12:30" },
  { name: "₡67.65 por kWh", color: "orange", start: "12:31", end: "17:30" },
  { name: "₡165.01 por kWh", color: "red", start: "17:31", end: "20:00" },
];

function updateClock() {
  const now = new Date();

  // Get current hour, minutes, and seconds
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // Determine AM or PM
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? String(hours).padStart(2, "0") : "12"; // Show 12 instead of 0 for midnight/noon

  // Format time as HH:mm:ss AM/PM
  const currentTime = `${hours}:${minutes}:${seconds} ${ampm}`;

  // Display current time
  document.getElementById("current-time").textContent = currentTime;

  // Determine current block (in 24-hour format)
  const currentBlock = getCurrentBlock(now);
  const blockContainer = document.getElementById("current-block");

  if (currentBlock) {
    blockContainer.textContent = `Actualmente: ${currentBlock.name}`;
    blockContainer.className = currentBlock.color;
  } else {
    blockContainer.textContent = "Bloque no determinado";
    blockContainer.className = "";
  }
}

function getCurrentBlock(now) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes(); // Minutes since midnight

  for (const block of timeBlocks) {
    // Convert start and end times to minutes since midnight for comparison
    const [startHours, startMinutes] = block.start.split(":").map(Number);
    const [endHours, endMinutes] = block.end.split(":").map(Number);

    const start = startHours * 60 + startMinutes;
    const end = endHours * 60 + endMinutes;

    if (start <= end) {
      // Same-day block
      if (currentMinutes >= start && currentMinutes <= end) {
        return block;
      }
    } else {
      // Overnight block (e.g., Nocturno from 8 PM to 6 AM)
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
