const canvas = document.getElementById("analogClock");
const ctx = canvas.getContext("2d");
let radius = canvas.height / 2;
ctx.translate(radius, radius); // Center the canvas

// Adjust the canvas size dynamically
function resizeCanvas() {
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;
  canvas.width = width;
  canvas.height = height;
  radius = height / 2;

  ctx.resetTransform(); // Reset any previous transformations
  ctx.translate(radius, radius); // Re-center after resize
}

// Call resizeCanvas initially and on window resize
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Utility function to darken a color
function darkenBlockColor(color) {
  return `dark${color}`;
}

// Function to update the border color dynamically
function updateClockBorderColor(currentBlock) {
  const clockElement = document.getElementById("analogClock");

  let newColor = "";
  if (currentBlock.color) {
    newColor = darkenBlockColor(currentBlock.color);
  }
  clockElement.style.border = `6px solid ${newColor}`;
}

// Function to draw the glow effect around the entire clock
function drawGlow(ctx, radius) {
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
  grad.addColorStop(0, "rgba(255, 255, 255, 0.6)");
  grad.addColorStop(0.7, "rgba(255, 255, 255, 0.1)");
  grad.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = grad;
  ctx.fill();
}

// Function to draw the clock face
function drawFace(ctx, radius, borderColor) {
  const grad = ctx.createRadialGradient(
    0,
    0,
    radius * 0.95,
    0,
    0,
    radius * 1.05
  );
  grad.addColorStop(0, borderColor);
  grad.addColorStop(0.5, borderColor);
  grad.addColorStop(1, borderColor);

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius * 0.1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
  ctx.fillStyle = borderColor;
  ctx.fill();
}

// Function to draw the numbers on the clock
function drawNumbers(ctx, radius) {
  ctx.font = radius * 0.15 + "px arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  for (let num = 1; num < 13; num++) {
    let ang = (num * Math.PI) / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius * 0.85);
    ctx.rotate(-ang);
    ctx.fillStyle = "white";
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius * 0.85);
    ctx.rotate(-ang);
  }
}

// Function to draw the clock hands with a more stylish design
function drawTime(ctx, radius, borderColor) {
  drawFace(ctx, radius, borderColor);
  drawNumbers(ctx, radius);
  drawGlow(ctx, radius);

  const now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();

  hour =
    ((hour % 12) * Math.PI) / 6 +
    (minute * Math.PI) / (6 * 60) +
    (second * Math.PI) / (360 * 60);
  drawStylishHand(ctx, hour, radius * 0.5, radius * 0.1, borderColor); // Thicker hour hand

  minute = (minute * Math.PI) / 30 + (second * Math.PI) / (30 * 60);
  drawStylishHand(ctx, minute, radius * 0.8, radius * 0.07, borderColor); // Slightly thinner minute hand

  second = (second * Math.PI) / 30;
  drawStylishHand(ctx, second, radius * 0.9, radius * 0.02, "#ff0000"); // Thin second hand
}

// Function to draw stylish hands (with a line in the middle)
function drawStylishHand(ctx, pos, length, width, color) {
  // Draw the main hand
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0, 0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.strokeStyle = color;
  ctx.stroke();

  // Draw the small center line (pivot point)
  const pivotLength = width * 0.4; // Adjust this for a better effect
  ctx.beginPath();
  ctx.lineWidth = width * 0.3; // Thin line for the center
  ctx.moveTo(0, 0);
  ctx.lineTo(0, pivotLength);
  ctx.strokeStyle = color;
  ctx.stroke();

  // Reset rotation to avoid affecting other elements
  ctx.rotate(-pos);
}

// Time blocks with updated colors
const timeBlocks = [
  { name: "₡28.30 por kWh", color: "green", start: "20:01", end: "06:00" }, // Green
  { name: "₡67.65 por kWh", color: "orange", start: "06:01", end: "10:00" }, // Orange
  { name: "₡165.01 por kWh", color: "red", start: "10:01", end: "12:30" }, // Red
  { name: "₡67.65 por kWh", color: "orange", start: "12:31", end: "17:30" }, // Orange
  { name: "₡165.01 por kWh", color: "red", start: "17:31", end: "20:00" }, // Red
];

// Function to determine the current block
function getCurrentBlock(now) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const block of timeBlocks) {
    const [startHours, startMinutes] = block.start.split(":").map(Number);
    const [endHours, endMinutes] = block.end.split(":").map(Number);

    const start = startHours * 60 + startMinutes;
    const end = endHours * 60 + endMinutes;

    if (start <= end) {
      if (currentMinutes >= start && currentMinutes <= end) {
        return block;
      }
    } else {
      if (currentMinutes >= start || currentMinutes <= end) {
        return block;
      }
    }
  }

  return null;
}

// Start the clock
function drawClock() {
  ctx.clearRect(-radius, -radius, 2 * radius, 2 * radius);

  const currentBlock = getCurrentBlock(new Date());
  const borderColor = currentBlock ? currentBlock.color : "#333";
  updateClockBorderColor(currentBlock);

  drawTime(ctx, radius, borderColor);
  requestAnimationFrame(drawClock);
}

drawClock();
