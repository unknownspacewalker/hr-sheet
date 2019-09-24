import { format } from 'date-fns';
import IEvent from '../interfaces/IEvent';

const formatEvent = (event: IEvent): string => `${format(event.date, 'dd.MM.yyyy')} (${
  event.fullName
})`;

export default formatEvent;
