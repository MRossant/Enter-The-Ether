const express = require('express'); // web framework
// const fetch = require('node-fetch'); // for making AJAX requests
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path');

// put environmental variables defined in .env file on process.env
require('dotenv').config(); 

const app = express();

// serve files / assets from the dist folder
app.use(express.static('dist')); 

// in response to `GET /` requests, send the file `dist/index.html`
app.get('/', (request, response) => {
    debugger
//   response.sendFile(`${__dirname}/dist/index.html`);
});

// Heroku sets process.env.PORT in production; use 8000 in dev
const PORT = process.env.PORT || 8000;
// start up a server listening at PORT; on success, log a message
app.listen(PORT, () => {
  console.log(`Listening at localhost:${PORT}`);
});

// console.log(process.env.API_KEY)

// app.get('/cors', (request, response) => {
//   console.log(`Fetching: ${request.query.url}`);

//   fetch(request.query.url) // AJAX request to URL provided in query string
//     .then(apiResponse => apiResponse.json()) // parse response as JSON
//     .then(data => response.send(data)) // send parsed data to frontend
//     .catch(error => response.send(error));
// });

// Get Eth Gas
// app.get('/api/gas', (request, response) => {
//   const urlStart = 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey';
//   const apiKey = process.env.API_KEY; // from .env (dev) or Heroku
//   const url = `${urlStart}=${apiKey}`;

//   console.log(`Fetching: ${url}`);

//   fetch(url) // AJAX request to API
//     .then(apiResponse => apiResponse.json())
//     .then(data => response.send(data))
//     .catch(error => response.send(error));
// });

// Get ETH Price
app.get('/price', (request, response) => {
    debugger;
  const urlStart = 'https://api.etherscan.io/api?module=stats&action=ethprice&apikey';
  const apiKey = process.env.ETHERSCAN_API_KEY; // from .env (dev) or Heroku
  debugger;
  const url = `${urlStart}=${apiKey}`;

  console.log(`Fetching: ${url}`);

  fetch(url) // AJAX request to API
    .then(apiResponse => apiResponse.json())
    .then(data => response.send(data))
    .catch(error => response.send(error));
});

// Get ETH Circulation
// app.get('/api/cir', (request, response) => {
//   const urlStart = 'https://api.etherscan.io/api?module=stats&action=ethsupply&apikey';
//   const apiKey = process.env.API_KEY; // from .env (dev) or Heroku
//   const url = `${urlStart}=${apiKey}`;

//   console.log(`Fetching: ${url}`);

//   fetch(url) // AJAX request to API
//     .then(apiResponse => apiResponse.json())
//     .then(data => response.send(data))
//     .catch(error => response.send(error));
// });