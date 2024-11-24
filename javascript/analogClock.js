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

// Function to draw the glow effect around the entire clock// Function to draw the glow effect around the entire clock
function drawGlow(ctx, radius) {
  // Create a radial gradient for the glow effect
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
  grad.addColorStop(0, "rgba(255, 255, 255, 0.6)"); // Stronger glow near the center
  grad.addColorStop(0.7, "rgba(255, 255, 255, 0.1)"); // Fade towards the middle
  grad.addColorStop(1, "rgba(255, 255, 255, 0)"); // Fully transparent at the edges

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI); // Apply the glow around the whole clock face
  ctx.fillStyle = grad; // Use the radial gradient as the fill
  ctx.fill();
}

// Function to draw the clock face (the outer circle)
function drawFace(ctx, radius) {
  const grad = ctx.createRadialGradient(
    0,
    0,
    radius * 0.95,
    0,
    0,
    radius * 1.05
  );
  grad.addColorStop(0, "#333"); // Dark outer ring
  grad.addColorStop(0.5, "white"); // Lighter middle ring
  grad.addColorStop(1, "#333"); // Dark inner ring

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "transparent"; // Transparent background for clock
  ctx.fill();
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius * 0.1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI); // Central dot
  ctx.fillStyle = "#333"; // Central dot color
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
    ctx.fillStyle = "white"; // Numbers in white color
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius * 0.85);
    ctx.rotate(-ang);
  }
}

// Function to draw the clock hands (hour, minute, second)
function drawTime(ctx, radius) {
  drawFace(ctx, radius);
  drawNumbers(ctx, radius);
  drawGlow(ctx, radius); // Add glow effect behind everything else

  const now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();

  // Draw hour, minute, and second hands with solid colors
  hour =
    ((hour % 12) * Math.PI) / 6 +
    (minute * Math.PI) / (6 * 60) +
    (second * Math.PI) / (360 * 60);
  drawHand(ctx, hour, radius * 0.5, radius * 0.07, "#ffffff"); // White hour hand

  minute = (minute * Math.PI) / 30 + (second * Math.PI) / (30 * 60);
  drawHand(ctx, minute, radius * 0.8, radius * 0.07, "#ffffff"); // White minute hand

  second = (second * Math.PI) / 30;
  drawHand(ctx, second, radius * 0.9, radius * 0.02, "#ff0000"); // Red second hand for contrast
}

// Function to draw individual hands (hour, minute, second)
function drawHand(ctx, pos, length, width, color) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0, 0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.strokeStyle = color; // Set the color for the hands
  ctx.stroke();
  ctx.rotate(-pos); // Reset the rotation
}

// Start the clock by calling drawClock
function drawClock() {
  // Clear the clock hands area but keep the background and numbers
  ctx.clearRect(-radius, -radius, 2 * radius, 2 * radius);
  drawTime(ctx, radius);
  requestAnimationFrame(drawClock); // Call drawClock again for animation
}

// Start the clock
drawClock();
