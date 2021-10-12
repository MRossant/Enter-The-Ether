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

//     const svg = d3.select('svg')
//     svg.selectAll("svg > *").remove();
//     svg.attr("width", svgWidth).attr("height", svgHeight);

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

//     const tooltip = svg.append("g");

//     svg.on("touchmove mousemove", function(event) {
//         const {date, value} = bisect(d3.pointer(event, this)[0]);

//     tooltip
//         .attr("transform", `translate(${x(date)},${y(value)})`)
//         .call(callout, `${formatValue(value)}
//         ${formatDate(date)}`);
//     });

//     svg.on("touchend mouseleave", () => tooltip.call(callout, null));

//     return svg.node();
// }

// const callout = (g, value) => {
//     if (!value) return g.style("display", "none");

//   g
//     .style("display", null)
//     .style("pointer-events", "none")
//     .style("font", "10px sans-serif");

//   const path = g.selectAll("path")
//     .data([null])
//     .join("path")
//       .attr("fill", "white")
//       .attr("stroke", "black");

//   const text = g.selectAll("text")
//     .data([null])
//     .join("text")
//     .call(text => text
//       .selectAll("tspan")
//       .data((value + "").split(/\n/))
//       .join("tspan")
//         .attr("x", 0)
//         .attr("y", (d, i) => `${i * 1.1}em`)
//         .style("font-weight", (_, i) => i ? null : "bold")
//         .text(d => d));

//   const {x, y, width: w, height: h} = text.node().getBBox();

//   text.attr("transform", `translate(${-w / 2},${15 - y})`);
//   path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
// }

// function formatValue(value) {
//   return value.toLocaleString("en", {
//     style: "currency",
//     currency: "USD"
//   });
// }

// function formatDate(date) {
//   return date.toLocaleString("en", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//     timeZone: "UTC"
//   });
// }

// function bisect(mx) {
//     const bisect = d3.bisector(d => d.date).left;
//     return mx => {
//         const date = x.invert(mx);
//         const index = bisect(data, date, 1);
//         const a = data[index - 1];
//         const b = data[index];
//         return b && (date - a.date > b.date - date) ? b : a;
//   };
// }

// module.exports = {
//     drawChart,
//     callout,
//     formatValue,
//     formatDate,
//     bisect
// }