const frame_height = 500;
const frame_width = 500;
const margins = {left: 100, right: 100, top: 20, bottom:20};

//bar chart chaos time commences here
const frame2 =
d3.select("#vis2")
    .append("svg")
        .attr("height", frame_height)
        .attr("width", frame_width)
        .attr("class", "frame");

d3.csv("data/bar-data.csv").then((data) => {

    const max_y = d3.max(data, (d) => {return parseInt(d.amount);});
    const y_scale =
    d3.scaleLinear()
        .domain([0, (max_y + 100)])
        .range([(frame_height - margins.bottom), 0]);

    const x_scale =
    d3.scaleBand()
        .domain(data.map( (d) => {return d.category;}))
        .range([0, (frame_width - margins.right), 0]);

    frame2.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
            .attr("transform", "translate(" + margins.left +  ")")
            .attr("x", (d) => {return (x_scale(d.category))})
            .attr("y", (d) => {return (y_scale(parseInt(d.amount)))})
            .attr("height", (d) => { return ( frame_height - y_scale(parseInt(d.amount)) - margins.bottom) })
            .attr("width", x_scale.bandwidth() - 5)
            .attr("class", "bar");

    frame2.append("g")
    .attr("transform", "translate(" + margins.left + ")")
    .call(
        d3.axisLeft()
            .scale(y_scale)
            .ticks(10)
        )
        .attr("font-size", "20px");

    frame2.append("g")
    .attr("transform", "translate(" + margins.left + "," + (frame_height - margins.bottom) + ")")
    .call(
        d3.axisBottom()
            .scale(x_scale)
            .ticks(10)
        );

    const tooltip =
    d3.select("#vis2")
        .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

    function handleMouseover(event, d) {
        tooltip.style("opacity", 1);
        d3.select(this).style("fill", "purple");
    }

    function handleMousemove(event, d) {
        tooltip.html("Category: " + d.category + "</br>Amount: " + d.amount)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 50) + "px");
    }

    function handleMouseleave(event, d) {
        tooltip.style("opacity", 0);
        frame2.selectAll(".bar")
            .style("fill", "black");
    }

    frame2.selectAll(".bar")
        .on("mouseover", handleMouseover)
        .on("mousemove", handleMousemove)
        .on("mouseleave", handleMouseleave);


});