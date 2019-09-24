import ISheetRowData from '../sheet/ISheetRowData';
import formatPriority from './formatPriority';
import formatEvent from './formatEvent';

const formatRowData = (data: ISheetRowData): string[] => [
  data.DM,
  data.Availability,
  data.DeveloperId.toString(),
  data.Developer,
  data.Location,
  data.Grade,
  data.English ? 'yes' : 'no',
  data.Priority ? formatPriority(data.Priority) : '',
  data.OnBoarded ? formatEvent(data.OnBoarded) : '',
  data.Experience.map(formatEvent).join('\n'),
  data.PlannedInterviews.length.toString(),
  ...data.PlannedInterviews.map(formatEvent),
];

export default formatRowData;
