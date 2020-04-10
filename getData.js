import axios from "axios";
import cheerio from "cheerio";
import path from "path";
import fs from "fs";
import { baseUrl } from "./const";

const targetFile = path.resolve(__dirname, "./index.json");

function appendDataToJson(string) {
  try {
    fs.appendFileSync(targetFile, string, "utf8");
  } catch (err) {
    console.log("fs.appendFileSync error: ", JSON.stringify(err));
  }
}

async function crawlerData() {
  const page = 380;

  if (fs.existsSync(targetFile)) {
    fs.unlinkSync(targetFile, (err) => {
      if (err) throw err;
      console.log(targetFile + "was deleted");
    });
  }

  appendDataToJson("[");
  for (let i = 0; i < page; i++) {
    await getData(i * 20);
  }
  appendDataToJson("]");
}

async function getData(start) {
  console.log(start);
  return axios
    .get(
      `${baseUrl}/pom/search.xhtml?start=${start}&searchText=&searchField=&sortField=`
    )
    .then((response) => {
      let html_string = response.data.toString();
      const $ = cheerio.load(html_string); // 传递页面到模块
      // 此时我们已经可以像用 JQ 一样对获取到的页面 $ 进行元素获取了
      const arr = fromatData($);

      var str = `${start == 0 ? "" : ","}${JSON.stringify(arr).replace(
        /^\[|\]$/g,
        ""
      )}`;
      appendDataToJson(str);
      return;
    });
}

function fromatData($) {
  const arr = [];
  $(".blacklight-image").each((i, item) => {
    let li = $(item).find(".defList dt");
    const obj = {};

    li.each((index, it) => {
      const $it = $(it);
      const key = $it
        .text()
        .replace(/^ |\n|\t|\:| $/g, "")
        .replace(/ /, "_");
      const value = $($it.siblings("dd")[index])
        .text()
        .replace(/\n|\t/g, "")
        .replace(/ $/g, "");

      obj[key] = value;
    });

    const thumbnail = $(item).find(".thumb-frame img").attr("src");
    // 标题
    obj["Title"] = $(item).find(".index_title a").text();
    // 原缩略图
    obj["Origin_thumbnail_url"] = baseUrl + thumbnail.replace(/../, "");
    // 原图 （图片资源太大）
    obj["Thumbnail_url"] = thumbnail.replace(/../, "");
    // id
    obj["id"] = thumbnail.replace(/..\/download\/|\/thumbnail/gi, "");
    // 原图下载地址
    obj[
      "Origin_download_link"
    ] = `${baseUrl}/pom/download.xhtml?id=${obj["id"]}`;
    // 详情地址 （由于是国外站 国内访问有点麻烦）
    obj["Detail_url"] = baseUrl + $(item).find(".thumb-frame a").attr("href");

    arr.push(obj);
  });

  return arr;
}

module.exports = crawlerData;
