const express = require("express");

const Router = express.Router();

const bookingController = require("../controllers/booking");
const authMiddleware = require("../middleware/auth");

Router.post(
  "/",
  authMiddleware.authentication,
  bookingController.createBooking
);
Router.get("/", authMiddleware.authentication, bookingController.getAllBooking);

Router.get(
  "/section",
  authMiddleware.authentication,
  bookingController.getBookingByEventId
);

Router.patch(
  "/bookingSection/:sectionId",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  bookingController.updateBookingStatus
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post("/payment", (req, res) => {
  const dataUser = {
    fullName: "test doang",
  };

  const dataTransaction = {
    amount: "Rp 5000",
  };

  const condition = "'stock-GOOG' in topics || 'industry-tech' in topics";

  const message = {
    notification: {
      title: `payment success, kamu udah ngirim ke ${dataUser.fullName}`,
      body: `kamu mengirim sebesar${dataTransaction.amount}.`,
    },
    condition,
  };

  var admin = require("firebase-admin");

  var serviceAccount = require("./resources/dream-events-365800-firebase-adminsdk-qssv8-9c172e029d.json");

  // Send a message to devices subscribed to the combination of topics
  // specified by the provided condition.
  getMessaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
}); 


module.exports = Router;
