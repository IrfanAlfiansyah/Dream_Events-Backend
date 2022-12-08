const midtransClient = require("midtrans-client");

const isProduction = false;
const serverKey = process.env.CLIENT_KEY;
const clientkey = process.env.SERVER_KEY;


const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientkey,
});

module.exports = snap;