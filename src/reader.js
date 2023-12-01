import createDOMPurify from "dompurify";
import Handlebars from "handlebars";
import {JSDOM} from "jsdom";
import {marked} from "marked";
import fs from "node:fs";

import Parser from "@postlight/parser";

import {PROXY_IMAGES} from "./constants.js";
import {getFavicon} from "./generate-favicon.js";

const TEMPLATE = Handlebars.compile(
  fs.readFileSync("html/template.html").toString()
);
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

const md = PROXY_IMAGES
  ? marked.use({
      renderer: {
        image(href, title, text) {
          return `<img
                    src="/__/proxy?href=${encodeURIComponent(href)}"
                    alt="${text}"${title ? `\ntitle="${title}"` : ""}
                />`;
        },
      },
    })
  : marked;
export async function generateReaderView(url) {
  const res = await Parser.parse(url, {contentType: "markdown"});
  const domain = res.domain.replace("www.", "");
  return TEMPLATE({
    ...res,
    domain,
    root: `https://${res.domain}`,
    content: DOMPurify.sanitize(md.parse(res.content)),
    date_published: res.date_published
      ? new Date(res.date_published).toDateString()
      : "",
    ctx: JSON.stringify(res),
    favicon: getFavicon(domain),
  });
}
