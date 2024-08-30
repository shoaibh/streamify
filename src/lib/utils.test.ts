import { getMonthNamesBetweenDates } from "./utils";

describe("util functions test", () => {
  test("Getting Month between dates", () => {
    const someDate = "2024/08/29";
    const fourMonthsBackDate = "2024/04/29";
    const result = ["April 2024", "May 2024", "June 2024", "July 2024", "August 2024"];
    expect(getMonthNamesBetweenDates(fourMonthsBackDate, someDate)).toEqual(result);
  });
});
