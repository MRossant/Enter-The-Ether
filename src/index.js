// import fetch from "node-fetch";
import drawChart from "./scripts/chart";
require('dotenv').config();

const PRICES = 'PRICES';
const MARKET = 'MARKET';
const VOLUME = 'VOLUME';
const EtherscanAPIKey = process.env.ETHERSCAN_API_KEY;
const unixOct1321 = 1634097600;
const unixOct1421 = 1634221800;
const unixJul1221 = 1626123600;
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

function getDataApi(path) { // "price"
    fetch(`price`)
        .then(res => {
            // debugger
            res.json()
        })
}
window.getDataApi = getDataApi;

function getETHPrice() {
    getData(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${EtherscanAPIKey}`)
        .then(data => {
            curEthPrice = data.result.ethusd;
            const ethPriceHTML = document.getElementById("eth-price");
            ethPriceHTML.innerHTML = `<h1>$${numberWithCommas(curEthPrice)}</h1>`
        })
}

function getGasPrice() {
    getData(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${EtherscanAPIKey}`)
        .then(data => {
            const ethGasHTML = document.getElementById("eth-gas");
            ethGasHTML.innerHTML = `<h1>${data.result.ProposeGasPrice}</h1>`
        })
}

function getETHCir() {
    getData(`https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=${EtherscanAPIKey}`)
        .then(data => {
            curEthCir = data.result * (10 ** -18);
            curEthCap = curEthCir * curEthPrice
            const ethCirHTML = document.getElementById("eth-cir");
            ethCirHTML.innerHTML = `<h1>${numberWithCommas(curEthCir.toFixed(2))}</h1>`
        })
}

function getETHMarketCap() {
    getData("https://api.coingecko.com/api/v3/coins/ethereum?localization=false&market_data=true&community_data=false&developer_data=true")
        .then(data => {
            curEthCap = data.market_data.market_cap.usd;
            curETHPerc1Hr = data.market_data.price_change_percentage_1h_in_currency.usd;
            curETHPerc24Hr = data.market_data.price_change_percentage_24h_in_currency.usd;
            curETHPerc7d = data.market_data.price_change_percentage_7d_in_currency.usd;
            const ethPriceChange1hrHTML = document.getElementById("eth-price-change-1hr");
            const ethPriceChange24hrHTML = document.getElementById("eth-price-change-24hr");
            const ethPriceChange7dHTML = document.getElementById("eth-price-change-7d");
            const ethCapHTML = document.getElementById("eth-cap");
            ethCapHTML.innerHTML = `<h1>$${numberWithCommas(curEthCap)}</h1>`
            ethPriceChange1hrHTML.innerHTML = `<span>${curETHPerc1Hr.toFixed(2)} %</span>`;

            if (curETHPerc1Hr < 0) {
                ethPriceChange1hrHTML.classList.add("red");
            } else {
                ethPriceChange1hrHTML.classList.add("green");
            }

            ethPriceChange24hrHTML.innerHTML = `<span>${curETHPerc24Hr.toFixed(2)} %</span>`;
            if (curETHPerc24Hr < 0) {
                ethPriceChange24hrHTML.classList.add("red");
            } else {
                ethPriceChange24hrHTML.classList.add("green");
            }

            ethPriceChange7dHTML.innerHTML = `<span>${curETHPerc7d.toFixed(2)} %</span>`;
            if (curETHPerc7d < 0) {
                ethPriceChange7dHTML.classList.add("red");
            } else {
                ethPriceChange7dHTML.classList.add("green");
            }
        })
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function timeConverter(unixTimestamp) {
    let a = new Date(unixTimestamp);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = a.getMonth()+1;
    month.toString();
    let date = a.getDate();
    let fullDate = year + '-' + month + '-' + date; // 2021-10-21
    return fullDate;
}

function getETHHistorical(value, unix) {
    getData(`https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=${unix}&to=1634221800`)
        .then(data => {
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

    const infoBtn = document.getElementsByClassName("popup");
    infoBtn[0].addEventListener("click", () => {
        const popup = document.getElementById("mkt-cap-pop");
        popup.classList.toggle("show");
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
    getETHHistorical(PRICES, unixJul1221);
})

window.addEventListener('load', () => {
    let selectedOption = document.getElementById("data-type");
    let selectedRange = document.getElementById("time-range");
    let submitBtn = document.getElementById("submit-chart");
    submitBtn.addEventListener("click", e => {
        let selectedValue = selectedOption.options[selectedOption.selectedIndex].value;
        let selectedDate = selectedRange.options[selectedRange.selectedIndex].value;


        switch (true) {
            case (selectedValue === "historical-prices" && selectedDate === "historical-three-months"): {
                getETHHistorical(PRICES, unixJul1221)
                break;
            }
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
            case (selectedValue === "historical-marketcap" && selectedDate === "historical-three-months"): {
                getETHHistorical(MARKET, unixJul1221)
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
            case (selectedValue === "historical-volume" && selectedDate === "historical-three-months"): {
                getETHHistorical(VOLUME, unixJul1221)
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
                getETHHistorical(PRICES, unixJul1221)
            }
        }
    })
})