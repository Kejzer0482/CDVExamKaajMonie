d3.csv("sst_decades.csv").then(data => {
    data.forEach(d => {
      d.decade = +d.decade;
      d.mean_sst = +d.mean_sst;
      d.std_sst = +d.std_sst;
    });
  
    const svg = d3.select("#sstViz")
      .attr("width", 1100)
      .attr("height", 650);
  
    // 🔳 Baggrundsfarve som rect (sort-blå nuance)
    svg.append("rect")
      .attr("width", 1100)
      .attr("height", 650)
      .attr("fill", "#1a1a1a");
  
    // ✨ Halo-glød
    svg.append("defs").append("filter")
      .attr("id", "glow")
      .append("feGaussianBlur")
      .attr("stdDeviation", 4);
  
    // Layout
    const gridCols = 6;
    const xSpacing = 160;
    const ySpacing = 160;
    const marginTop = 80;
    const marginLeft = 80;
  
    // Skalaer
    const radiusScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.mean_sst))
      .range([20, 50]);
  
    const stdColor = d3.scaleLinear()
      .domain(d3.extent(data, d => d.std_sst))
      .range(["#ffd6a5", "#ff595e"]); // pastel orange → rød
  
    // Grupper
    const groups = svg.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", (d, i) => {
        const x = (i % gridCols) * xSpacing + marginLeft;
        const y = Math.floor(i / gridCols) * ySpacing + marginTop;
        return `translate(${x}, ${y})`;
      });
  
    // 🔆 Halo-effekt
    groups.append("circle")
      .attr("r", d => radiusScale(d.mean_sst) + 10)
      .attr("fill", "none")
      .attr("stroke", "#fff5b7")
      .attr("stroke-width", 6)
      .attr("opacity", 0.3)
      .style("filter", "url(#glow)");
  
    // 🔴 STD afvigelsesring
    groups.append("circle")
      .attr("r", d => radiusScale(d.mean_sst) + d.std_sst * 10)
      .attr("stroke", d => stdColor(d.std_sst))
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("opacity", 0.6);
  
    // 🌍 Jordklode – roterer om sig selv
    groups.each(function(d) {
      const group = d3.select(this);
      const r = radiusScale(d.mean_sst);
      const img = group.append("image")
        .attr("xlink:href", "earth.png")
        .attr("width", r * 2)
        .attr("height", r * 2)
        .attr("x", -r)
        .attr("y", -r);
  
      animateRotation(img, 0, 0);
    });
  
    function animateRotation(selection, cx, cy) {
      let angle = 0;
      function rotate() {
        selection.transition()
          .duration(6000)
          .ease(d3.easeLinear)
          .attrTween("transform", () => {
            const interpolate = d3.interpolate(angle, angle + 360);
            return t => `rotate(${interpolate(t)}, ${cx}, ${cy})`;
          })
          .on("end", () => {
            angle += 360;
            rotate();
          });
      }
      rotate();
    }
  
    // 📅 Årtals-labels
    groups.append("text")
      .attr("y", radiusScale.range()[1] + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-family", "Georgia, serif")
      .style("fill", "#fefae0")
      .text(d => d.decade + "s");
  });
  