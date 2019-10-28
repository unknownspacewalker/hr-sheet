/* eslint-disable no-undef */
import * as fc from 'fast-check';

import createFromEmployee from '../createFromEmployee';
import { EViewPriority } from '../../interfaces/EPriority';
import IEmployee from '../../../interfaces/IEmployee';

const factoryEmployeeArbitrary = () => fc.record<IEmployee>({
  id: fc.nat(),
  manager: fc.option(fc.unicodeString(), 10),
  username: fc.option(fc.unicodeString(), 10),
  firstName: fc.option(fc.unicodeString(), 10),
  familyName: fc.option(fc.unicodeString(), 10),
  track: fc.option(fc.fullUnicode(), 10),
  level: fc.nat(),
  location: fc.option(fc.unicodeString(), 10),
  priority: fc.oneof<EViewPriority>(
    fc.constant<EViewPriority>(EViewPriority.Bench),
    fc.constant<EViewPriority>(EViewPriority.InternalProject),
    fc.constant<EViewPriority>(EViewPriority.CustomerProject),
  ),
  specialization: fc.unicodeString(),
  skills: fc.record<{ [id: string]: boolean }>({ 'a': fc.boolean() }),
  hiringDate: fc.date(),
});

// test('Result is made of arbitrary', () => {
//   fc.assert(
//     fc.property(
//       fc.tuple<ISheetRowData, ISheetRowData>(
//         factoryRowDataArbitrary(),
//         factoryRowDataArbitrary(),
//       ),
//       (data: [ISheetRowData, ISheetRowData]) => {
//         const [arb1, arb2] = data;

//         const result = populateWithUserInput(arb1, arb2);
//         Object.entries(result).forEach(([key, value]: [keyof ISheetRowData, any]) => {
//           expect([arb1[key], arb2[key]]).toContain(value);
//         });
//       },
//     ),
//   );
// });

test('Function is idempotent, not changes original value', () => {
  fc.assert(
    fc.property(
      factoryEmployeeArbitrary(),
      (arb1: IEmployee) => {
        const arb1Clone = { ...arb1 };

        createFromEmployee(arb1);
        // expect(createFromEmployee(arb1)).toEqual(populateWithUserInput(arb1, arb2));

        expect(arb1Clone).toEqual(arb1);
      },
    ),
  );
});
