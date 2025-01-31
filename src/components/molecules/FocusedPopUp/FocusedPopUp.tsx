import React, { useRef, useEffect } from "react";

function useOutsideClickHandler(ref: any, callBack: () => void) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callBack();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callBack]);
}

interface FocusedPopUpProps {
  children: React.ReactNode;
  onClickOutside: () => void;
  hidden: boolean;
}

const FocusedPopUp: React.FC<FocusedPopUpProps> = ({
  children,
  onClickOutside,
  hidden,
}) => {
  const wrapperRef = useRef(null);
  useOutsideClickHandler(wrapperRef, onClickOutside);

  return (
    <div>
      {!hidden && (
        <div ref={wrapperRef} className="">
          {children}
        </div>
      )}
    </div>
  );
};

export default FocusedPopUp;
