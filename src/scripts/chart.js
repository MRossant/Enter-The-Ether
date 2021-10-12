function drawChart(data, title) {
    const svgWidth = 1000, svgHeight = 500;
    const margin = { top: 20, right: 20, bottom: 30, left: 88 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select('svg')
    svg.selectAll("svg > *").remove();
    svg.attr("width", svgWidth).attr("height", svgHeight);

    const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleTime().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([height, 0]);

    const line = d3.line()
        .x(function(d) {
            return x(d.date)
        })
        .y(function(d) {
            return y(d.value)
        })

    x.domain(d3.extent(data, function(d) {
        return d.date
    }));

    y.domain(d3.extent(data, function(d) {
        return d.value
    }));

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove();

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text(`${title} ($)`);

    g.append("path")
        .datum(data).attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
}

module.exports = drawChart;

// Trying to add ToolTip below. Code not working.
// function drawChart(data, title) {
//     const svgWidth = 1000, svgHeight = 500;
//     const margin = { top: 20, right: 20, bottom: 30, left: 88 };
//     const width = svgWidth - margin.left - margin.right;
//     const height = svgHeight - margin.top - margin.bottom;

//     const svg = d3.select("chart")
//         .selectAll("svg > *").remove()
//         .append("svg")
//         .attr("width", svgWidth).attr("height", svgHeight)
//         .on("mouseover", mouseover)
//         .on("mousemove", mousemove)
//         .on("mouseleave", mouseleave)

//     const g = svg.append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     const x = d3.scaleTime().rangeRound([0, width]);
//     const y = d3.scaleLinear().rangeRound([height, 0]);

//     const line = d3.line()
//         .x(function(d) {
//             return x(d.date)
//         })
//         .y(function(d) {
//             return y(d.value)
//         })

//     x.domain(d3.extent(data, function(d) {
//         return d.date
//     }));

//     y.domain(d3.extent(data, function(d) {
//         return d.value
//     }));

//     g.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x))
//         .select(".domain")
//         .remove();

//     g.append("g")
//         .call(d3.axisLeft(y))
//         .append("text")
//         .attr("fill", "#000")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 6)
//         .attr("dy", "0.71em")
//         .attr("text-anchor", "end")
//         .text(`${title} ($)`);

//     g.append("path")
//         .datum(data).attr("fill", "none")
//         .attr("stroke", "steelblue")
//         .attr("stroke-linejoin", "round")
//         .attr("stroke-linecap", "round")
//         .attr("stroke-width", 1.5)
//         .attr("d", line);

//     const Tooltip = d3.select("#chart")
//         .append("div")
//         .style("opacity", 0)
//         .attr("class", "tooltip")
//         .style("background-color", "white")
//         .style("border", "solid")
//         .style("border-width", "2px")
//         .style("border-radius", "5px")
//         .style("padding", "5px")

//     const mouseover = function(d) {
//         Tooltip
//             .style("opacity", 1)
//             d3.select(this)
//             .style("stroke", "black")
//             .style("opacity", 1) 
//     }

//     const mousemove = function(d) {
//         Tooltip
//         .html("The exact value of<br>this cell is: " + d.value)
//         .style("left", (d3.mouse(this)[0]+70) + "px")
//         .style("top", (d3.mouse(this)[1]) + "px")
//     }

//     const mouseleave = function(d) {
//         Tooltip
//         .style("opacity", 0)
//         d3.select(this)
//         .style("stroke", "none")
//         .style("opacity", 0.8)
//     }

// }

// module.exports = drawChart;