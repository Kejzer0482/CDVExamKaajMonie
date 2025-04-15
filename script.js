// script.js

// Indlæs data og opsæt visualisering

d3.csv("sst_nordatlanten.csv").then(data => {
    data.forEach(d => {
        d.year = +d.year;
        d.sst = +d.sst;
    });
    
    const svg = d3.select("#sstViz"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([margin.left, width - margin.right]);
    
    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.sst) - 0.5, d3.max(data, d => d.sst) + 0.5])
        .range([height - margin.bottom, margin.top]);
    
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.sst));
    
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickFormat(d3.format("d")));
    
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));
    
    const path = svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("d", line);
    
    // Scrollama opsætning
    const steps = document.querySelectorAll("section");
    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        steps.forEach(section => {
            if (
                section.offsetTop <= scrollPosition &&
                section.offsetTop + section.offsetHeight > scrollPosition
            ) {
                section.classList.add("visible");
                section.classList.remove("hidden");
                const stepId = section.getAttribute("id");

                if (stepId === "context") {
                    const warmYears = data.filter(d => d.sst > 20);
                    svg.selectAll(".dot")
                        .data(warmYears)
                        .enter()
                        .append("circle")
                        .attr("class", "dot")
                        .attr("cx", d => x(d.year))
                        .attr("cy", d => y(d.sst))
                        .attr("r", 5)
                        .attr("fill", "red");
                }

                if (stepId === "viz") {
                    const futureData = [
                        { year: 2025, sst: data.find(d => d.year === 2025).sst },
                        { year: 2035, sst: data.find(d => d.year === 2035).sst }
                    ];
                    const trendLine = d3.line()
                        .x(d => x(d.year))
                        .y(d => y(d.sst));

                    svg.append("path")
                        .datum(futureData)
                        .attr("fill", "none")
                        .attr("stroke", "orange")
                        .attr("stroke-width", 2)
                        .style("stroke-dasharray", "4 2")
                        .attr("d", trendLine);
                }

                if (stepId === "reflection") {
                    svg.append("text")
                        .attr("x", width / 2)
                        .attr("y", height / 2)
                        .attr("text-anchor", "middle")
                        .style("font-size", "1.2em")
                        .style("fill", "#444")
                        .text("Et varmt minde fra Nordatlanten...");
                }
            }
        });
    });
});