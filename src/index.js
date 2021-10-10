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
    getData("https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=UMRN2NVDV6CCZJB2QM1SAAZMEXUHNFDV7D")
        .then(data => {
            let totalEthCir = data.result * (10 ** -18);
            console.log(totalEthCir);
        })

    let ethId = "ethereum";
    let ethSym = "eth";
    let ethName = "Ethereum";
    let unixToday = 1633901495; // Unix Timestamp Oct 10, 2021, 17:31:35 GMT-0400
    let unixPast = 1618176695; // Unix Timestamp Apr 11, 2021, 17:31:35 GMT-0400

    function timeConverter(unixTimestamp) {
        let a = new Date(unixTimestamp);
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        let year = a.getFullYear();
        let month = months[a.getMonth()];
        let date = a.getDate();
        let fullDate = date + ' ' + month + ' ' + year;
        return fullDate;
    }

    // Get ETH historical daily market data for past 6 months (price, volume, market cap)
    getData("https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=1618176695&to=1633901495")
        .then(data => {
            const prices = data.prices;
            const marketCap = data.market_caps;
            const totalVol = data.total_volumes;

            // Creating an array of UNIX Timestamps
            // const unixDates = [];


            prices.forEach(price => {
                let unixTimestamp = price[0];
                let date = timeConverter(unixTimestamp);
                price[0] = date;
            })

            marketCap.forEach(mktcap => {
                let unixTimestamp = mktcap[0];
                let date = timeConverter(unixTimestamp);
                mktcap[0] = date;
            })

            totalVol.forEach(vol => {
                let unixTimestamp = vol[0];
                let date = timeConverter(unixTimestamp);
                vol[0] = date;
            })

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

   
    

})