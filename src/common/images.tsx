import Resizer from "react-image-file-resizer";

// Uploads used to be stored in their original format at quality 100, which left
// the CDN serving multi megabyte photos that every recipe card, thumbnail and
// recipe page then had to download. Re-encoding to WebP at quality 80 keeps the
// same dimensions at a small fraction of the size.
export const IMAGE_MAX_SIZE = 1200;
const IMAGE_QUALITY = 80;
const WEBP_FORMAT = "webp";
const JPEG_FORMAT = "jpeg";

let cached_format: string | undefined = undefined;

// Older browsers (Safari before 16) cannot encode WebP from a canvas and hand
// back a PNG instead, so check before naming the file .webp. JPEG at quality 80
// is still far smaller than what we used to upload.
const image_format = () => {
  if (cached_format === undefined) {
    const canvas = document.createElement("canvas");
    cached_format = canvas
      .toDataURL("image/" + WEBP_FORMAT)
      .startsWith("data:image/" + WEBP_FORMAT)
      ? WEBP_FORMAT
      : JPEG_FORMAT;
  }
  return cached_format;
};

// The name is what ends up stored on the recipe, so its extension has to match
// the format the image was re-encoded to for the CDN to serve it correctly.
export const upload_image_name = (name: string) => {
  const extension_index = name.lastIndexOf(".");
  const base_name = extension_index > 0 ? name.slice(0, extension_index) : name;

  return base_name + "." + image_format();
};

export const resizeImage = (
  image: File,
  maxSize: number = IMAGE_MAX_SIZE
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const format = image_format();

    Resizer.imageFileResizer(
      image,
      maxSize,
      maxSize,
      format,
      IMAGE_QUALITY,
      0,
      (uri) => {
        if (uri instanceof File) {
          // The resizer reuses the name it was handed, which still carries the
          // extension of the file the user picked.
          resolve(
            new File([uri], upload_image_name(image.name), {
              type: "image/" + format,
            })
          );
        } else {
          reject(new Error("Failed to resize image"));
        }
      },
      "file"
    );
  });
};
