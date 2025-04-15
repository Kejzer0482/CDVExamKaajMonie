d3.csv("sst_decades.csv").then(data => {
    data.forEach(d => {
      d.decade = +d.decade;
      d.mean_sst = +d.mean_sst;
      d.std_sst = +d.std_sst;
    });
  
    const svg = d3.select("#sstViz")
      .attr("width", 1100)
      .attr("height", 650);
  
    // Layout settings
    const gridCols = 6;
    const xSpacing = 160;
    const ySpacing = 160;
    const marginTop = 80;
    const marginLeft = 80;
  
    // Scales
    const radiusScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.mean_sst))
      .range([20, 50]);
  
    const stdColor = d3.scaleLinear()
      .domain(d3.extent(data, d => d.std_sst))
      .range(["#f9dcc4", "#c9184a"]); // varm pastel til kraftig rød
  
    // Group containers
    const groups = svg.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", (d, i) => {
        const x = (i % gridCols) * xSpacing + marginLeft;
        const y = Math.floor(i / gridCols) * ySpacing + marginTop;
        return `translate(${x}, ${y})`;
      });
  
    // Mean SST Circle
    groups.append("circle")
      .attr("r", d => radiusScale(d.mean_sst))
      .attr("fill", "#a4c3b2")
      .attr("opacity", 0.8);
  
    // STD deviation ring
    groups.append("circle")
      .attr("r", d => radiusScale(d.mean_sst) + d.std_sst * 10)
      .attr("stroke", d => stdColor(d.std_sst))
      .attr("stroke-width", 2)
      .attr("fill", "none");
  
    // Organic blob
    groups.append("path")
      .attr("d", "M10,0 Q15,30 0,20 Q-15,10 -10,0 Z")
      .attr("fill", "#ffcad4")
      .attr("transform", () => {
        const scale = 1 + Math.random() * 0.5;
        const rotate = Math.random() * 360;
        return `scale(${scale}) rotate(${rotate})`;
      })
      .attr("opacity", 0.35);
  
    // Decade label
    groups.append("text")
      .attr("y", radiusScale.range()[1] + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-family", "Georgia, serif")
      .style("fill", "#333")
      .text(d => d.decade + "s");
  });
  