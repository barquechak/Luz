function createTimeline() {
  // Define the tariff periods with their colors
  const tariffBlocks = [
    { start: 20, end: 6, color: "green" }, // Nocturno: 8 PM - 6 AM
    { start: 6, end: 10, color: "orange" }, // Valle: 6 AM - 10 AM
    { start: 10, end: 12.5, color: "red" }, // Punta: 10 AM - 12:30 PM
    { start: 12.5, end: 17.5, color: "orange" }, // Valle: 12:30 PM - 5:30 PM
    { start: 17.5, end: 20, color: "red" }, // Punta: 5:30 PM - 8 PM
  ];

  const tariffCosts = { nocturno: 28.3, valle: 67.65, punta: 165.01 };

  const totalBlocks = 24;

  //Get the timeline container
  const timeline = document.querySelector(".timeline");

  for (let i = 0; i < totalBlocks; i++) {
    const hour = i;

    const blockDiv = document.createElement("div");
    blockDiv.classList.add("tooltip"); // Add tooltip class
    blockDiv.id = `block${i + 1}`; // Add block ID

    if (i === 12 || i === 17) {
      // Create a container for split the colors of that hour
      const squareContainer = document.createElement("div");
      squareContainer.classList.add("square-container");

      // First half of the hour
      const leftHalf = document.createElement("div");
      leftHalf.classList.add("left-half");

      if (i === 12) {
        leftHalf.style.setProperty("--left-color", "red");
      } else if (i === 17) {
        leftHalf.style.setProperty("--left-color", "orange");
      }

      //Second half of the hour
      const rightHalf = document.createElement("div");
      rightHalf.classList.add("right-half");

      if (i === 12) {
        rightHalf.style.setProperty("--right-color", "orange");
      } else if (i === 17) {
        rightHalf.style.setProperty("--right-color", "red");
      }

      //The number in the timeline
      const content = document.createElement("div");
      content.classList.add("content");
      content.textContent = i + 1 === 13 ? 12 : 5;

      // Append the left side, right side and content to the container
      squareContainer.appendChild(leftHalf);
      squareContainer.appendChild(rightHalf);
      squareContainer.appendChild(content);

      //Add the square container to the block
      blockDiv.appendChild(squareContainer);
    }

    const convertedHour = i % 12 || 12;

    if (i !== 12 && i !== 17) {
      blockDiv.textContent = convertedHour; // Add block number
    }

    let color = "";

    for (const tariff of tariffBlocks) {
      // Handle crossing midnight for Nocturno
      if (
        (tariff.start > tariff.end &&
          (hour >= tariff.start || hour < tariff.end)) ||
        (hour >= tariff.start && hour < tariff.end)
      ) {
        color = tariff.color;
        break;
      }
    }

    if (i + 1 !== 13 || i + 1 !== 17) {
      blockDiv.style.setProperty("background-color", color); // Add block color
    }

    // Add data attribute with the color of the block
    blockDiv.setAttribute("data-color", color);
    // Add data attribute with the hour
    blockDiv.setAttribute("data-hour", convertedHour);
    //Add data attribute with am or pm
    blockDiv.setAttribute("data-hour-period", i + 1 > 12 ? "PM" : "AM");

    const tariffPrice =
      color === "red"
        ? tariffCosts.punta
        : color === "orange"
        ? tariffCosts.valle
        : tariffCosts.nocturno;

    // Add data attribute with the tariff price
    blockDiv.setAttribute("data-tariff-cost", tariffPrice);
    timeline.appendChild(blockDiv);
  }
  const arrowDiv = document.createElement("div");
  arrowDiv.classList.add("arrow");
  const timelineContainer = document.querySelector(".timeline-container");
  timelineContainer.appendChild(arrowDiv);
}

function updateTimeline() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();

  // Update the arrow position
  const currentTimeInSeconds =
    currentHour * 3600 + currentMinute * 60 + currentSecond;
  const totalSecondsInDay = 24 * 3600;
  const position = (currentTimeInSeconds / totalSecondsInDay) * 100;

  // Animate the arrow with Anime.js
  anime({
    targets: ".arrow",
    left: `${position}%`, // Position the arrow dynamically
    duration: 1000,
    easing: "linear",
  });
}

createTimeline();

// Update every second
setInterval(updateTimeline, 1000);

// Initial update when the page loads
updateTimeline();
