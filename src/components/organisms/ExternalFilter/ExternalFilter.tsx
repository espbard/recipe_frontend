import React from "react";
import ExternalSvg from "../../../assets/images/external-link-svgrepo-com.svg";
import CloseSvg from "../../../assets/images/x-symbol.svg";
import "./ExternalFilter.scss";
import { Icon } from "../../../common/common";
import { useAppSelector } from "../../../redux/hooks";

interface ExternalFilterProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ExternalFilter: React.FC<ExternalFilterProps> = ({
  isOpen,
  open,
  close,
}) => {
  const onlyShowExternal = useAppSelector(
    (state) => state.global.onlyShowExternal
  );
  return (
    <div>
      <div className="FilterIconContainer">
        {isOpen ? (
          <div className="FilterIcon IconExtraPadding">
            <img
              src={CloseSvg}
              onClick={() => close()}
              tabIndex={0}
              alt="Close"
            />
          </div>
        ) : (
          <div className="FilterIcon">
            <img
              src={ExternalSvg}
              onClick={() => open()}
              tabIndex={0}
              alt="Filter"
            />
          </div>
        )}

        {onlyShowExternal && (
          <div className="FilterDotContainer">
            <p className="FilterDot">{Icon.Dot}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExternalFilter;
