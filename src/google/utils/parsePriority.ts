import { EPriority, EViewPriority } from '../interfaces/EPriority';

const parsePriority = (priority: string): EPriority => {
  switch (priority) {
    case EViewPriority.Bench:
      return EPriority.Bench;
    case EViewPriority.InternalProject:
      return EPriority.InternalProject;
    case EViewPriority.CustomerProject:
      return EPriority.CustomerProject;
    default:
      throw new Error(`Undefined priority ${priority}`);
  }
};

export default parsePriority;
