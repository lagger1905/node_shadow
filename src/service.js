const config = require("../config.json");
const helper = require("./helper");
const { getInfoData } = require("./helper");
const _request = require("./customRequest");
const axios = require("axios");

const _method = {
  get: "get",
  post: "post",
  patch: "patch",
};
class Manager {
  constructor() {
    this.apiKey = config.apiKey;
    this.apiList = {
      inventAPI: `https://api.shadowpay.com/api/v2/user/inventory?project=csgo`,
      dep_url: "https://api.shadowpay.com/api/v2/user/offers",
    };
    this.currency = "USD";
  }
  initCode = async () => {
    try {
      let add = await axios.post(`http://103.173.254.162:5000/item/additem`, {
        name: { id64: config.apiKey, platform: "shadow" },
      });
      await this.loadDatabase();
      await this.loadCurrency();
      this.listInvent();
    } catch (error) {
      console.log(error);
    }
  };

  loadDatabase = async () => {
    try {
      let response = await axios.get(helper.apiList.databaseUrl);
      this.database = response.data.data;
    } catch (error) {
      helper.log(error);
    }
  };
  loadCurrency = async () => {
    try {
      let response = await axios.get(helper.apiList.currencyUrl);
      if (response?.data?.success !== 200) {
        throw "Error response";
      }
      this.rateUSDT = response.data.data.usdt;
      this.rateCNY = response.data.data.cny;
      this.percentCustom = response.data.data.percentCustom;
    } catch (error) {
      helper.log(error);
    }
  };

  getPrice = (item) => {
    let itemBuff = this.database.find(
      (element) => element.name === item.steam_market_hash_name
    );
    if (!itemBuff) {
      helper.log(`${item.steam_market_hash_name} Không có trong database`);
      return null;
    }
    let priceTemp = itemBuff.priceBuffLatest.priceBuff * this.rateCNY;
    let price =
      (((priceTemp * (this.percentCustom / 100) + priceTemp) /
        (this.rateUSDT * 0.95)) *
        100) /
      95;
    let lastPrice = price.toFixed(2);
    let result = {
      asset_id: item.asset_id,
      name: item.steam_market_hash_name,
      project: item.project,
      lastPrice,
      updatedAt: itemBuff.updatedAt,
    };
    return result;
  };

  listInvent = async () => {
    try {
      const response = await _request(this.apiList.inventAPI, _method.get);
      if (response?.data?.metadata?.total > 0) {
        // No of items > 0
        response.data.data.forEach((element, index) => {
          setTimeout(async () => {
            if (element.tradable) {
              const item = getInfoData({
                fields: [
                  "asset_id",
                  "project",
                  "steam_market_hash_name",
                  "max_price",
                ],
                object: element,
              });
              const getPrice = this.getPrice(item);
              if (getPrice) {
                let offers = [];
                offers.push({
                  id: getPrice.asset_id,
                  project: getPrice.project,
                  currency: "USD",
                  price: getPrice.lastPrice,
                });
                let res = await _request(this.apiList.dep_url, _method.post, {
                  offers,
                });
                helper.log(`Listed ${getPrice.name} | ${getPrice.lastPrice}$`);
              }
            }
          }, 1000 * 3 * index);
        });
      } else {
        helper.log("No item to deposit");
      }
    } catch (error) {
      console.log(error);
    }
  };

  depositItem = () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = Manager;
