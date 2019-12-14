/* eslint-disable no-undef */
import * as fc from 'fast-check';
import compareSheetRowData, { ComparableInterface } from '../compareSheetRowData';
import { EPriority } from '../../interfaces/EPriority';

const factoryCompareArbitrary = () => fc.record<ComparableInterface>({
  Willingness: fc.boolean(),
  Priority: fc.oneof<EPriority>(
    fc.constant<EPriority>(EPriority.Bench),
    fc.constant<EPriority>(EPriority.InternalProject),
    fc.constant<EPriority>(EPriority.CustomerProject),
  ),
  PlannedInterviews: fc.array(fc.unicodeString()),
});

test('Change order negotiates result', () => {
  fc.assert(
    fc.property(
      fc.tuple<ComparableInterface, ComparableInterface>(
        factoryCompareArbitrary(),
        factoryCompareArbitrary(),
      ),
      (data: [ComparableInterface, ComparableInterface]) => {
        const [arb1, arb2] = data;
        expect(compareSheetRowData(arb1, arb2) + compareSheetRowData(arb2, arb1)).toBe(0);
      },
    ),
  );
});

test('Function is idempotent, not changes original value', () => {
  fc.assert(
    fc.property(
      fc.tuple<ComparableInterface, ComparableInterface>(
        factoryCompareArbitrary(),
        factoryCompareArbitrary(),
      ),
      (data: [ComparableInterface, ComparableInterface]) => {
        const [arb1, arb2] = data;
        const arb1Clone = { ...arb1 };
        const arb2Clone = { ...arb2 };
        expect(compareSheetRowData(arb1, arb2)).toBe(compareSheetRowData(arb1, arb2));
        expect(arb1Clone).toEqual(arb1);
        expect(arb2Clone).toEqual(arb2);
      },
    ),
  );
});
