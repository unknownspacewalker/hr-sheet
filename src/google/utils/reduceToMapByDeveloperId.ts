interface DeveloperInterface {
  DeveloperId: number;
}

const reduceToMapByDeveloperId = <T extends DeveloperInterface>(
  data: T[]
): Map<number, T> =>
  data.reduce(
    (accumulator: Map<number, T>, value: T) =>
      accumulator.set(value.DeveloperId, value),
    new Map()
  );

export default reduceToMapByDeveloperId;
