import React from "react";
import "./PageLinkBox.scss";

interface PageLinkBoxProps {
  text: string;
  color?: string;
  disabled?: boolean;
  img: string;
  onClick?: () => void;
}

const PageLinkBox: React.FC<PageLinkBoxProps> = ({
  text,
  color,
  disabled,
  img,
  onClick,
}) => {
  let classes = "PageLinkBox " + "PageLinkBox-" + color;

  if (disabled) {
    classes += " PageLinkBoxDisabled";
  }

  return (
    <div className={classes} onClick={onClick}>
      <img src={img} alt="Icon" /> {text}
    </div>
  );
};

export default PageLinkBox;
