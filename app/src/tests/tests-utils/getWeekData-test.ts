import moment from "moment";
import { beforeEach, describe } from "node:test";
import { generateWeekDays } from "../../utils.ts";

jest.mock('./yourModule', () => ({
  ...jest.requireActual('./yourModule'),
  generateWeekDays: jest.fn(),
}));

describe('getWeekData', () => {
  beforeEach(() => {
    generateWeekDays.mockReturnValue([
      { day: moment("2024-10-28") },
      { day: moment("2024-10-29") },
      { day: moment("2024-10-30") },
      { day: moment("2024-10-31") },
      { day: moment("2024-11-01") },
      { day: moment("2024-11-02") },
      { day: moment("2024-11-03") },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('возвращает правильные данные при _offsetWeek = 0', () => {
    const result = getWeekData(0, 0);

    expect(result.offsetWeek).toBe(0);
    expect(result.selectedWeek.length).toBe(7);
    expect(result.weekFrom).toBe("10/21/2024");
    expect(result.weekTo).toBe("11/03/2024");
  });

  test('возвращает правильные данные при положительном _offsetWeek', () => {
    const result = getWeekData(1, 1);

    expect(result.offsetWeek).toBe(2); // prevOffset + _offsetWeek = 1 + 1
    expect(result.selectedWeek.length).toBe(7);
    expect(result.weekFrom).toBe("10/21/2024");  // Неделя до первого дня
    expect(result.weekTo).toBe("11/03/2024");    // Последний день выбранной недели
  });

  test('возвращает правильные данные при отрицательном _offsetWeek', () => {
    const result = getWeekData(1, -1);

    expect(result.offsetWeek).toBe(0); // prevOffset + _offsetWeek = 1 - 1
    expect(result.selectedWeek.length).toBe(7);
    expect(result.weekFrom).toBe("10/21/2024");  // Неделя до первого дня
    expect(result.weekTo).toBe("11/03/2024");    // Последний день выбранной недели
  });
});