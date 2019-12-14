import SheetRowDataInterface from './SheetRowDataInterface';
import formatPriority from '../utils/formatPriority';
/** @todo parse event */
// import formatEvent from './formatEvent';
import { SheetRawRowInterface } from '../interfaces/SheetRawInterface';

const createFormatRowData = (
  width: number
): ((data: SheetRowDataInterface) => SheetRawRowInterface) => {
  const calculatedWidth = width > 5 ? width + 1 : 6;
  return (data: SheetRowDataInterface): SheetRawRowInterface => {
    const emptyPlannedInterviews = Array(
      calculatedWidth - data.PlannedInterviews.length
    ).fill('');
    return [
      data.DM,
      data.Availability,
      data.DeveloperId.toString(),
      data.Developer,
      data.Location,
      data.Grade,
      data.English, // ? 'TRUE' : 'FALSE',
      data.React, // ? 'TRUE' : 'FALSE',
      data.Angular, // ? 'TRUE' : 'FALSE',
      data.NodeJS, // ? 'TRUE' : 'FALSE',
      data.Willingness, // ? 'TRUE' : 'FALSE',
      data.Priority ? formatPriority(data.Priority) : '',
      '=COUNTA(OFFSET(INDIRECT("RC",FALSE),0,1,1,365))',
      /** @todo parse event */
      ...[
        ...emptyPlannedInterviews,
        ...data.PlannedInterviews /* .map(formatEvent) */,
      ],
    ];
  };
};

export default createFormatRowData;
