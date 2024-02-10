import "./App.css";
import ScheduleContainer from "./components/ScheduleContainer/ScheduleContainer.tsx";
import { appInitDataMock } from "./mock/mock-events.ts";
import {
  useFetchEventsQuery,
  useFetchPersonInfoByIdQuery,
} from "./store/common.api.v1.ts";
import { useState } from "react";
import { initialState } from "./constants.ts";
import ScheduleControls from "./components/ScheduleControls/ScheduleControls.tsx";
import { generateWeekDays } from "./utils.ts";

function App() {
  const [offsetWeek, setOffsetWeek] = useState(0);
  const [selectedWeek] = useState(generateWeekDays(offsetWeek));

  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading,
  } = useFetchEventsQuery({
    created_from: selectedWeek[0].day.subtract(1, "week").format("MM/DD/YYYY"),
    created_to: selectedWeek[selectedWeek.length - 1].day.format("MM/DD/YYYY"),
  });

  const {
    data: personInfoData,
    error: personInfoError,
    isLoading: personInfoLoading,
  } = useFetchPersonInfoByIdQuery("3");

  return (
    <div id="schedule-app">
      <ScheduleControls
        selectedWeek={selectedWeek}
        setOffsetWeek={setOffsetWeek}
      />

      <ScheduleContainer
        appInitData={appInitDataMock}
        selectedWeek={selectedWeek}
        eventsData={eventsData || initialState.eventsData}
        personInfo={personInfoData}
      />

      <div>
        <h1>Events</h1>
        {eventsLoading ? (
          <div>Loading events...</div>
        ) : eventsError && "data" in eventsError ? (
          <div>Error fetching events</div>
        ) : (
          <ul>
            {eventsData?.receivedEvents.map((event) => (
              <li key={event.date}>{event.title}</li>
            ))}
          </ul>
        )}

        <h1>Person Info</h1>
        {personInfoLoading ? (
          <div>Loading person info...</div>
        ) : personInfoError ? (
          <div>Error fetching person info:</div>
        ) : (
          <div>
            <p>ID: {personInfoData?.id}</p>
            <p>Name: {personInfoData?.personScreenName}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
