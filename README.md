## Node Crawler USDA Pomological Watercolors

## desc

爬取美国农业部果树水彩的数据， 图片比较漂亮

![](/download/POM00007370.jpg)
![](/download/POM00007372.jpg)

## api

[/api/crawler](http://localhost:8080/api/crawler) 抓取接口，访问这个接口，服务器会去抓取 列表数据大概共 `380 * 20` 条数据，由于数据太大站点又在国外，爬取可能会失败（请科学上网）

[/api/download](http://localhost:8080/api/download) 下载图片接口，由于图片太大只写了下载一张图的 demo。 如果有空我会把所有缩略图下载下来存放在`download` 文件夹下

## `data.json`

`data.json` 存放了列表的基本数据，可以直接使用

## 版权

所有的数据和图片版权归[USDA Pomological Watercolors](https://usdawatercolors.nal.usda.gov/)所有，与本人无关。侵删
