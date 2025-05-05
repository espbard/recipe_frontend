import React from "react";
import FilterSvg from "../../../assets/images/filter.svg";
import CloseSvg from "../../../assets/images/x-symbol.svg";
import "./Filters.scss";
import { Icon } from "../../../common/common";
import { useAppSelector } from "../../../redux/hooks";
import classNames from "classnames";

interface FiltersProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  disabled: boolean;
}

const Filters: React.FC<FiltersProps> = ({ isOpen, open, close, disabled }) => {
  const selectedIngredients = useAppSelector(
    (state) => state.global.selectedIngredients
  );
  const selectedTags = useAppSelector((state) => state.global.selectedTags);
  const selectedMeal = useAppSelector((state) => state.global.selectedMealType);

  const classes = classNames("FilterIconContainer", {
    FilterIconContainerDisabled: disabled,
  });

  return (
    <div>
      <div className={classes}>
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
              src={FilterSvg}
              onClick={() => open()}
              tabIndex={0}
              alt="Filter"
            />
          </div>
        )}

        {(selectedIngredients.length > 0 ||
          selectedTags.length > 0 ||
          selectedMeal !== "") && (
          <div className="FilterDotContainer">
            <p className="FilterDot">{Icon.Dot}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;
