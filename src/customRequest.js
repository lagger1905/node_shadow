const { default: axios } = require("axios");
const config = require("../config.json");

const defaults = {
  headers: {
    Accept: "application/json,application/x-www-form-urlencoded",
    "Accept-Encoding": "gzip,deflate,compress",
    Referer: "https://shadowpay.com/",
  },
};

if (defaults && defaults.headers) {
  defaults.headers["Authorization"] = `Bearer ${config.apiKey}`;
}

async function _request(input, method, body) {
  try {
    let _config = {
      method: method,
      maxBodyLength: Infinity,
      url: input,
      headers: defaults.headers,
      data: body ? body : {},
    };
    const response = await axios.request(_config);
    return response;
  } catch (error) {
    console.log({
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    });
  }
}

module.exports = _request;
