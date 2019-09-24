import ISheetRowData from '../interfaces/ISheetRowData';
import parsePriority from './parsePriority';
import parseEvent from './parseEvent';
import notEmpty from './notEmpty';

const parseRowData = (data: string[]): ISheetRowData => {
  const [
    DM,
    Availability,
    DeveloperId,
    Developer,
    Location,
    Grade,
    English,
    Priority,
    OnBoarded,
    Experience, ,
    ...PlannedInterviews
  ] = data;

  return {
    DM,
    Availability,
    DeveloperId: Number(DeveloperId),
    Developer,
    Location,
    Grade,
    English: English === 'yes',
    Priority: parsePriority(Priority),
    OnBoarded: OnBoarded ? parseEvent(OnBoarded) : null,
    Experience: Experience.length
      ? Experience.split(/\r?\n/).map(parseEvent)
      : [],
    Total: PlannedInterviews.length,
    PlannedInterviews: PlannedInterviews.length
      ? PlannedInterviews.filter(notEmpty).map(parseEvent)
      : [],
  };
};

export default parseRowData;
