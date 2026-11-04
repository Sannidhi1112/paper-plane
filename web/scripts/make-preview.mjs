// Turns the single-file Vite build into a page for a shareable preview:
// keeps <title>, meta tags, font link, style and script; drops the html/head/body wrapper.
import { readFileSync, writeFileSync } from "node:fs";

const html = readFileSync("dist-single/index.html", "utf8");
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];

const keep = (re) => [...head.matchAll(re)].map((m) => m[0]).join("\n");
const title = keep(/<title>[\s\S]*?<\/title>/g);
const metaSides = keep(/<meta name="claude:viewport-fit-sides"[^>]*>/g);
const links = keep(/<link [^>]*>/g);
const styles = keep(/<style[\s\S]*?<\/style>/g);
const scripts = keep(/<script[\s\S]*?<\/script>/g);

const out = [title, metaSides, links, styles, body.trim(), scripts].join("\n");
writeFileSync("dist-single/preview.html", out);
console.log(`preview.html: ${(out.length / 1024).toFixed(0)} KB`);
