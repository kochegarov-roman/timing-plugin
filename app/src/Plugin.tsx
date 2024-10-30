import ScheduleContainer from "./components/ScheduleContainer/ScheduleContainer.tsx";
import { useFetchEventsQuery } from "./store/common.api.v1.ts";
import { useState } from "react";
import { initialState } from "./constants.ts";
import ScheduleControls from "./components/ScheduleControls/ScheduleControls.tsx";
import { ToggleTheme } from "./components/Theme/Theme.tsx";
import { appInitDataMock, personInfoMock } from "./mock/main-mock.ts";
import "./index.scss";
import { IWeekState } from "./types.ts";
import { Spinner } from "./components/Spinner/spinner.tsx";
import { getWeekData } from "./utils.ts";

const INITIAL_WEEK_STATE = getWeekData(0, 0);

function Plugin() {
  const [weekState, setWeekState] = useState<IWeekState>(INITIAL_WEEK_STATE);

  const setOffsetWeek = (_offsetWeek: number) => {
    setWeekState(getWeekData(weekState.offsetWeek, _offsetWeek));
  };

  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading,
  } = useFetchEventsQuery({
    created_from: weekState.weekFrom,
    created_to: weekState.weekTo,
  });

  const [themeClass, setTheme] = useState("dark");
  const toggleTheme = () => {
    setTheme(themeClass === "dark" ? "light" : "dark");
  };

  return (
    <div id="schedule-app" className={themeClass}>
      {!eventsError ? (
        <>
          <ToggleTheme toggleTheme={toggleTheme} themeClass={themeClass} />
          <ScheduleControls selectedWeek={weekState.selectedWeek} setOffsetWeek={setOffsetWeek} />
          {eventsLoading ? (
            <div className="spinner-container">
              <Spinner aria-label="Загрузка страницы" />
            </div>
          ) : (
            <ScheduleContainer
              appInitData={appInitDataMock}
              selectedWeek={weekState.selectedWeek}
              eventsData={eventsData || initialState.eventsData}
              personInfo={personInfoMock}
            />
          )}
        </>
      ) : (
        <div>Error loading data, please try again later.</div>
      )}
    </div>
  );
}

export default Plugin;
