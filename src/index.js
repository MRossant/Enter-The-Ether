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

    // Get ETH historical market data for past 6 months
    let ethId = "ethereum";
    let ethSym = "eth";
    let ethName = "Ethereum";
    let unixToday = 1633901495; // Unix Timestamp Oct 10, 2021, 17:31:35 GMT-0400
    let unixPast = 1618176695; // Unix Timestamp Apr 11, 2021, 17:31:35 GMT-0400
    getData("https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=1618176695&to=1633901495")
        .then(data => {
            console.log(data);
        })

})