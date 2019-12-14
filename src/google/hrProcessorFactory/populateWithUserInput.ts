import SheetRowDataInterface from '../interfaces/SheetRowDataInterface';

const populateWithUserInput = (
  value: SheetRowDataInterface,
  source: SheetRowDataInterface
): SheetRowDataInterface => ({
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
