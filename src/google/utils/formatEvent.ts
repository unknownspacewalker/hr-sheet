import { format } from 'date-fns';
import IEvent from '../sheet/IEvent';

const formatEvent = (event: IEvent): string => `${format(event.date, 'dd.MM.yyyy')} (${
  event.fullName
})`;

export default formatEvent;
