const supabase = require("../config/supabase");

module.exports = {
  getAllWishlist: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .select("*")
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getWishlistById: (wishlistId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .select("*")
        .eq("wishlistId", wishlistId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  createWishlist: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .insert([data])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
