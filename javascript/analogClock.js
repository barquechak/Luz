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
function darkenColor(color, percentage) {
  const match = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return color; // If the input is not a hex color, return it as is

  const hex = match[1];
  const rgb =
    hex.length === 3
      ? [
          parseInt(hex[0] + hex[0], 16),
          parseInt(hex[1] + hex[1], 16),
          parseInt(hex[2] + hex[2], 16),
        ]
      : [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16),
        ];

  const darkened = rgb.map((value) =>
    Math.max(0, value - Math.round(value * (percentage / 100)))
  );
  return `#${darkened.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

// Function to update the border color dynamically
function updateClockBorderColor(currentBlock) {
  const clockElement = document.getElementById("analogClock");
  if (currentBlock) {
    const darkerColor = darkenColor(currentBlock.color, 30); // 30% darker
    clockElement.style.border = `6px solid ${darkerColor}`;
  } else {
    clockElement.style.border = "6px solid black"; // Default fallback
  }
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

// Function to draw the clock hands
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
  drawHand(ctx, hour, radius * 0.5, radius * 0.07, borderColor);

  minute = (minute * Math.PI) / 30 + (second * Math.PI) / (30 * 60);
  drawHand(ctx, minute, radius * 0.8, radius * 0.07, borderColor);

  second = (second * Math.PI) / 30;
  drawHand(ctx, second, radius * 0.9, radius * 0.02, "#ff0000");
}

// Function to draw individual hands
function drawHand(ctx, pos, length, width, color) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0, 0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.rotate(-pos);
}

// Function to determine the current block
function getCurrentBlock(now) {
  const timeBlocks = [
    { name: "₡28.30 por kWh", color: "green", start: "20:01", end: "06:00" },
    { name: "₡67.65 por kWh", color: "orange", start: "06:01", end: "10:00" },
    { name: "₡165.01 por kWh", color: "red", start: "10:01", end: "12:30" },
    { name: "₡67.65 por kWh", color: "orange", start: "12:31", end: "17:30" },
    { name: "₡165.01 por kWh", color: "red", start: "17:31", end: "20:00" },
  ];

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
