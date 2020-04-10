import Koa from "koa";
import Static from "koa-static";
import Router from "@koa/router";
import { port } from "./const";
const crawlerData = require("./getData");
const downloadFile = require("./download");

const app = new Koa();

const router = new Router();

// or use absolute paths
app.use(Static(__dirname + "/download"));

// http://localhost:8080/api/crawler
router.get("/api/crawler", (ctx, next) => {
  console.log("开始 抓取数据");
  crawlerData();
  ctx.body = {
    code: 200,
    msg: "开始抓取数据，由于数据比较多  请耐心等待",
    data: [],
  };
});

// restful api
router.get("/api/download", async (ctx, next) => {
  console.log("开始 下载图片");
  // 由于图片太多 下面只是一个例子🌰
  const [err, name] = await downloadFile(
    "https://usdawatercolors.nal.usda.gov/download/POM00007375/thumbnail",
    "./download",
    "POM00007375.jpg"
  );

  ctx.body = {
    code: 200,
    msg: err ? "下载失败" : "success",
    data: "/" + name,
  };
});

// 页面 、api 接口
app.use(router.routes(), router.allowedMethods());

app.listen(port, () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    port,
    "development"
  );
  console.log("  Press CTRL-C to stop\n");
});

export default app;
