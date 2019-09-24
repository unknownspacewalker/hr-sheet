import ISheetRowData from '../interfaces/ISheetRowData';

const reduceToMapByDeveloperId = (
  data: ISheetRowData[],
): Map<number, ISheetRowData> => data.reduce(
  (accumulator: Map<number, ISheetRowData>, value: ISheetRowData) => (
    accumulator.set(value.DeveloperId, value)
  ),
  new Map(),
);

export default reduceToMapByDeveloperId;
