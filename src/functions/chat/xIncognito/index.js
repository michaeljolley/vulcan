const OBSWebSocket = require("obs-websocket-js");

require("dotenv").config();

module.exports = async function (context, req) {
  const obs = new OBSWebSocket();
  obs.connect({
    address: process.env.OBSWSURL,
    password: process.env.OBSWSPASSWORD,
  });

  /*
   * @param {String} `sourceName` Source name
   * @param {String} `filterName` Source filter name
   * @param {String} `filterEnabled` New filter state
   */
  const payload = {
    sourceName: "capture: front cam (GS)",
    filterName: "Incognito",
    filterEnabled: true,
  };
  await obs.send("SetSourceFilterVisibility", payload);

  obs.disconnect();
};
