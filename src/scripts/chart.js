function drawChart(data, title) {
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

// function drawChart(data, title) {
//     const svgWidth = 1000, svgHeight = 500;
//     const margin = { top: 20, right: 20, bottom: 30, left: 88 };
//     const width = svgWidth - margin.left - margin.right;
//     const height = svgHeight - margin.top - margin.bottom;

//     const bisectDate = d3.bisector(function(d) { return d.date; }).left;

//     // Set the ranges
//     const x = d3.scaleTime().rangeRound([0, width]);
//     const y = d3.scaleLinear().rangeRound([height, 0]);

//     // Define the axes
//     const xAxis = d3.svg.axis().scale(x)
//         .orient("bottom").ticks(5);

//     const yAxis = d3.svg.axis().scale(y)
//         .orient("left").ticks(5);

//     // Define the line
//     var valueline = d3.svg.line()
//         .x(function(d) { return x(d.date); })
//         .y(function(d) { return y(d.close); });
        
//     // Adds the svg canvas
//     var svg = d3.select("#div-chart")
//         .append("svg")
//             .attr("width", width + margin.left + margin.right)
//             .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//             .attr("transform", 
//                 "translate(" + margin.left + "," + margin.top + ")");

//     var lineSvg = svg.append("g");                             // **********

//     var focus = svg.append("g")                                // **********
//         .style("display", "none");   

//     x.domain(d3.extent(data, function(d) { return d.date; }));
//     y.domain([0, d3.max(data, function(d) { return d.value; })]);

//     // Add the valueline path.
//     lineSvg.append("path")                                 // **********
//         .attr("class", "line")
//         .attr("d", valueline(data));

//         // Add the X Axis
//     svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis);

//     // Add the Y Axis
//     svg.append("g")
//         .attr("class", "y axis")
//         .call(yAxis);

//     // append the circle at the intersection              
//     focus.append("circle")                                
//         .attr("class", "y")                               
//         .style("fill", "none")                            
//         .style("stroke", "blue")                          
//         .attr("r", 4);     

//     // append the rectangle to capture mouse               
//     svg.append("rect")                                     
//         .attr("width", width)                              
//         .attr("height", height)                            
//         .style("fill", "none")                             
//         .style("pointer-events", "all")                    
//         .on("mouseover", function() { focus.style("display", null); })
//         .on("mouseout", function() { focus.style("display", "none"); })
//         .on("mousemove", mousemove);  
    
//     function mousemove() {                                 
//         var x0 = x.invert(d3.mouse(this)[0]),              
//             i = bisectDate(data, x0, 1),                   
//             d0 = data[i - 1],                              
//             d1 = data[i],                                  
//             d = x0 - d0.date > d1.date - x0 ? d1 : d0;     

//         focus.select("circle.y")                           
//             .attr("transform",                             
//                   "translate(" + x(d.date) + "," +         
//                                  y(d.value) + ")"); 
//     }
// }

// module.exports = drawChart;