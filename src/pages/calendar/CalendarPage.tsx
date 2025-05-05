import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate";
import "./CalendarPage.scss";
import { useNavigate } from "react-router-dom";
import ServerIface from "../../ServerIface";
import HouseIcon from "../../assets/images/house-svg.svg";
import { useAppDispatch } from "../../redux/hooks";
import { setGlobalLoading } from "../../redux/globalSlice";

const CalendarPage: React.FC = () => {
  type ValuePiece = Date | null;

  type Value = ValuePiece | [ValuePiece, ValuePiece];

  const [value, onChange] = useState<Value>(new Date());
  const [daysWithRecipes, setDaysWithRecipes] = useState<Date[]>([]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onCalendarClick = (date: Date) => {
    let formattedDate = format_date(date);

    navigate(
      `/date/${formattedDate.day}/${formattedDate.month}/${formattedDate.year}`
    );
  };

  useEffect(() => {
    const iface = new ServerIface();

    iface.get("dates").then((res) => {
      setDaysWithRecipes([]);
      if (res !== undefined && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          let date = new Date(res[i].date);
          setDaysWithRecipes((daysWithRecipes) => [...daysWithRecipes, date]);
        }
      }
    });
    dispatch(setGlobalLoading(false));
  }, []);

  const formatMonth = (_locale: string | undefined, date: Date) => {
    switch (date.getMonth()) {
      case 0:
        return "January";
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      case 11:
        return "December";
      default:
        return "";
    }
  };

  const format_date = (date: Date) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return {
      day: day,
      month: month,
      year: year,
    };
  };

  const getTileClassName = (date: Date) => {
    let classname = "";

    let current_date = format_date(new Date());
    let formatted_date = format_date(date);

    if (
      current_date.year === formatted_date.year &&
      current_date.month === formatted_date.month &&
      current_date.day === formatted_date.day
    ) {
      classname = classname + " CalendarPageToday";
    }

    for (let i = 0; i < daysWithRecipes.length; i++) {
      let formatted_recipe_date = format_date(daysWithRecipes[i]);
      if (
        formatted_recipe_date.year === formatted_date.year &&
        formatted_recipe_date.month === formatted_date.month &&
        formatted_recipe_date.day === formatted_date.day
      ) {
        classname = classname + " DayHasRecipe";
      }
    }
    return classname;
  };

  return (
    <PageTemplate
      content={
        <div id="CalendarPage" key={"CalendarPage"}>
          <Calendar
            onClickDay={onCalendarClick}
            onChange={onChange}
            value={value}
            showNeighboringMonth={false}
            formatMonthYear={(locale, date) => formatMonth(locale, date)}
            tileClassName={({ date }) => getTileClassName(date)}
          />
          <div className="HomeButtonContainer">
            <img
              src={HouseIcon}
              alt="HouseIcon"
              className="HouseIcon"
              onClick={() => navigate("/")}
            />
          </div>
        </div>
      }
    />
  );
};

export default CalendarPage;
