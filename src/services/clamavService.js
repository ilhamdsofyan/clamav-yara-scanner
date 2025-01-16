const path = require("path");
const clamav = require("clamav.js");

const { CLAMAV_HOST, CLAMAV_PORT } = process.env;

exports.scan = (file) => {
  return new Promise((resolve, reject) => {
    const filePath = path.resolve(__dirname, "../../", file.path);

    clamav
      .createScanner(CLAMAV_PORT, CLAMAV_HOST)
      .scan(filePath, (err, object, malicious) => {
        if (err) {
          reject(`${err}`);
        } else if (malicious) {
          resolve({
            isClean: false,
            result: `${malicious} FOUND`,
          });
        } else {
          resolve({
            isClean: true,
            result: `OK`,
          });
        }
      });
  });
};
