import ISheetRowData from './ISheetRowData';
import parsePriority from '../utils/parsePriority';
// import parseEvent from './parseEvent';
import notEmpty from '../utils/notEmpty';

const parseRowData = (data: string[]): ISheetRowData => {
  const [
    DM,
    Availability,
    DeveloperId,
    Developer,
    Location,
    Grade,
    English,
    React,
    Angular,
    NodeJS,
    Willingness,
    Priority, ,
    ...PlannedInterviews
  ] = data;

  return {
    DM,
    Availability,
    DeveloperId: Number(DeveloperId),
    Developer,
    Location,
    Grade,
    English: English.toUpperCase() === 'TRUE',
    React: React.toUpperCase() === 'TRUE',
    Angular: Angular.toUpperCase() === 'TRUE',
    NodeJS: NodeJS.toUpperCase() === 'TRUE',
    Willingness: Willingness.toUpperCase() === 'TRUE',
    Priority: parsePriority(Priority),
    PlannedInterviews: PlannedInterviews.length
      /** @todo parse event */
      ? PlannedInterviews.filter(notEmpty)// .map(parseEvent)
      : [],
  };
};

export default parseRowData;
