import Axios from "axios";
import fs from "fs";
import path from "path";
/**
 *
 * @param {string} url
 * @param {string} filepath
 * @param {string} name
 */
async function downloadFile(url, filepath, name) {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
  }
  const mypath = path.resolve(filepath, name);
  const writer = fs.createWriteStream(mypath);
  const response = await Axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve([null, name]));
    writer.on("error", () => reject(new Error("下载失败")));
  });
}

module.exports = downloadFile;
