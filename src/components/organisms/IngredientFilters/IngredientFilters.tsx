import React from "react";
import CloseSvg from "../../../assets/images/x-symbol.svg";
import "./IngredientFilters.scss";
import { Icon } from "../../../common/common";
import { useAppSelector } from "../../../redux/hooks";
import IngredientFilterIcon from "../../../assets/images/ingredients_filter.svg";
import classNames from "classnames";

interface IngredientFiltersProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  disabled: boolean;
}

const IngredientFilters: React.FC<IngredientFiltersProps> = ({
  isOpen,
  open,
  close,
  disabled,
}) => {
  const selectedAdvancedIngredients = useAppSelector(
    (state) => state.global.selectedAdvancedIngredients
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
              src={IngredientFilterIcon}
              onClick={() => open()}
              tabIndex={0}
              alt="Filter"
            />
          </div>
        )}

        {selectedAdvancedIngredients.length > 0 && (
          <div className="FilterDotContainer">
            <p className="FilterDot">{Icon.Dot}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientFilters;
