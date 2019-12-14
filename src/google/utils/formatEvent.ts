import { format } from 'date-fns';
import EventInterface from '../interfaces/EventInterface';

const formatEvent = (event: EventInterface): string =>
  `${format(event.date, 'dd.MM.yyyy')} (${event.fullName})`;

export default formatEvent;
