import React, { SyntheticEvent } from "react";
import ServerIface from "../../../ServerIface";
import missing_picture_placeholder from "../../../assets/images/missing_picture_placeholder.png";

interface RecipeImageProps {
  // Either the image name stored on the recipe or an already resolved URL.
  image?: string | null;
  alt?: string;
  className?: string;
  // The recipe page shows one large image that is the point of the page, so it
  // is fetched right away. Every other recipe image is a thumbnail or sits
  // below the fold, and waits until it is scrolled into view.
  priority?: boolean;
}

const resolveSrc = (image?: string | null) => {
  if (
    image === undefined ||
    image === null ||
    image === "" ||
    image === "undefined"
  ) {
    return missing_picture_placeholder;
  }

  if (
    image.startsWith("http") ||
    image.startsWith("data:") ||
    image.startsWith("/")
  ) {
    return image;
  }

  return new ServerIface().getCdn() + image;
};

export const RecipeImage: React.FC<RecipeImageProps> = ({
  image,
  alt,
  className,
  priority,
}) => {
  const addImageFallback = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = missing_picture_placeholder;
  };

  return (
    <img
      src={resolveSrc(image)}
      alt={alt !== undefined ? alt : "Recipe"}
      className={className}
      loading={priority ? "eager" : "lazy"}
      // Decoding off the main thread keeps a long list of images from blocking
      // scrolling and interaction while they are painted.
      decoding={priority ? "auto" : "async"}
      onError={addImageFallback}
    />
  );
};

export default RecipeImage;
