const supabase = require("../config/supabase");

module.exports = {
  getCountBooking: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("booking")
        .select("*", { count: "exact" })
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            reject(result);
          }
        });
    }),
  createBooking: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("booking")
        .insert([data])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  createBookingSection: (section, statusUsed, bookingId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("bookingSection")
        .insert([{ section, statusUsed, bookingId }])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getAllBooking: (offset, limit, userId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("booking")
        .select("*, event(*)")
        .range(offset, offset + limit - 1)
        .eq("userId", userId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getBookingByEventId: (eventId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("booking")
        .select(`bookingId, eventId, statusPayment, bookingSection ( section )`)
        .eq("eventId", eventId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getBookingBySectionId: (sectionId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("bookingSection")
        .select(`statusUsed`)
        .eq("sectionId", sectionId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateBookingStatus: (sectionId, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("bookingSection")
        .update(data)
        .eq("sectionId", sectionId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
