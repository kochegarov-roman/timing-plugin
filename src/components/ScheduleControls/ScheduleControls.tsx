import {FC} from 'react';
import {ISelectedWeek} from "../../utils.ts";
import './styles.scss';


interface IScheduleControlsProps {
    selectedWeek: ISelectedWeek[],
    setOffsetWeek: (val: number) => void
}


const ScheduleControls: FC<IScheduleControlsProps> = ({ selectedWeek, setOffsetWeek }) => {

    const handleTodayClick = () => setOffsetWeek(0);
    const handleBackClick = () => setOffsetWeek(-1);
    const handleNextClick = () => setOffsetWeek(1);

    function getSelectedWeekTitle() {
        return (
            selectedWeek[0].day.format('MMM D, YYYY') +
            ' - ' +
            selectedWeek[selectedWeek.length - 1].day.format('MMM D, YYYY')
        );
    }

    return (
        <div className="schedule-controls">
            <button className="btn-today" onClick={handleTodayClick}>
                Today
            </button>
            <button className="back-button" onClick={handleBackClick}>
                <svg width="100%" height="100%" viewBox="0 0 20 20">
                    <path d="M13.5 14.5 9 10l4.5-4.5L12 4l-6 6 6 6 1.5-1.5z"></path>
                </svg>
            </button>

            <button className="next-button" onClick={handleNextClick}>
                <svg width="100%" height="100%" viewBox="0 0 20 20">
                    <path d="M6.5 5.5 11 10l-4.5 4.5L8 16l6-6-6-6-1.5 1.5z"></path>
                </svg>
            </button>

            <div className="selected-week">
                <p>{getSelectedWeekTitle()}</p>
            </div>
        </div>
    );
};

export default ScheduleControls;