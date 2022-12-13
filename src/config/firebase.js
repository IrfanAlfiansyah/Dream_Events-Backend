const admin = require("firebase-admin");

const serviceAccount = require("./dream-events-365800-firebase-adminsdk-qssv8-fb86a2fc62.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
