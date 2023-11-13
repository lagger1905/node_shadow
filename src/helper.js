const dateFormat = require("dateformat");
const util = require("util");
const config = require("../config.json");
const _ = require("lodash");
module.exports = {
  apiList: {
    databaseUrl: "http://103.173.254.162:5000/item/api/buff/items",
    currencyUrl: "http://103.173.254.162:3000/get-currency",
  },
  discordChannel: "",
  statusMessage: {
    fail: "Failed",
  },
  log(d, color = "\x1b[0m") {
    console.log(
      color +
        "[" +
        dateFormat(new Date(), "yyyy-mm-dd H:MM:ss.l") +
        "] " +
        util.format(d),
      "\x1b[37m"
    );
  },
  async wait(mli) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve();
      }, mli * 1000);
    });
  },
};

module.exports.getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
