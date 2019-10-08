import ISheetRowData from '../interfaces/ISheetRowData';

const populateWithUserInput = (
  value: ISheetRowData,
  source: ISheetRowData,
): ISheetRowData => ({
  ...value,
  Availability: source.Availability,
  English: source.English,
  React: source.React,
  Angular: source.Angular,
  NodeJS: source.NodeJS,
  Willingness: source.Willingness,
  PlannedInterviews: source.PlannedInterviews,
});

export default populateWithUserInput;
