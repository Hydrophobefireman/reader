import process from "node:process";

function CONFIG_ENABLED(x) {
  return ![undefined, "no", "false", "0", "n"].includes(x?.toLowerCase());
}
export const PROXY_IMAGES = CONFIG_ENABLED(process.env.PROXY_IMAGES);
