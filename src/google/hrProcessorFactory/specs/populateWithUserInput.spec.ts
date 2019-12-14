/* eslint-disable no-undef */
import * as fc from 'fast-check';

import populateWithUserInput from '../populateWithUserInput';
import { EPriority } from '../../interfaces/EPriority';
import SheetRowDataInterface from '../../interfaces/SheetRowDataInterface';

const factoryRowDataArbitrary = () => fc.record<SheetRowDataInterface>({
  DM: fc.unicodeString(),
  Availability: fc.unicodeString(),
  DeveloperId: fc.nat(),
  Developer: fc.unicodeString(),
  Location: fc.unicodeString(),
  Grade: fc.unicodeString(),
  English: fc.boolean(),
  React: fc.boolean(),
  Angular: fc.boolean(),
  NodeJS: fc.boolean(),
  Willingness: fc.boolean(),
  Priority: fc.oneof<EPriority>(
    fc.constant<EPriority>(EPriority.Bench),
    fc.constant<EPriority>(EPriority.InternalProject),
    fc.constant<EPriority>(EPriority.CustomerProject),
  ),
  PlannedInterviews: fc.array(fc.unicodeString()),
});

test('Result is made of arbitrary', () => {
  fc.assert(
    fc.property(
      fc.tuple<SheetRowDataInterface, SheetRowDataInterface>(
        factoryRowDataArbitrary(),
        factoryRowDataArbitrary(),
      ),
      (data: [SheetRowDataInterface, SheetRowDataInterface]) => {
        const [arb1, arb2] = data;

        const result = populateWithUserInput(arb1, arb2);
        Object.entries(result).forEach(([key, value]: [keyof SheetRowDataInterface, any]) => {
          expect([arb1[key], arb2[key]]).toContain(value);
        });
      },
    ),
  );
});

test('Function is idempotent, not changes original value', () => {
  fc.assert(
    fc.property(
      fc.tuple<SheetRowDataInterface, SheetRowDataInterface>(
        factoryRowDataArbitrary(),
        factoryRowDataArbitrary(),
      ),
      (data: [SheetRowDataInterface, SheetRowDataInterface]) => {
        const [arb1, arb2] = data;
        const arb1Clone = { ...arb1 };
        const arb2Clone = { ...arb2 };

        expect(populateWithUserInput(arb1, arb2)).toEqual(populateWithUserInput(arb1, arb2));
        expect(populateWithUserInput(arb1, arb2))
          .toEqual(populateWithUserInput(arb1, populateWithUserInput(arb1, arb2)));

        expect(arb1Clone).toEqual(arb1);
        expect(arb2Clone).toEqual(arb2);
      },
    ),
  );
});
