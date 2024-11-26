function createTooltipContent(hour, hourPeriod, color, tariffCost) {
  return `
    <div class="no-darkreader data-darkreader-ignore">
      <div class="hour-period-container no-darkreader">${hour} ${hourPeriod}</div><br/>
      <div class="color-tariff-container no-darkreader">
        <div class="tooltip-square no-darkreader" style="background-color: ${color}; border: 1px solid white !important;" data-darkreader-ignore></div>
        Costo Tarifa (₡): ${tariffCost}
      </div>
    </div>
  `;
}

//Create the ToolTips for each block of hours in the timeline
function createTooltips() {
  const totalBlocks = 24;

  for (let i = 0; i < totalBlocks; i++) {
    const tooltipDiv = document.getElementById(`block${i + 1}`);
    const color = tooltipDiv.dataset.color;
    const hour = tooltipDiv.dataset.hour;
    const tariffCost = tooltipDiv.dataset.tariffCost;
    const hourPeriod = tooltipDiv.dataset.hourPeriod;
    // Create the tooltip container
    const tooltipContainer = document.createElement("div");
    tooltipContainer.classList.add("custom-tooltip");
    document.body.appendChild(tooltipContainer);

    //Get the html for the tooltip div specifically for the current hour
    const divContent = createTooltipContent(
      hour,
      hourPeriod,
      color,
      tariffCost
    );

    // Add event listeners to show and hide the tooltip
    tooltipDiv.addEventListener("mouseenter", () =>
      updateTooltipContent(tooltipContainer, divContent, tooltipDiv)
    );
    tooltipDiv.addEventListener("mouseleave", () =>
      hideTooltip(tooltipContainer)
    );
  }
}

function updateTooltipContent(tooltipContainer, content, tooltipDiv, event) {
  tooltipContainer.innerHTML = content;

  const rect = tooltipDiv.getBoundingClientRect();

  // Temporarily make the tooltip visible to get its width
  tooltipContainer.style.visibility = "hidden"; // Prevent it from showing
  tooltipContainer.style.display = "block"; // Make sure it's rendered in the DOM

  const tooltipWidth = tooltipContainer.offsetWidth;

  // Now you can hide it again if you don't want it visible
  tooltipContainer.style.visibility = "visible"; // Make it visible again
  tooltipContainer.style.display = "none"; // Hide it if you want

  const windowWidth = window.innerWidth;

  // Check if the tooltip is too close to the right edge of the screen
  if (rect.left + tooltipWidth > windowWidth - 30) {
    // If the tooltip is too close to the right, adjust its position to the left
    const offset = rect.left + tooltipWidth - windowWidth; // The amount it exceeds the screen width
    tooltipContainer.style.left = rect.left - offset - tooltipWidth / 5 + "px"; // Move it to the left by the offset
  } else {
    // If the tooltip fits on the screen, position it normally
    tooltipContainer.style.left = rect.left + "px";
  }

  tooltipContainer.style.top = rect.bottom + 5 + "px"; // Slightly below the target
  // Display the tooltip
  tooltipContainer.style.display = "block";
}

// Hide the tooltip when mouse leaves
function hideTooltip(tooltipContainer) {
  tooltipContainer.style.display = "none";
}

createTooltips();
