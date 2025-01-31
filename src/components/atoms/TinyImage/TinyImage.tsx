import { Component } from "react";
import { NavLink } from "react-router-dom";
import "./TinyImage.scss";

interface TinyImageProps {
  url: string;
  alt: string;
  onClickUrl?: string;
}

export class TinyImage extends Component<TinyImageProps> {
  render() {
    const { url, alt, onClickUrl } = this.props;
    return (
      <div>
        {onClickUrl !== undefined ? (
          <NavLink to={onClickUrl || "#"}>
            <img src={url} alt={alt} className="tiny_image" />
          </NavLink>
        ) : (
          <img src={url} alt={alt} className="tiny_image" />
        )}
      </div>
    );
  }
}
