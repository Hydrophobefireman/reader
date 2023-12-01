import sharp from "sharp";

export const extensions = {
  avif: 0,
  webp: 1,
};

export async function imageProxy(url, extension = extensions.webp) {
  const resp = await fetch(url);
  let sh = sharp(await resp.arrayBuffer());
  let mt = "image/webp";
  if (extension === extensions.avif) {
    mt = "image/avif";
    sh = sh.avif({quality: 90});
  } else {
    sh = sh.webp({quality: 80});
  }
  return {buf: await sh.toBuffer(), mt};
}
