const axios = require("axios");
const io = require("socket.io-client");
require("dotenv").config();

const socket = io.connect(process.env.VULCANHUBURL);

module.exports = async function(context, req) {
  const tenant_id = process.env.AZURETENANTID;
  const app_id = process.env.AZUREAPPID;
  const password = process.env.AZUREPASSWORD;
  const sub_id = process.env.AZURESUBSCRIPTIONID;
  const funcApp = "vulcanfunc";

  // Get auth token to access Azure resource API
  const authUri = `https://login.microsoftonline.com/${tenant_id}/oauth2/token`;

  const authPayload = `grant_type=client_credentials&resource=https://management.core.windows.net/&client_id=${app_id}&client_secret=${password}`;

  let authResult;
  try {
    authResult = await axios.post(authUri, authPayload);
  } catch (err) {
    console.log(err);
  }
  const authToken = authResult.data.access_token;

  const azureResourcesUri = `https://management.azure.com/subscriptions/${sub_id}/resourceGroups/Vulcan/providers/Microsoft.Web/sites/${funcApp}/functions?api-version=2015-08-01`;
  const azureHeaders = {
    authorization: `Bearer ${authToken}`,
    host: "management.azure.com",
    "content-type": "application/json"
  };

  const functions = (
    await axios.get(azureResourcesUri, {
      headers: azureHeaders
    })
  ).data.value;

  const commands = functions
    .map(m => {
      return {
        uri: m.properties.invoke_url_template,
        command: m.name.toLowerCase().replace(`${funcApp}/`, "")
      };
    })
    .filter(f => f.command[0] !== "x")
    .map(m => m.command)
    .sort()
    .map(m => `!${m}`)
    .join(", ");

  const message = `I can respond to the following commands: ${commands}`;

  const payload = {
    message,
    messageType: "chat", // or 'whisper'
    recipient: null // required when messageType === whisper
  };

  // Send a message to the Socket.io
  socket.emit("newMessage", payload);
};
