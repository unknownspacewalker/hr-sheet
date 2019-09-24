import { EPriority, EViewPriority } from '../interfaces/EPriority';

const formatPriority = (priority: number): EViewPriority => {
  switch (priority) {
    case EPriority.Bench:
      return EViewPriority.Bench;
    case EPriority.InternalProject:
      return EViewPriority.InternalProject;
    case EPriority.CustomerProject:
      return EViewPriority.CustomerProject;
    default:
      throw new Error(`Undefined priority ${priority}`);
  }
};

export default formatPriority;
