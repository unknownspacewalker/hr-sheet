interface IDeveloper {
  DeveloperId: number;
}

const reduceToMapByDeveloperId = <T extends IDeveloper>(
  data: T[],
): Map<number, T> => data.reduce(
    (accumulator: Map<number, T>, value: T) => (
      accumulator.set(value.DeveloperId, value)
    ),
    new Map(),
  );

export default reduceToMapByDeveloperId;
