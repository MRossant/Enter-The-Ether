import drawChart from "./scripts/chart";

const PRICES = 'PRICES';
const MARKET = 'MARKET';
const VOLUME = 'VOLUME';
const unixOct1121 = 1633924800;
const unixApr1221 = 1618200000;
const unixOct1220 = 1602475200;
const unixOct1219 = 1570852800;
let curEthPrice = 0;
let curEthCir = 0;
let curEthCap = 0;
let curETHPerc1Hr = 0;
let curETHPerc24Hr = 0;
let curETHPerc7d = 0;


async function getData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}

function getETHPrice() {
    getData("https://api.etherscan.io/api?module=stats&action=ethprice&apikey=UMRN2NVDV6CCZJB2QM1SAAZMEXUHNFDV7D")
        .then(data => {
            curEthPrice = data.result.ethusd;
            const ethPriceHTML = document.getElementById("eth-price");
            ethPriceHTML.innerHTML = `<h1>Current ETH Price: $${curEthPrice}</h1>`
        })
}

function getGasPrice() {
    getData("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=UMRN2NVDV6CCZJB2QM1SAAZMEXUHNFDV7D")
        .then(data => {
            const ethGasHTML = document.getElementById("eth-gas");
            ethGasHTML.innerHTML = `<h1>Current Gas Price in Gwei: ${data.result.ProposeGasPrice}</h1>`
        })
}

function getETHCir() {
    getData("https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=UMRN2NVDV6CCZJB2QM1SAAZMEXUHNFDV7D")
        .then(data => {
            curEthCir = data.result * (10 ** -18);
            curEthCap = curEthCir * curEthPrice
            const ethCirHTML = document.getElementById("eth-cir");
            ethCirHTML.innerHTML = `<h1>Total ETH in circulation: ${curEthCir}</h1>`
        })
}

function getETHMarketCap() {
    getData("https://api.coingecko.com/api/v3/coins/ethereum?localization=false&market_data=true&community_data=false&developer_data=true")
        .then(data => {
            console.log(data);
            curEthCap = data.market_data.market_cap.usd;
            curETHPerc1Hr = data.market_data.price_change_percentage_1h_in_currency.usd;
            curETHPerc24Hr = data.market_data.price_change_percentage_24h_in_currency.usd;
            curETHPerc7d = data.market_data.price_change_percentage_7d_in_currency.usd;
            // console.log(curEthCap);
            const ethPriceChange1hrHTML = document.getElementById("eth-price-change-1hr");
            const ethPriceChange24hrHTML = document.getElementById("eth-price-change-24hr");
            const ethPriceChange7dHTML = document.getElementById("eth-price-change-7d");
            const ethCapHTML = document.getElementById("eth-cap");
            ethCapHTML.innerHTML = `<h1>Current Total Market Cap: $${curEthCap}</h1>`
            ethPriceChange1hrHTML.innerHTML = `<h1>1hr Price Change: ${curETHPerc1Hr} %</h1>`
            ethPriceChange24hrHTML.innerHTML = `<h1>24hr Price Change: ${curETHPerc24Hr} %</h1>`
            ethPriceChange7dHTML.innerHTML = `<h1>7d Price Change: ${curETHPerc7d} %</h1>`
        })
}

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

function getETHHistorical(value, unix) {
    getData(`https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=${unix}&to=1633924800`)
        .then(data => {
            console.log(data)
            const prices = data.prices;
            const marketCap = data.market_caps;
            const totalVol = data.total_volumes;
            const price = "Price";
            const volume = "Volume";
            const mktCap = "Market Capitalization";

            const pricesArr = [];
            const volArr = [];
            const mktCapArr = [];

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

            switch (value) {
                case PRICES: {
                    prices.forEach(price => {
                        let date = price[0];
                        let numString = price[1];
                        let parsedNum = parseInt(numString);
                        pricesArr.push({date: new Date(date), value: parsedNum})
                    })
                    break;
                }

                case MARKET: {
                    marketCap.forEach(price => {
                        let date = price[0];
                        let numString = price[1];
                        let parsedNum = parseInt(numString);
                        mktCapArr.push({date: new Date(date), value: parsedNum})
                    })
                    break;
                }

                case VOLUME: {
                    totalVol.forEach(price => {
                        let date = price[0];
                        let numString = price[1];
                        let parsedNum = parseInt(numString);
                        volArr.push({date: new Date(date), value: parsedNum})
                    })
                    break;
                }

                default: {
                    prices.forEach(price => {
                        let date = price[0];
                        let numString = price[1];
                        let parsedNum = parseInt(numString);
                        resultArr.push({date: new Date(date), value: parsedNum})
                    })
                }
            }

            switch (true) {
                case (pricesArr.length !== 0):
                    drawChart(pricesArr, price)
                    break;
                case (volArr.length !== 0):
                    drawChart(volArr, volume)
                    break;
                case (mktCapArr.length !== 0):
                    drawChart(mktCapArr, mktCap)
                    break;
            }
        })
}

document.addEventListener("DOMContentLoaded", () => {
    const enterBtn = document.querySelector("#cta-enter");
    enterBtn.addEventListener("click", e => {
        document.getElementById("fp-modal").style.display = "none";
        document.getElementById("home-page").style.display = "block";
    })

    // Get Current Eth Price
    getETHPrice();
    // Get Current Gas Price
    getGasPrice();
    // Get Current amount of ETH in circulation
    getETHCir();

    // Get Current ETH Market Cap
    getETHMarketCap();

    // Get ETH historical daily market data for past 6 months (price, volume, market cap)
    getETHHistorical(PRICES, unixApr1221);
})

window.addEventListener('load', () => {
    let selectedOption = document.getElementById("data-type");
    let selectedRange = document.getElementById("time-range");
    let submitBtn = document.getElementById("submit-chart");
    submitBtn.addEventListener("click", e => {
        let selectedValue = selectedOption.options[selectedOption.selectedIndex].value;
        console.log(selectedValue);
        let selectedDate = selectedRange.options[selectedRange.selectedIndex].value;
        console.log(selectedDate);


        switch (true) {
            case (selectedValue === "historical-prices" && selectedDate === "historical-six-months"): {
                getETHHistorical(PRICES, unixApr1221)
                break;
            }
            case (selectedValue === "historical-prices" && selectedDate === "historical-one-yr"): {
                getETHHistorical(PRICES, unixOct1220)
                break;
            }
            case (selectedValue === "historical-prices" && selectedDate === "historical-two-yrs"): {
                getETHHistorical(PRICES, unixOct1219)
                break;
            }
            case (selectedValue === "historical-marketcap" && selectedDate === "historical-six-months"): {
                getETHHistorical(MARKET, unixApr1221)
                break;
            }
            case (selectedValue === "historical-marketcap" && selectedDate === "historical-one-yr"): {
                getETHHistorical(MARKET, unixOct1220)
                break;
            }
            case (selectedValue === "historical-marketcap" && selectedDate === "historical-two-yrs"): {
                getETHHistorical(MARKET, unixOct1219)
                break;
            }
            case (selectedValue === "historical-volume" && selectedDate === "historical-six-months"): {
                getETHHistorical(VOLUME, unixApr1221)
                break;
            }
            case (selectedValue === "historical-volume" && selectedDate === "historical-one-yr"): {
                getETHHistorical(VOLUME, unixOct1220)
                break;
            }
            case (selectedValue === "historical-volume" && selectedDate === "historical-two-yrs"): {
                getETHHistorical(VOLUME, unixOct1219)
                break;
            }
            default: {
                getETHHistorical(PRICES, unixApr1221)
            }
        }
    })
})