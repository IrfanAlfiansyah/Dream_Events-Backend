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
};
