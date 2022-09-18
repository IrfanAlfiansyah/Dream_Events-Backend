const supabase = require("../config/supabase");

module.exports = {
  getCountEvent: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("event")
        .select("*", { count: "exact" })
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            reject(result);
          }
        });
    }),
  // getAllEvent: (offset, limit, name) =>
  //   new Promise((resolve, reject) => {
  //     supabase
  //       .from("event")
  //       .select("*")
  //       .range(offset, offset + limit - 1)
  //       .ilike("name", `%${name}%`)
  //       .order("dateTimeShow", { ascending: true })
  //       .then((result) => {
  //         if (!result.error) {
  //           resolve(result);
  //         } else {
  //           reject(result);
  //         }
  //       });
  //   }),
  getAllEvent: (offset, limit, sortColumn, sortType, day, nextDay) =>
    new Promise((resolve, reject) => {
      // page = 1
      // limit = 10
      // offset = 0
      // .range(0, 9) // offset(0) + limit(10) - 1 = 9
      let query = supabase
        .from("event")
        .select("*")
        .range(offset, offset + limit - 1)
        .order(sortColumn, { ascending: sortType })
        .ilike("name", `%...%`);
      // kondisi untuk search by date
      if (day) {
        query = query
          .gt("dateTimeShow", `${day.toISOString()}`)
          .lt("dateTimeShow", `${nextDay.toISOString()}`);
      }

      query.then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
    }),
  getEventById: (eventId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("event")
        .select("*")
        .eq("eventId", eventId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  createEvent: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("event")
        .insert([data])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateEvent: (eventId, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("event")
        .update(data)
        .eq("eventId", eventId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  deleteEvent: (eventId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("event")
        .delete(eventId)
        .eq("eventId", eventId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
