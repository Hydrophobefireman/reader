import process from "node:process";

export const PROXY_IMAGES = ![undefined, "no", "false", "0", "n"].includes(
  process.env.PROXY_IMAGES?.toLowerCase()
);
