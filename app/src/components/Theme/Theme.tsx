import { FC } from "react";
import "./styles.scss";

interface IToggleTheme {
  toggleTheme: () => void;
  themeClass: string;
}

export const ToggleTheme: FC<IToggleTheme> = ({ themeClass, toggleTheme }) => {
  return (
    <div className={`toggle-theme ${themeClass}`} onClick={toggleTheme}>
      <div className="toggle">
        <div className={`toggle-track ${themeClass}`}>
          <div className={`toggle-thumb ${themeClass}`}></div>
        </div>
      </div>
      <div className={`toggle-icons ${themeClass}`}>
        <div className="i-moon"></div>
        <div className="i-sun"></div>
      </div>
    </div>
  );
};
