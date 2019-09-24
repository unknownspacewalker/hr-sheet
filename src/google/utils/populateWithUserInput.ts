import ISheetRowData from '../sheet/ISheetRowData';

const populateWithUserInput = (
  value: ISheetRowData,
  source: ISheetRowData,
): ISheetRowData => ({
  ...value,
  Availability: source.Availability,
  English: source.English,
  OnBoarded: source.OnBoarded,
  Experience: source.Experience,
  Total: source.Total,
  PlannedInterviews: source.PlannedInterviews,
});

export default populateWithUserInput;
