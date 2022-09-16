function drawChart(data, title) {
    // console.log(data);
    const svgWidth = 1500, svgHeight = 500;
    const margin = { top: 20, right: 20, bottom: 30, left: 88 };
    const width = 1000 - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select('svg')
    svg.selectAll("svg > *").remove()
    svg.attr("width", svgWidth).attr("height", svgHeight)

    const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleTime().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([height, 0]);

    var parseTime = d3.timeFormat("%B %d, %Y");

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
        .attr("d", line)

    const bisectDate = d3.bisector(function(d) {return d.date; }).left,
        formatValue = d3.format(",.2f"),
        formatCurrency = function(d) {return "$" + formatValue(d)}

    const focus = g.append("g")
        .attr("class", "focus")
        .style("width", "auto")
        .style("display", "none")
        .style("position", "absolute")
        // .style("z-index", 1000)
    
    focus.append("circle")
        .attr("class", "y")
        .style("fill", "blueviolet")
        .style("stroke", "blueviolet")
        .attr("r", 3.5);

    focus.append("text")
        .attr("x", 9)
        .attr("dy", ".35em");

    g.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .style("position", "absolute")
    //   .style("margin-left", "5px")
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);

    
    function mousemove() {
        // debugger
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        // let valuesArr = [formatCurrency(d.value), d.date];
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")")
        // focus.select("text").html(`${formatCurrency(d.value)}` + `<br>` + `${d.date}`)
        focus.select("text").html(function() {
            return `${formatCurrency(d.value)}` + ` ${parseTime(d.date)}`
        });
    }
    
}

module.exports = drawChart;