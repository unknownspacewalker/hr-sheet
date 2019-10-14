import ISheetRowData from '../interfaces/ISheetRowData';

const populateWithUserInput = (
  value: ISheetRowData,
  source: ISheetRowData,
): ISheetRowData => ({
  ...value,
  Availability: source.Availability,
  English: source.English,
  Willingness: source.Willingness,
  PlannedInterviews: source.PlannedInterviews,
});

export default populateWithUserInput;
