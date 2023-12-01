import sharp from "sharp";

export const extensions = {
  avif: 0,
  webp: 1,
};

const mimeTypes = {avif: "image/avif", webp: "image/webp"};

export async function imageProxy(url, extension = extensions.webp) {
  const resp = await fetch(url);
  let sh = sharp(await resp.arrayBuffer());
  let mt = mimeTypes.webp;
  if (extension === extensions.avif) {
    mt = mimeTypes.avif;
    sh = sh.avif({quality: 90});
  } else {
    sh = sh.webp({quality: 80});
  }
  return {buf: await sh.toBuffer(), mt};
}
