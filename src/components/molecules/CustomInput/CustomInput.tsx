import React, { useRef, useEffect, useState } from "react";
import "./CustomInput.scss";
import classNames from "classnames";

interface InputProps {
  type: string;
  onKeyDown: any;
  onChange: any;
  placeholder: string;
  invalid?: boolean;
  invalidMessage?: string;
  autocomplete?: boolean;
  refresh?: boolean;
  largePadding?: boolean;
  clearErrors?: () => void;
}

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

const CustomInput: React.FC<InputProps> = ({
  type,
  onKeyDown,
  onChange,
  placeholder,
  invalid,
  invalidMessage,
  autocomplete,
  refresh,
  largePadding,
  clearErrors,
}) => {
  const [isInvalid, setIsInvalid] = useState(invalid);
  const [visibleError, setVisibleError] = useState(invalid);
  const wrapperRef = useRef(null);

  useOutsideClickHandler(wrapperRef, () => setVisibleError(false));

  useEffect(() => {
    setIsInvalid(invalid);
    setVisibleError(invalid);
  }, [invalid, refresh]);

  const inputClasses = classNames("CustomInput", {
    InvalidCustomInput: isInvalid,
    LargeCustomInputPadding: largePadding,
  });
  const inputErrorClasses = classNames("CustomInputError", {
    CustomInputErrorVisible: visibleError,
  });
  return (
    <div className="CustomInputContainer" ref={wrapperRef}>
      <input
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onKeyDown();
          }
        }}
        className={inputClasses}
        type={type}
        placeholder={placeholder}
        autoComplete={autocomplete ? "on" : "off"}
        onChange={(e) => {
          clearErrors && clearErrors();
          onChange(e.target.value);
        }}
      />
      <p className={inputErrorClasses}>{visibleError && invalidMessage}</p>
    </div>
  );
};

export default CustomInput;
