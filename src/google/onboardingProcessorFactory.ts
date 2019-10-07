import GoogleWrapper from './GoogleWrapper';
import CommonProcessor from './CommonProcessor';
import simpleProcessorFactory, { NameSheetData } from './simpleProcessorFactory';
import { ISheetRawRow } from './interfaces/ISheetRaw';

interface OnboardingProcessor extends CommonProcessor<NameSheetData> {
  readonly onboardedEmployees: number[];
}

const onboardingProcessorFactory = (wrapper: GoogleWrapper): OnboardingProcessor => {
  let processor = simpleProcessorFactory(wrapper);
  let onboardedEmployees: number[] = [];

  processor = new Proxy(processor, {
    get: (target: CommonProcessor<NameSheetData>, targetProperty, receiver) => {
      if (targetProperty === 'onboardedEmployees') {
        return onboardedEmployees;
      }

      return Reflect.get(target, targetProperty, receiver);
    },
  });

  processor.sync = new Proxy(processor.sync, {
    apply: (target, targetThis, applyArguments) => {
      const result = Reflect.apply(target, targetThis, applyArguments);

      result.then((response: any) => {
        onboardedEmployees = response.data.responses[0].updatedData.values.reduce(
          (accumulator: number[], rowData: ISheetRawRow) => {
            if (typeof rowData[2] !== 'undefined' && rowData[2].length > 0) {
              return [...accumulator, Number(rowData[0])];
            }
            return accumulator;
          }, [],
        );
        return response;
      });

      return result;
    },
  });

  return Object.assign(processor);
};

export default onboardingProcessorFactory;
