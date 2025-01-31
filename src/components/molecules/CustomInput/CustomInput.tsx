import React, { useEffect, useState } from "react";
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
  clearErrors?: () => void;
}

const CustomInput: React.FC<InputProps> = ({
  type,
  onKeyDown,
  onChange,
  placeholder,
  invalid,
  invalidMessage,
  autocomplete,
  clearErrors,
}) => {
  const [isInvalid, setIsInvalid] = useState(invalid);

  useEffect(() => {
    setIsInvalid(invalid);
  }, [invalid]);

  const inputClasses = classNames("CustomInput", {
    InvalidCustomInput: isInvalid,
  });
  const inputErrorClasses = classNames("CustomInputError", {
    CustomInputErrorVisible: isInvalid,
  });
  return (
    <div className="CustomInputContainer">
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
      <p className={inputErrorClasses}>{isInvalid && invalidMessage}</p>
    </div>
  );
};

export default CustomInput;
