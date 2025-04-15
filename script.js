d3.csv("sst_decades.csv").then(data => {
    data.forEach(d => {
      d.decade = +d.decade;
      d.mean_sst = +d.mean_sst;
      d.std_sst = +d.std_sst;
    });
  
    const svg = d3.select("#sstViz")
      .attr("width", 1000)
      .attr("height", 600);
  
    const gridCols = 5;
    const radiusScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.mean_sst))
      .range([20, 50]);
  
    const stdColor = d3.scaleLinear()
      .domain(d3.extent(data, d => d.std_sst))
      .range(["#bde0fe", "#ff0054"]);
  
    const groups = svg.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", (d, i) => {
        const x = (i % gridCols) * 180 + 100;
        const y = Math.floor(i / gridCols) * 180 + 80;
        return `translate(${x}, ${y})`;
      });
  
    // Main SST circle
    groups.append("circle")
      .attr("r", d => radiusScale(d.mean_sst))
      .attr("fill", "#69b3a2")
      .attr("opacity", 0.7);
  
    // Add concentric lines (e.g. for std)
    groups.append("circle")
      .attr("r", d => radiusScale(d.mean_sst) + d.std_sst * 10)
      .attr("stroke", d => stdColor(d.std_sst))
      .attr("stroke-width", 2)
      .attr("fill", "none");
  
    // Add a pink organic shape (optional, placeholder for nu)
    groups.append("path")
      .attr("d", "M10,0 Q15,30 0,20 Q-15,10 -10,0 Z")
      .attr("fill", "#e8a6d3")
      .attr("transform", "scale(1.5)")
      .attr("opacity", 0.4);
  });
  