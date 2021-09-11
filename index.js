require("dotenv").config();
const express = require("express");
const app = express();
const redis = require("redis");
const logger = require('morgan');
const axios = require("axios");
const PORT = process.env.PORT || 8008;
const stockAPI  = require('./api');

const client = redis.createClient({
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));

// Get all stocks data
app.get('/api/stocks', (req, res) => {
    // Try fetching the result from Redis first in case we have it cached
    return client.get('stocks',(err, result) => {
      // If that key exist in Redis store
      if (result) {
        const resultJSON = JSON.parse(result);
        console.log(result);
        return res.status(200).send(resultJSON);
      } else { 
        return axios.get(stockAPI.stocks)
          .then(response => {
            const responseJSON = response.data;
            client.setex(`stocks`, 60, JSON.stringify({ source: 'Redis Cache', ...responseJSON, }));
            return res.status(200).json({ source: 'Polygon API', ...responseJSON, });
          })
          .catch(err => {
            return res.json(err);
          });
      }
    });
  });
  
  
// const cache = (req, res, next) => {
//   client.get('stock_details', (error, result) => {
//     if (error) throw error;
//     if (result !== null) {
//       return res.json(JSON.parse(result));
//     } else {
//       return next();
//     }
//   });
// };

// Get stock details
app.get('/api/stocks/details', async(req, res) => {
  const { ticker } = req.query;
    // Try fetching the result from Redis first in case we have it cached
    return client.get(`stock_details : ${ticker}`, (err, result) => {
      // If that key exist in Redis store
      if (result) {
        const resultJSON = JSON.parse(result);
        console.log(result);
        return res.status(200).send(resultJSON);
      } else { 
        return axios.get(stockAPI.stockDetails(ticker))
          .then(response => {
            const responseJSON = response.data;
            client.setex(`stock_details : ${ticker}`, 60, JSON.stringify({ source: 'Redis Cache', ...responseJSON, }));
            return res.status(200).json({ source: 'Polygon API', ...responseJSON, });
          })
          .catch(err => {
            return res.json(err);
          });
      }
    });
});

  // Get previous day data
app.get('/api/stocks/prevday_data', (req, res) => {
    const { ticker } = req.query;
    // Try fetching the result from Redis first in case we have it cached
    return client.get(`stock_prevday_data : ${ticker}`, (err, result) => {
      // If that key exist in Redis store
      if (result) {
        const resultJSON = JSON.parse(result);
        console.log(result);
        return res.status(200).send(resultJSON);
      } else { 
        return axios.get(stockAPI.stockPrevDay(ticker))
          .then(response => {
            const responseJSON = response.data;
            client.setex(`stock_prevday_data : ${ticker}`, 60, JSON.stringify({ source: 'Redis Cache', ...responseJSON, }));
            return res.status(200).json({ source: 'Polygon API', ...responseJSON, });
          })
          .catch(err => {
            return res.json(err);
          });
      }
    });
  });


  app.listen(PORT, () => {
    console.log('Server listening on port: ', PORT);
  });

