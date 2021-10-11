document.addEventListener("DOMContentLoaded", () => {

    async function getData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
    }

    // // Get Current Eth Price
    // getData("https://api.etherscan.io/api?module=stats&action=ethprice&apikey=UMRN2NVDV6CCZJB2QM1SAAZMEXUHNFDV7D")
    //     .then(data => {
    //         const ethPriceHTML = document.getElementById("eth-price");
    //         ethPriceHTML.innerHTML = `<h1>Current ETH Price: ${data.result.ethusd}</h1>`
    //     })

    // // Get Current Gas Price
    // getData("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=UMRN2NVDV6CCZJB2QM1SAAZMEXUHNFDV7D")
    //     .then(data => {
    //         const ethPriceHTML = document.getElementById("eth-circulation");
    //         ethPriceHTML.innerHTML = `<h1>Current Gas Price in Gwei: ${data.result.ProposeGasPrice}</h1>`
    //     })
    
    // Get Current amount of ETH in circulation
    // getData("https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=UMRN2NVDV6CCZJB2QM1SAAZMEXUHNFDV7D")
    //     .then(data => {
    //         let totalEthCir = data.result * (10 ** -18);
    //         console.log(totalEthCir);
    //     })

    let ethId = "ethereum";
    let ethSym = "eth";
    let ethName = "Ethereum";
    let unixToday = 1633901495; // Unix Timestamp Oct 10, 2021, 17:31:35 GMT-0400
    let unixPast = 1618176695; // Unix Timestamp Apr 11, 2021, 17:31:35 GMT-0400

    function timeConverter(unixTimestamp) {
        let a = new Date(unixTimestamp);
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        let year = a.getFullYear();
        let month = a.getMonth()+1;
        month.toString();
        let date = a.getDate();
        let fullDate = year + '-' + month + '-' + date;
        return fullDate;
    }

    // const pricesData;
    // Get ETH historical daily market data for past 6 months (price, volume, market cap)
    getData("https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=1618176695&to=1633901495")
        .then(data => {
            console.log(data);
            const prices = data.prices;
            const marketCap = data.market_caps;
            const totalVol = data.total_volumes;

            const pricesArr = [];

            prices.forEach(price => {
                let unixTimestamp = price[0];
                let date = timeConverter(unixTimestamp);
                price[0] = date;
            })

            prices.forEach(price => {
                pricesArr.push({date: `${price[0]}`, value: `${price[1]}`})
            })
            window.prices = pricesArr;
            // pricesData = pricesArr;

            marketCap.forEach(mktcap => {
                let unixTimestamp = mktcap[0];
                let date = timeConverter(unixTimestamp);
                mktcap[0] = date;
            })
            window.marketCap = marketCap;

            totalVol.forEach(vol => {
                let unixTimestamp = vol[0];
                let date = timeConverter(unixTimestamp);
                vol[0] = date;
            })
            window.totalVol = totalVol;
            // console.log(Object.fromEntries(totalVol));

            // console.log(unixDates);

            // Creating an array of Dates (converted from Unix Timestamps)
            // const datesArr = [];
            // for (let i = 0; i < unixDates.length; i++) {
            //     let unixTimestamp = unixDates[i];
            //     let date = timeConverter(unixTimestamp);
            //     datesArr.push(date);
            // }
            // console.log(datesArr);


            // console.log(unixDates);

            // console.log(prices);
            // console.log(marketCap);
            // console.log(totalVol);
        })

        // console.log(data1);
        function chart() {
            debugger
        const svg = d3.select(DOM.svg(width, height))
            .style("-webkit-tap-highlight-color", "transparent")
            .style("overflow", "visible");

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);
  
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line);

        const tooltip = svg.append("g");

        svg.on("touchmove mousemove", function(event) {
        const {date, value} = bisect(d3.pointer(event, this)[0]);

        tooltip
            .attr("transform", `translate(${x(date)},${y(value)})`)
            .call(callout, `${formatValue(value)}
        ${formatDate(date)}`);
        });

        svg.on("touchend mouseleave", () => tooltip.call(callout, null));

        return svg.node();
    }

    callout = (g, value) => {
        if (!value) return g.style("display", "none");

        g
            .style("display", null)
            .style("pointer-events", "none")
            .style("font", "10px sans-serif");

        const path = g.selectAll("path")
            .data([null])
            .join("path")
            .attr("fill", "white")
            .attr("stroke", "black");

        const text = g.selectAll("text")
            .data([null])
            .join("text")
            .call(text => text
            .selectAll("tspan")
            .data((value + "").split(/\n/))
            .join("tspan")
                .attr("x", 0)
                .attr("y", (d, i) => `${i * 1.1}em`)
                .style("font-weight", (_, i) => i ? null : "bold")
                .text(d => d));

        const {x, y, width: w, height: h} = text.node().getBBox();

        text.attr("transform", `translate(${-w / 2},${15 - y})`);
        path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
    }

    x = d3.scaleUtc()
        .domain(d3.extent(data, d => d.date))
        .range([margin.left, width - margin.right])
    
    y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top])

    xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
    
    yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y))

    line = d3.line()
        .curve(d3.curveStep)
        .defined(d => !isNaN(d.value))
        .x(d => x(d.date))
        .y(d => y(d.value))
    
    function formatValue(value) {
        return value.toLocaleString("en", {
            style: "currency",
            currency: "USD"
        });
    }

    function formatDate(date) {
        return date.toLocaleString("en", {
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC"
        });
    }

    function bisect() {
        const bisect = d3.bisector(d => d.date).left;
        return mx => {
            const date = x.invert(mx);
            const index = bisect(data, date, 1);
            const a = data[index - 1];
            const b = data[index];
            return b && (date - a.date > b.date - date) ? b : a;
        };
    }

    height = 500;
    margin = ({top: 20, right: 30, bottom: 30, left: 40});
    chart();
})