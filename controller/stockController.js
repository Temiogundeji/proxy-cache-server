const axios = require('axios');
const { client } = require('../index');
const  stockAPI  = require('../api');

const getStocks = async(req, res, next) => {
    try {
      console.log("Fetching data...");
      const { username } = req.params;
      const response = await axios.get(`https://api.github.com/users/${username}`);
      const data = await response.json();
  
      //set to redis
    //   redisClient.setex(3600, data);
  
      res.status(200).send({ data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  }

// const getStocks = async (req, res) => {
//     try {
//        const response = await axios.get(stockAPI.stocks);
//        const data = await response.json();
//        client.setex(60, data);
//        res.status(200).send({
//            stocks: data
//        });
//     }
//     catch(err){
//         console.error(err);
//         req.status(500).json({ error: err });
//     }
// };

 const cacheStocks = (req, res, next) => {
    client.get((err, stocks) => {
        if(error) throw err;
        if(stocks !== null){
            res.status(200).send({
                stocks
            });
        }
        else{
            next();
        }

    })
}

const getStockDetails = () => {
    
};

const getStockStatistics = () => {
    
}; 

module.exports = {
    getStocks, 
    cacheStocks,
    getStockDetails,
    getStockStatistics
}