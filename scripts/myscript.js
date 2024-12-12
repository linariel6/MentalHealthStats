

// Initialize SVG and grid
const boroughs = ["MANHATTAN", "BROOKLYN", "BRONX", "QUEENS", "STATEN_ISLAND"];
const gridWidth = 600; // Total grid width
const gridHeight = 580; // Total grid height including space for rows and slider
const cellSize = gridWidth / 3 - 10; // Ensure cells are square
const spacing = 10; // Horizontal spacing between cells
const rowSpacing = 75; // Increased spacing between rows

const svg = d3.select("#grid")
  .attr("width", gridWidth)
  .attr("height", gridHeight);

// Draw the grid
boroughs.forEach((borough, i) => {
  const isSecondRow = i >= 3; // Check if borough is in the second row
  const row = isSecondRow ? 1 : 0;
  const col = isSecondRow ? i - 3 : i;

  // Center the last two boroughs in the second row
  const xOffset = isSecondRow ? (gridWidth - 2 * (cellSize + spacing)) / 2 : 0;

  // Draw rectangle for each borough
  svg.append("rect")
    .attr("x", col * (cellSize + spacing) + xOffset) // Add spacing and center second row
    .attr("y", row * (cellSize + rowSpacing) + 70) // Push down for labels and add row spacing
    .attr("width", cellSize)
    .attr("height", cellSize) // Make grid square
    .attr("fill", "#ddd")
    .attr("stroke", "#000") // Thick edge lines
    .attr("stroke-width", 3.5) // Edge line thickness
    .attr("class", `borough-cell ${borough}`);

  // Add label above the rectangle
  svg.append("text")
    .attr("x", col * (cellSize + spacing) + xOffset + cellSize / 2) // Center label horizontally
    .attr("y", row * (cellSize + rowSpacing) + 50) // Position label above the grid
    .attr("text-anchor", "middle")
    .text(borough)
    .attr("class", `borough-label ${borough}`);

  // Add count label outside the rectangle (below the bottom-right edge)
  svg.append("text")
    .attr("x", col * (cellSize + spacing) + xOffset + cellSize - 5) // Align to bottom-right
    .attr("y", row * (cellSize + rowSpacing) + 70 + cellSize + 15) // Position below the grid
    .attr("text-anchor", "end") // Right-aligned text
    .attr("font-size", "10px") // Smaller font size
    .attr("font-weight", "bold") // Bold text
    .attr("class", `count-label ${borough}`)
    .text("Count: 0"); // Default count is 0
});

// Update function to draw dots and update count
function updateGrid(data, hour) {
  // Update the displayed current hour
  d3.select("#hour-display").text(`Complaints at Hour ${hour} (counting from ${hour}:00 to ${hour + 1}:00)`);

  const hourData = data.filter(d => d.HOUR === hour);

  // Clear existing dots with a transition
  svg.selectAll(".complaint-dot")
    .transition()
    .duration(300) // Smoothly fade out existing dots
    .style("opacity", 0)
    .remove();

  // Update count labels and add dots
  hourData.forEach(d => {
    const complaints = d.COMPLAINTS;
    const borough = d.BORO_NM.replace(" ", "_");

    // Update count label
    svg.select(`.count-label.${borough}`)
      .transition()
      .duration(300) // Smoothly update count label
      .text(`Count: ${complaints}`);

    const boroughIndex = boroughs.indexOf(borough);
    const isSecondRow = boroughIndex >= 3;
    const row = isSecondRow ? 1 : 0;
    const col = isSecondRow ? boroughIndex - 3 : boroughIndex;

    const xOffset = isSecondRow ? (gridWidth - 2 * (cellSize + spacing)) / 2 : 0;

    for (let i = 0; i < complaints; i++) {
      const randomX = Math.random() * (cellSize - 20) + col * (cellSize + spacing) + xOffset + 10;
      const randomY = Math.random() * (cellSize - 20) + row * (cellSize + rowSpacing) + 80;

      svg.append("circle")
        .attr("cx", randomX)
        .attr("cy", randomY)
        .attr("r", 3)
        .attr("fill", "red")
        .attr("class", "complaint-dot")
        .style("opacity", 0)
        .transition()
        .duration(300) // Smoothly fade in dots
        .style("opacity", 1);
    }
  });
}

// Initialize with hour 0
updateGrid(data, 0);

// Add interactivity with the slider
d3.select("#time-slider")
  .style("margin-top", "20px")
  .on("input", function () {
    const selectedHour = +this.value;
    updateGrid(data, selectedHour);
  });
