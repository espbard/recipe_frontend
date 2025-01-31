import React, { useEffect, useRef } from "react";
import "./CustomButtonLabel.scss";

interface CustomButtonLabelProps {
  label: string;
  hoverLabel: string;
  fontSize: string;
  color: string;
}

const CustomButtonLabel: React.FC<CustomButtonLabelProps> = ({
  label,
  hoverLabel,
  fontSize,
  color,
}) => {
  function useHoverHandler(ref: any) {
    useEffect(() => {
      function handleHover(event: any) {
        if (ref.current && ref.current.contains(event.target)) {
          setActiveLabel(hoverLabel);
        }
      }

      function handleLeaveHover(event: any) {
        if (ref.current && ref.current.contains(event.target)) {
          setActiveLabel(label);
        }
      }

      document.addEventListener("mouseover", handleHover);
      document.addEventListener("mouseout", handleLeaveHover);

      return () => {
        document.removeEventListener("mouseover", handleHover);
        document.removeEventListener("mouseout", handleLeaveHover);
      };
    }, [ref]);
  }

  const [activeLabel, setActiveLabel] = React.useState(label);

  const wrapperRef = useRef(null);
  useHoverHandler(wrapperRef);

  return (
    <div ref={wrapperRef} className="CustomButtonLabel">
      <p style={{ fontSize, color }}>{activeLabel}</p>
    </div>
  );
};

export default CustomButtonLabel;
