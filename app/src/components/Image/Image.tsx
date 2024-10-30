import { FC, useState } from "react";

interface IImageWithFallbackProps {
  src: string;
  fallbackSrc: string;
  alt: string;
}

export const ImageWithFallback: FC<IImageWithFallbackProps> = ({
  src,
  fallbackSrc,
  alt,
}) => {
  const [imageSrc, setImageSrc] = useState(src);

  const onError = () => {
    setImageSrc(fallbackSrc);
  };

  return <img src={imageSrc} onError={onError} alt={alt} itemProp="image" />;
};
