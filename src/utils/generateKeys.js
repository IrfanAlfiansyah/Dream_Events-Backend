const crypto = require("crypto");

const accessKeys = crypto.randomBytes(32).toString("hex");
const refreshKeys = crypto.randomBytes(32).toString("hex");

// eslint-disable-next-line no-console
console.table({ accessKeys, refreshKeys });
