const fs = require("fs");
const http = require("http");
const url = require("url");

const overTemplate = fs.readFileSync(
  `${__dirname}/templates/tempOver.html`,
  "UTF-8"
);

const cardTemplate = fs.readFileSync(
  `${__dirname}/templates/tempCardOver.html`,
  "utf-8"
);

const prodTemplate = fs.readFileSync(
  `${__dirname}/templates/tempProd.html`,
  "utf-8"
);

const tempCardFiller = (template, data) => {
  let curr = template.replace(/{%PRODUCTNAME%}/g, data.productName);
  curr = curr.replace(/{%IMAGE%}/g, data.image);
  curr = curr.replace(/{%PRICE%}/g, data.price);
  curr = curr.replace(/{%AMOUNT%}/g, data.quantity);
  curr = curr.replace(/{%ID%}/g, data.id);
  curr = curr.replace(/{%NUTRIENTS%}/g, data.nutrients);
  curr = curr.replace(/{%FROM%}/g, data.from);

  if (!data.organic) {
    curr = curr.replace(/{%NOT-ORGANIC%}/g, "not-organic");
  }
  return curr;
};

const rawdata = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const prodData = JSON.parse(rawdata);

const server = http.createServer((req, res) => {
  const pathname = req.url;

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });

    const cardsArr = prodData.map((card) => tempCardFiller(cardTemplate, card));
    console.log(cardsArr);
    let currover = overTemplate.replace(/{%OVER-CARDS%}/g, cardsArr);
    res.end(currover);
  } else if (pathname === "/product") {
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("Page not found!");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening...");
});
