import './App.css'
import ScheduleContainer from "./components/ScheduleContainer/ScheduleContainer.tsx";
import {appInitDataMock} from "./mock/mock-events.ts";

function App() {

  return (
    <div id="schedule-app">
        <ScheduleContainer appInitData={appInitDataMock}/>
    </div>
  )
}

export default App
