import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/ko";

dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);
dayjs.locale("ko");

const getWeekNumber = (date: dayjs.Dayjs) => {
  return date.isoWeek();
};

const getWeekRange = (year: number, week: number) => {
  const startOfYear = dayjs(`${year}-01-01`);
  const startOfWeek = startOfYear.isoWeek(week).startOf("isoWeek");
  const endOfWeek = startOfWeek.endOf("isoWeek");
  return { start: startOfWeek, end: endOfWeek };
};

const today = dayjs();
const weekNumber = getWeekNumber(today);
const weekRange = getWeekRange(today.year(), weekNumber);

export const getWeeklyPageTitle = () => {
  return {
    start: weekRange.start,
    end: weekRange.end,
    pageTitle: `${today.year()}년 ${weekNumber}주차 (${weekRange.start.format(
      "YYYY/MM/DD"
    )}~${weekRange.end.format("YYYY/MM/DD")})`,
  };
};

export const generateDayRange = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
  const dateFormat = "YYYY-MM-DD (dd)";
  const dateRange: string[] = [];

  let current = start;

  while (current.isBefore(end) || current.isSame(end)) {
    dateRange.push(current.format(dateFormat));
    current = current.add(1, "day");
  }

  return dateRange;
};
