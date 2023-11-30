const fastify = require("fastify")();
const Parser = require("@postlight/parser");
const Handlebars = require("handlebars");
const fs = require("fs");
const marked = require("marked");
const INDEX_HTML = fs.readFileSync("html/index.html").toString();
const TEMPLATE = Handlebars.compile(
  fs.readFileSync("html/template.html").toString()
);
const createDOMPurify = require("dompurify");
const {JSDOM} = require("jsdom");
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);
const {getFavicon} = require("./generate-favicon");

async function parseURL(url) {
  const res = await Parser.parse(url, {contentType: "markdown"});
  const domain = res.domain.replace("www.", "");
  return TEMPLATE({
    ...res,
    domain,
    root: `https://${res.domain}`,
    content: DOMPurify.sanitize(marked.parse(res.content)),
    date_published: res.date_published
      ? new Date(res.date_published).toDateString()
      : "",
    ctx: JSON.stringify(res),
    favicon: getFavicon(domain),
  });
}

fastify.get("/", async (req, res) => {
  const url = req.query["url"];

  if (url) {
    const result = await parseURL(url);
    return res.headers({"content-type": "text/html"}).send(result);
  }
  res.headers({"content-type": "text/html"}).send(INDEX_HTML);
});

fastify.get("*", async (request, res) => {
  const url = request.url.substring(1);
  const result = await parseURL(url);
  return res.headers({"content-type": "text/html"}).send(result);
});

// Run the server
fastify.listen(
  {port: process.env.PORT || 8080, host: "0.0.0.0"},
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening on ${address}`);
  }
);
