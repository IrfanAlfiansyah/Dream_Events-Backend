const bookingModel = require("../models/booking");
const wrapper = require("../utils/wrapper");
const groupingSection = require("../utils/groupingSection");
const snapMidtrans = require("../utils/midtrans");

module.exports = {
  createBooking: async (request, response) => {
    try {
      const {
        userId,
        eventId,
        totalTicket,
        totalPayment,
        paymentMethod,
        section,
      } = request.body;
      const setData = {
        userId,
        eventId,
        totalTicket,
        totalPayment,
        paymentMethod,
        statusPayment: true,
      };

      const result = await bookingModel.createBooking(setData);
      const { bookingId } = result.data[0];
      const resultBookingSection = await Promise.all(
        section.map(async (Element) => {
          try {
            await bookingModel.createBookingSection(Element, false, bookingId);
            return Element;
          } catch (error) {
            return error.error;
          }
        })
      );
      const resultSection = {
        ...result.data[0],
        section: resultBookingSection,
      };

      const parameterBooking = {
        bookingId,
        totalPayment,
      };

      const resultMidtrans = await snapMidtrans.post(parameterBooking);
      return wrapper.response(
        response,
        result.status,
        "Success Create Booking",
        {
          bookingId,
          ...resultSection,
          redirectUrl: resultMidtrans.redirect_url,
        }
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getAllBooking: async (request, response) => {
    try {
      let { page, limit, userId } = request.query;
      page = +page;
      limit = +limit;
      userId = `${userId}`;

      const totalData = await bookingModel.getCountBooking();
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const offset = page * limit - limit;

      const result = await bookingModel.getAllBooking(offset, limit, userId);
      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${userId} Not Found`,
          []
        );
      }
      return wrapper.response(
        response,
        result.status,
        "Success Get Data !",
        result.data,
        pagination
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getBookingByEventId: async (request, response) => {
    try {
      const { eventId } = request.query;

      const result = await bookingModel.getBookingByEventId(eventId);
      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By eventId ${eventId} Not Found`,
          []
        );
      }
      const newResult = groupingSection(result);

      return wrapper.response(
        response,
        result.status,
        "Success Get Booking Section !",
        newResult
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  updateBookingStatus: async (request, response) => {
    try {
      const { sectionId } = request.params;

      const checkSectionId = await bookingModel.getBookingBySectionId(
        sectionId
      );

      if (checkSectionId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By sectionId ${sectionId} Not Found`,
          []
        );
      }

      const setData = {
        statusUsed: true,
        updatedAt: new Date(Date.now()),
      };

      const result = await bookingModel.updateBookingStatus(sectionId, setData);

      return wrapper.response(
        response,
        result.status,
        "Success Use Ticket",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  midtransNotification: async (request, response) => {
    try {
      const result = await snapMidtrans.notif(request.body);

      const bookingId = result.order_id;
      const transactionStatus = result.transaction_status;
      const fraudStatus = result.fraud_status;

      if (transactionStatus === "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus === "challenge") {
          // TODO set transaction status on your databaase to 'challenge'
          const setData = {
            paymentMethod: result.payment_type,
            statusPayment: "challenge",
            // updatedAt: ...
          };
          // jalankan proses model untuk mengupdate data (setData) dan untuk bookingId didapat dari order_id diatas
        } else if (fraudStatus === "accept") {
          // TODO set transaction status on your databaase to 'success'
          const setData = {
            paymentMethod: result.payment_type,
            statusPayment: "success",
            // updatedAt: ...
          };
          // jalankan proses model untuk mengupdate data (setData) dan untuk bookingId didapat dari order_id diatas
        }
      } else if (transactionStatus === "settlement") {
        // TODO set transaction status on your databaase to 'success'
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "success",
          // updatedAt: ...
        };
        console.log(
          `Sukses melakukan pembayaran dengan id ${bookingId} dan data yang diubah ${JSON.stringify(
            setData
          )}`
        );
        // jalankan proses model untuk mengupdate data (setData) dan untuk bookingId didapat dari order_id diatas
      } else if (transactionStatus === "deny") {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "failed",
          // updatedAt: ...
        };
        // jalankan proses model untuk mengupdate data (setData) dan untuk bookingId didapat dari order_id diatas
      } else if (
        transactionStatus === "cancel" ||
        transactionStatus === "expire"
      ) {
        // TODO set transaction status on your databaase to 'failure'
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "failed",
          // updatedAt: ...
        };
        // jalankan proses model untuk mengupdate data (setData) dan untuk bookingId didapat dari order_id diatas
      } else if (transactionStatus === "pending") {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "pending",
          // updatedAt: ...
        };
        // jalankan proses model untuk mengupdate data (setData) dan untuk bookingId didapat dari order_id diatas
      }

      return wrapper.response(response, 200, "Success Update Status Booking", {
        bookingId,
        statusPayment: transactionStatus,
      });
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
};
