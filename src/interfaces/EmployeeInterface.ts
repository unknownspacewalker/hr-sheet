import { EViewPriority } from '../google/interfaces/EPriority';

export default interface EmployeeInterface {
  readonly id: number;
  readonly manager: string | null;
  readonly username: string | null;
  readonly firstName: string | null;
  readonly familyName: string | null;
  readonly track: string | null;
  readonly level: number;
  readonly location: string | null;
  readonly priority: EViewPriority;
  readonly specialization: string;
  readonly skills: {
    [id: string]: boolean;
  };
  readonly hiringDate: Date;
}
