const frame_height = 500;
const frame_width = 500;
const margins = {left: 100, right: 100, top: 20, bottom:20};
const S_MARGINS = {left: 30, right: 30, top: 30, bottom:30};

const FRAME1 = d3.select("#vis1")
                .append("svg")
                    .attr("height", frame_height)
                    .attr("width", frame_width)
                    .attr("class", "frame");

function handleOver(d) {
    d.style.fill = "red";
}

function handleLeave(d) {
    d.style.fill = "grey";
}

function handleClick(d, x, y) {
    if (d.style.stroke === "black") {
        d.style.stroke = "none";
    }
    else {
        d.style.stroke = "black"
    }

    let text = document.getElementById("text");
    text.style.display = "block";
    text.innerHTML = "You just clicked point (" + Math.round(x) + "," + Math.round(y) + ").";
}

//Generates the points on the scatterplot, and returns X and Y scales for later use
(function() {
    d3.csv("data/scatter-data.csv").then((data) => {

        const MAX_X = d3.max(data, (d) => {return parseInt(d.x);})

        const X_SCALE = d3.scaleLinear()
                            .domain([0, MAX_X + 1])
                            .range([0, frame_width - S_MARGINS.left - S_MARGINS.right]);

        const MAX_Y = d3.max(data, (d) => {return parseInt(d.y);})

        const Y_SCALE = d3.scaleLinear()
                            .domain([0, MAX_Y + 1])
                            .range([frame_height - S_MARGINS.top - S_MARGINS.bottom, 0]);
        
        //Generates all points in the csv
        FRAME1.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", (d) => { return (X_SCALE(d.x) + S_MARGINS.left); })
                .attr("cy", (d) => { return (Y_SCALE(d.y) + S_MARGINS.top); })
                .attr("r", 10)
                .attr("fill", "grey")
                .attr("class", "point")
                

        //Generates the x axis
        FRAME1.append("g")
            .attr("transform", "translate(" + S_MARGINS.left + 
                "," + (frame_height - S_MARGINS.bottom) + ")") 
            .call(d3.axisBottom(X_SCALE).ticks(10)) 
                .attr("font-size", '18px');

        //Generates the y axis
        FRAME1.append("g")
        .attr("transform", "translate(" + S_MARGINS.left + 
            "," + S_MARGINS.top + ")")
        .call(d3.axisLeft().scale(Y_SCALE).ticks(10))
            .attr("font-size", "18px");

        //Add event listeners to points
        function addListeners() {
            FRAME1.selectAll(".point")
            .on("mouseover", function () {
                handleOver(this)})
            .on("mouseleave", function () {
                handleLeave(this)})
            .on("click", function () {
                handleClick(this, X_SCALE.invert(d3.select(this).attr("cx") - S_MARGINS.left), Y_SCALE.invert(d3.select(this).attr("cy") - S_MARGINS.top))
            })
        }
        addListeners();

        //Allows the user to create points
        function submitClick() {
            let x = document.getElementById("xvals").value;
            let y = document.getElementById("yvals").value;

            FRAME1.append("circle")
                .attr("cx", (d) => { return (X_SCALE(x) + S_MARGINS.left); })
                .attr("cy", (d) => { return (Y_SCALE(y) + S_MARGINS.top); })
                .attr("r", 10)
                .attr("fill", "grey")
                .attr("class", "point");

            addListeners();
        }
        document.getElementById("button").addEventListener('click', submitClick);
    });
})()


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