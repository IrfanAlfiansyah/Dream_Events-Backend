const supabase = require("../config/supabase");

module.exports = {
  getCountWishlist: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .select("*", { count: "exact" })
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            reject(result);
          }
        });
    }),
  getAllWishlist: (offset, limit) =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .select("*, user(*), event(*)")
        .range(offset, offset + limit - 1)
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
  deleteWishlist: (wishlistId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .delete(wishlistId)
        .eq("wishlistId", wishlistId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
