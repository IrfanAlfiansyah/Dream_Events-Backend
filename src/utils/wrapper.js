module.exports = {
  response: (res, status, msg, data, pagination) => {
    const result = {
      status,
      msg,
      data,
      pagination,
    };
    return res.status(status).json(result);
  },
};
