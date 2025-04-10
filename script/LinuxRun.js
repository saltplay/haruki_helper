const os = require("os");
const path = require("path");

if (os.type() === "Linux") {
  const prePathCheck = require(path.resolve(__dirname, "prePathCheck.js"));
  const result = prePathCheck();
  console.log("PrePathCheck Result:", result);
}

module.exports = 1;
